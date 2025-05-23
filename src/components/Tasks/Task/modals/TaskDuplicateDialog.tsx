import { useDialog } from "@/components/Common/Dialogs";
import { Spinner } from "@/components/Common/Spinner";
import { Button } from "@/components/ui/button";

interface TaskDuplicateDialogProps {
  taskLabel?: string;
  duplicateTask?: () => void;
  isDuplicationPending?: boolean;
  resetTask?: () => void;
}

export const useTaskDuplicateDialog = ({
  taskLabel,
  duplicateTask,
  isDuplicationPending,
  resetTask,
}: TaskDuplicateDialogProps) => {
  const {
    DialogFragment: duplicateTaskDialog,
    openDialog: openDuplicateTaskDialog,
    closeDialog: closeDuplicateTaskDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        Duplicate Task <span className="font-light">{taskLabel}</span> ?
      </div>
    ),
    description:
      "This action will duplicate the task, including all its associations. You can undo this action later if needed.",
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              duplicateTask?.();
              closeDuplicateTaskDialog();
            }}
          >
            Confirm
            <Spinner show={isDuplicationPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeDuplicateTaskDialog();
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
    duplicateTaskDialog,
    openDuplicateTaskDialog,
    closeDuplicateTaskDialog,
  };
};
