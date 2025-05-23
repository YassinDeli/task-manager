import { NotebookTabs } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskForm } from "../TaskForm";
import { useSheet } from "@/components/Common/Sheets";
import { Spinner } from "@/components/Common/Spinner";
import { useUsers } from "@/hooks/content/useUsers";
import { useProjects } from "@/hooks/content/useProjects";
import { useTaskStore } from "@/hooks/stores/useTaskStore";
import { taskSchema } from "@/types/validations/task.validation";
import { Task } from "@/types/task";

interface TaskUpdateSheet {
  updateTask?: (task: Partial<Task>) => void;
  isUpdatePending?: boolean;
  resetTask?: () => void;
}

export const useTaskUpdateSheet = ({
  updateTask,
  isUpdatePending,
  resetTask,
}: TaskUpdateSheet) => {
  const { users, isFetchUsersPending } = useUsers();
  const { projects, isFetchProjectsPending } = useProjects();
  const taskStore = useTaskStore();

  const handleSubmit = () => {
    const taskData = taskStore.getTask();
    
    // Convert projectId to number if it's a string
    if (typeof taskData.projectId === 'string') {
      taskData.projectId = parseInt(taskData.projectId);
    }

    const result = taskSchema.safeParse(taskData);
    if (!result.success) {
      taskStore.set("errors", result.error.flatten().fieldErrors);
      return;
    }

    taskStore.set("errors", {});

    // Ensure all required fields are present before updating
    if (taskData.title && taskData.id) {
      updateTask?.({
        ...taskData,
        projectId: taskData.projectId || null, // Ensure projectId is properly typed
      });
    }
  };

  const {
    SheetFragment: updateTaskSheet,
    openSheet: openUpdateTaskSheet,
    closeSheet: closeUpdateTaskSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <NotebookTabs />
        Update Task
      </div>
    ),
    description:
      "Use this form to update an existing Task within the system.",
    children: (
      <div>
        <TaskForm 
          className="my-4" 
          users={users} 
          projects={projects}
          loading={isUpdatePending}
        />
        <div className="flex gap-2 justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isUpdatePending || isFetchUsersPending || isFetchProjectsPending}
          >
            Update
            <Spinner show={isUpdatePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              resetTask?.();
              closeUpdateTaskSheet();
            }}
            disabled={isUpdatePending || isFetchUsersPending || isFetchProjectsPending}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    className: "min-w-[25vw]",
    onToggle: resetTask,
  });

  return {
    updateTaskSheet,
    openUpdateTaskSheet,
    closeUpdateTaskSheet,
  };
};