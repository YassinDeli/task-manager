/* import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskForm } from "@/components/Tasks/Task/TaskForm";
import { useUsers } from "@/hooks/content/useUsers";
import { useSheet } from "@/components/Common/Sheets";
import { Spinner } from "@/components/Common/Spinner";
import { useTaskStore } from "@/hooks/stores/useTaskStore";
import { Task } from "@/types/task";
import { taskSchema } from "@/types/validations/task.validation"; // Import the Zod schema

interface TaskCreateCard {
  createTask?: (task: Partial<Task>) => void; // Change to Partial<Task>
  isCreatePending?: boolean;
  resetTask?: () => void;
}

export const useTaskCreateCard = ({
  createTask,
  isCreatePending,
  resetTask,
}: TaskCreateCard) => {
  const { users, isFetchUsersPending } = useUsers();
  const taskStore = useTaskStore();

  const {
    SheetFragment: createTaskCard,
    openSheet: openCreateTaskCard,
    closeSheet: closeCreateTaskCard,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <User />
        New Task
      </div>
    ),
    description:
      "Use this form to define a new task within the system. Fill in all required fields to ensure the task is successfully added.",
    children: (
      <div>
        <TaskForm className="my-4" users={users} />
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
                closeCreateTaskCard();
              }
            }}
            disabled={isCreatePending}
          >
            Save
            <Spinner show={isCreatePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              resetTask?.();
              closeCreateTaskCard();
            }}
            disabled={isCreatePending}
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
    createTaskCard,
    openCreateTaskCard,
    closeCreateTaskCard,
  };
};
 */