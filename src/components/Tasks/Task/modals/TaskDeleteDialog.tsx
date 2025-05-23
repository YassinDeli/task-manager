import { useDialog } from "@/components/Common/Dialogs";
import { Spinner } from "@/components/Common/Spinner";
import { Button } from "@/components/ui/button";

interface TaskDeleteDialogProps {
  taskLabel?: string;
  deleteTask?: () => void;
  isDeletionPending?: boolean;
  resetTask?: () => void;
}

export const useTaskDeleteDialog = ({
  taskLabel,
  deleteTask,
  isDeletionPending,
  resetTask,
}: TaskDeleteDialogProps) => {
  const {
    DialogFragment: deleteTaskDialog,
    openDialog: openDeleteTaskDialog,
    closeDialog: closeDeleteTaskDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        Delete Task <span className="font-light">{taskLabel}</span> ?
      </div>
    ),
    description:
      "This action is permanent and cannot be undone. All associations with this task will also be removed.",
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deleteTask?.();
              closeDeleteTaskDialog();
            }}
          >
            Confirm
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              resetTask?.();
              closeDeleteTaskDialog();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetTask,
  });

  return {
    deleteTaskDialog,
    openDeleteTaskDialog,
    closeDeleteTaskDialog,
  };
};
