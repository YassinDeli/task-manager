import { NotebookTabs } from "lucide-react";
import { useSheet } from "@/components/Common/Sheets";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Common/Spinner";
import { TaskForm } from "../TaskForm";
import { useUsers } from "@/hooks/content/useUsers";
import { useProjects } from "@/hooks/content/useProjects"; // Import the useProjects hook
import { useTaskStore } from "@/hooks/stores/useTaskStore";
import { taskSchema } from "@/types/validations/task.validation";
import { Task } from "@/types/task";
import { Project } from "@/types/project";

interface TaskCreateSheet {
  createTask?: (task: Partial<Task>) => void;
  isCreatePending?: boolean;
  resetTask?: () => void;
}

export const useTaskCreateSheet = ({
  createTask,
  isCreatePending,
  resetTask,
}: TaskCreateSheet) => {
  const { users, isFetchUsersPending } = useUsers();
  const { projects, isFetchProjectsPending } = useProjects(); // Fetch projects
  const taskStore = useTaskStore();

  const {
    SheetFragment: createTaskSheet,
    openSheet: openCreateTaskSheet,
    closeSheet: closeCreateTaskSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <NotebookTabs />
        New Task
      </div>
    ),
    description:
      "Use this form to define a new Task within the system. A Task determines the access level and permissions granted to users assigned to it.",
    children: (
      <div>
        <TaskForm className="my-4" users={users} projects={projects} /> 
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              const taskData = taskStore.getTask();

              const result = taskSchema.safeParse(taskData);
              if (!result.success) {
                taskStore.set("errors", result.error.flatten().fieldErrors);
                return;
              }

              taskStore.set("errors", {});

              if (taskData.title) {
                createTask?.(taskData);
                closeCreateTaskSheet();
              }
            }}
            disabled={isCreatePending || isFetchUsersPending || isFetchProjectsPending} // Disable the button if task creation or fetching is pending
          >
            Save
            <Spinner show={isCreatePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              resetTask?.();
              closeCreateTaskSheet();
            }}
            disabled={isCreatePending || isFetchUsersPending || isFetchProjectsPending} // Disable the button if task creation or fetching is pending
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
    createTaskSheet,
    openCreateTaskSheet,
    closeCreateTaskSheet,
  };
};
