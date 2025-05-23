import { NotebookTabs } from "lucide-react";
import { useSheet } from "@/components/Common/Sheets";
import { useTaskStore } from "@/hooks/stores/useTaskStore";
import { useUsers } from "@/hooks/content/useUsers";
import { useProjects } from "@/hooks/content/useProjects"; // Import the useProjects hook
import { TaskForm } from "@/components/Tasks/Task/TaskForm";
import { Task } from "@/types/task";
import { taskSchema } from "@/types/validations/task.validation"; // Import the Zod schema
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Common/Spinner";

interface TaskUpdateCard {
  updateTask?: (task: Task) => void;
  isUpdatePending?: boolean;
  resetTask?: () => void;
}

export const useTaskUpdateCard = ({
  updateTask,
  isUpdatePending,
  resetTask,
}: TaskUpdateCard) => {
  const { users, isFetchUsersPending } = useUsers();
  const { projects, isFetchProjectsPending } = useProjects(); // Fetch projects
  const taskStore = useTaskStore();

  const handleSubmit = () => {
    const taskData = taskStore.getTask();
    console.log("Task data before validation:", taskData); // Log the task data before validation

    // Convert projectId to number if it's a string
    if (typeof taskData.projectId === 'string') {
      taskData.projectId = parseInt(taskData.projectId);
    }

    const result = taskSchema.safeParse(taskData);
    if (!result.success) {
      console.log("Validation errors:", result.error.flatten().fieldErrors); // Log validation errors
      taskStore.set("errors", result.error.flatten().fieldErrors);
      return;
    }

    console.log("Task data after validation:", taskData); // Log the task data after validation
    taskStore.set("errors", {});

    updateTask?.(taskData as Task);
    closeUpdateTaskCard();
  };

  const {
    SheetFragment: updateTaskCard,
    openSheet: openUpdateTaskCard,
    closeSheet: closeUpdateTaskCard,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <NotebookTabs />
        Edit Task
      </div>
    ),
    description:
      "Use this form to edit an existing task within the system. Fill in all required fields to ensure the task is successfully updated.",
    children: (
      <div>
        <TaskForm
          users={users}
          projects={projects} // Pass projects to TaskForm
          loading={isUpdatePending}
          onSubmit={handleSubmit}
          className="my-4"
        />
        <div className="flex gap-2 justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isUpdatePending || isFetchUsersPending || isFetchProjectsPending} // Disable the button if task update or fetching is pending
          >
            Save
            <Spinner show={isUpdatePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              resetTask?.();
              closeUpdateTaskCard();
            }}
            disabled={isUpdatePending || isFetchUsersPending || isFetchProjectsPending} // Disable the button if task update or fetching is pending
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    className: "min-w-[25vw]",
    onToggle: resetTask,
  });

  const openEditTaskCard = (task: Task) => {
    taskStore.setTask(task); // Set the task data in the store
    openUpdateTaskCard();
  };

  return {
    updateTaskCard,
    openEditTaskCard,
    closeUpdateTaskCard,
  };
};
