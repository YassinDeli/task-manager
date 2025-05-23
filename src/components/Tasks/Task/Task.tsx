import React from "react";
import { api } from "@/api";
import ContentSection from "@/components/Common/ContentSection";
import { useDebounce } from "@/hooks/useDebounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TaskActionsContext } from "./data-table/action-context";
import { DataTable } from "./data-table/data-table";
import { getTaskColumns } from "./data-table/columns";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { useTaskUpdateSheet } from "./modals/TaskUpdateSheet";
import { useTaskDeleteDialog } from "./modals/TaskDeleteDialog";
import { useTaskDuplicateDialog } from "./modals/TaskDuplicateDialog";
import { toast } from "sonner";
import { Task } from "@/types";
import { useTaskStore } from "@/hooks/stores/useTaskStore";
import { useTaskCreateSheet } from "./modals/TaskCreateSheet";
import { ServerResponse } from "@/types";

export default function Tasks() {
  const { setRoutes } = useBreadcrumb();
  const queryClient = useQueryClient();
  const taskStore = useTaskStore();

  React.useEffect(() => {
    setRoutes?.([
      { title: "Tasks", href: "/tasks" },
      { title: "Table-Tasks", href: "/tasks/tasks" },
    ]);
  }, [setRoutes]);

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage } = useDebounce(page, 500);

  const [size, setSize] = React.useState(5);
  const { value: debouncedSize } = useDebounce(size, 500);

  const [sortDetails, setSortDetails] = React.useState({
    order: true,
    sortKey: "id",
  });
  const { value: debouncedSortDetails } = useDebounce(sortDetails, 500);

  const [searchTerm, setSearchTerm] = React.useState("");
  const { value: debouncedSearchTerm } = useDebounce(searchTerm, 500);

  const {
    data: tasksResponse,
    isFetching: isTasksPending,
    refetch: refetchTasks,
  } = useQuery({
    queryKey: [
      "tasks",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.task.findPaginated({
        page: debouncedPage.toString(),
        size: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey}:${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        search: debouncedSearchTerm,
      }),
  });

  const tasks = React.useMemo(() => {
    return tasksResponse?.data || [];
  }, [tasksResponse]);

  const { mutate: createTask, isPending: isCreationPending } = useMutation({
    mutationFn: (task: Partial<Task>) => api.task.create(task),
    onSuccess: (response: ServerResponse<Task>) => {
      toast(response.message);
      refetchTasks();
      taskStore.reset();
      closeCreateTaskSheet();
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const { mutate: updateTask, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { id: number; task: Partial<Task> }) =>
      api.task.update(data.id, data.task),
    onSuccess: (response: ServerResponse<Task>) => {
      toast(response.message);
      refetchTasks();
      taskStore.reset();
      closeUpdateTaskSheet();
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const { mutate: deleteTask, isPending: isDeletionPending } = useMutation({
    mutationFn: (id: number) => api.task.remove(id),
    onSuccess: (response: ServerResponse<Task>) => {
      toast(response.message);
      refetchTasks();
      taskStore.reset();
      closeDeleteTaskDialog();
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const { mutate: duplicateTask, isPending: isDuplicationPending } =
    useMutation({
      mutationFn: (id: number) => api.task.duplicate(id),
      onSuccess: (response: ServerResponse<Task>) => {
        toast(response.message);
        refetchTasks();
        taskStore.reset();
        closeDuplicateTaskDialog();
      },
      onError: (error) => {
        toast(error.message);
      },
    });

  const handleCreateSubmit = () => {
    const data = taskStore.getTask();
    const payload: Partial<Task> = {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate,
      userId: data.userId || null,
      employeeId: data.employeeId || null,
      projectId: data.projectId || null,
    };
    createTask(payload);
  };

  const handleUpdateSubmit = () => {
    const data = taskStore.getTask();
    const payload: Partial<Task> = {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate,
      userId: data.userId || null,
      employeeId: data.employeeId || null,
      projectId: data.projectId || null, // Ensure projectId is included and provide a default value if undefined
    };
    updateTask({
      id: data.id!,
      task: payload,
    });
  };

  const { createTaskSheet, openCreateTaskSheet, closeCreateTaskSheet } =
    useTaskCreateSheet({
      createTask: handleCreateSubmit,
      isCreatePending: isCreationPending,
      resetTask: () => taskStore.reset(),
    });

  const { updateTaskSheet, openUpdateTaskSheet, closeUpdateTaskSheet } =
    useTaskUpdateSheet({
      updateTask: handleUpdateSubmit,
      isUpdatePending: isUpdatePending,
      resetTask: () => taskStore.reset(),
    });

  const { deleteTaskDialog, openDeleteTaskDialog, closeDeleteTaskDialog } =
    useTaskDeleteDialog({
      taskLabel: taskStore.title,
      deleteTask: () => deleteTask(taskStore.id ?? 0), // Ensure taskStore.id is not undefined
      isDeletionPending,
      resetTask: () => taskStore.reset(),
    });

  const {
    duplicateTaskDialog,
    openDuplicateTaskDialog,
    closeDuplicateTaskDialog,
  } = useTaskDuplicateDialog({
    taskLabel: taskStore.title,
    duplicateTask: () => duplicateTask(taskStore.id ?? 0), // Ensure taskStore.id is not undefined
    isDuplicationPending,
    resetTask: () => taskStore.reset(),
  });

  const context = {
    openCreateTaskSheet,
    openUpdateTaskSheet,
    openDeleteTaskDialog,
    openDuplicateTaskDialog,
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: tasksResponse?.meta.pageCount || 0,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
  };

  const isPending =
    isTasksPending ||
    isCreationPending ||
    isUpdatePending ||
    isDeletionPending ||
    isDuplicationPending;

  return (
    <TaskActionsContext.Provider value={context}>
      <ContentSection
        title="Tasks"
        desc="Define and assign tasks to streamline permissions and access control for users."
        className="w-full"
      >
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          columns={getTaskColumns()}
          data={tasks}
          isPending={isPending}
        />
      </ContentSection>
      {createTaskSheet}
      {deleteTaskDialog}
      {updateTaskSheet}
      {duplicateTaskDialog}
    </TaskActionsContext.Provider>
  );
}
