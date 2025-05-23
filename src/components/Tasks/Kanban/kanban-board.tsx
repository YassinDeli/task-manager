import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plus } from "lucide-react";
import { useTaskStore } from "@/hooks/stores/useTaskStore";
import { Button } from "@/components/ui/button";
import { TaskColumn } from "@/components/Tasks/Kanban/kanbanBoard/task-column";
import { TaskCard } from "@/components/Tasks/Kanban/kanbanBoard/task-card";
import { Task } from "@/types/task";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { toast } from "sonner";
import { ServerResponse } from "@/types";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { useTaskCreateSheet } from "@/components/Tasks/Task/modals/TaskCreateSheet";
import { useTaskUpdateCard } from "@/components/Tasks/Kanban/modals/edit-task-dialog";
import ContentSection from "@/components/Common/ContentSection";

interface KanbanBoardProps {
  className?: string;
}

const KanbanBoard = ({ className = "" }: KanbanBoardProps) => {
  const queryClient = useQueryClient();
  const taskStore = useTaskStore();
  const { setRoutes } = useBreadcrumb();

  React.useEffect(() => {
    setRoutes?.([
      { title: "Tasks", href: "/tasks" },
      { title: "Kanban", href: "/tasks/kanban" },
    ]);
  }, [setRoutes]);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [sortDetails, setSortDetails] = useState({
    order: true,
    sortKey: "id",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: tasksResponse,
    isFetching: isTasksPending,
    refetch: refetchTasks,
  } = useQuery({
    queryKey: [
      "tasks",
      page,
      size,
      sortDetails.order,
      sortDetails.sortKey,
      searchTerm,
    ],
    queryFn: () =>
      api.task.findPaginated({
        page: page.toString(),
        size: size.toString(),
        sort: `${sortDetails.sortKey}:${sortDetails.order ? "ASC" : "DESC"}`,
        search: searchTerm,
        join: "user",
      }),
  });

  const tasks = tasksResponse?.data || [];

  const { mutate: createTask, isPending: isCreationPending } = useMutation({
    mutationFn: (task: Partial<Task>) => api.task.create(task),
    onSuccess: (response: ServerResponse<Task>) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      taskStore.reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create task");
    },
  });

  const { mutate: updateTask, isPending: isUpdatePending } = useMutation({
    mutationFn: ({ id, task }: { id: number; task: Partial<Task> }) =>
      api.task.update(id, task),
    onSuccess: (response: ServerResponse<Task>) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      taskStore.reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update task");
    },
  });

  const { mutate: deleteTask, isPending: isDeletionPending } = useMutation({
    mutationFn: (id: number) => api.task.remove(id),
    onSuccess: (response: ServerResponse<Task>) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete task");
    },
  });

  const handleAddTask = (task: Partial<Task>) => {
    createTask(task);
  };

  const handleUpdateTask = (task: Task) => {
    updateTask({ id: task.id, task });
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(parseInt(id));
  };

  const { createTaskSheet, openCreateTaskSheet } = useTaskCreateSheet({
    createTask: handleAddTask,
    isCreatePending: isCreationPending,
    resetTask: () => taskStore.reset(),
  });

  const { updateTaskCard, openEditTaskCard } = useTaskUpdateCard({
    updateTask: (task) => {
      const updatePayload = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        userId: task.userId,
        employeeId: task.employeeId,
        projectId: task.projectId,
      };
      updateTask({ id: task.id, task: updatePayload });
    },
    isUpdatePending: isUpdatePending,
    resetTask: () => taskStore.reset(),
  });

  const moveTask = (id: string, newStatus: "TODO" | "IN_PROGRESS" | "DONE") => {
    updateTask({ id: parseInt(id), task: { status: newStatus } });
  };

  const todoTasks = tasks.filter((task) => task.status === "TODO");
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((task) => task.status === "DONE");

  return (
    <div className={className}>
      <DndProvider backend={HTML5Backend}>
        <ContentSection
          title="Kanban-Tasks"
          desc="Define and assign tasks to streamline permissions and access control for users."
          className="w-full"
        />
        <div className="mb-6 flex justify-end">
          <Button onClick={openCreateTaskSheet}>
            <Plus className="mr-2 h-4 w-4" /> Add New Task
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto h-full">
          <TaskColumn title="To Do" status="TODO" onDropTask={moveTask}>
            {todoTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => openEditTaskCard(task)}
                onDelete={() => handleDeleteTask(task.id.toString())}
              />
            ))}
          </TaskColumn>

          <TaskColumn
            title="In Progress"
            status="IN_PROGRESS"
            onDropTask={moveTask}
          >
            {inProgressTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => openEditTaskCard(task)}
                onDelete={() => handleDeleteTask(task.id.toString())}
              />
            ))}
          </TaskColumn>

          <TaskColumn title="Done" status="DONE" onDropTask={moveTask}>
            {doneTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => openEditTaskCard(task)}
                onDelete={() => handleDeleteTask(task.id.toString())}
              />
            ))}
          </TaskColumn>
        </div>

        {createTaskSheet}
        {updateTaskCard}
      </DndProvider>
    </div>
  );
};

export default KanbanBoard;
