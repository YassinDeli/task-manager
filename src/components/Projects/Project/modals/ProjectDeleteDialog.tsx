import { useDialog } from "@/components/Common/Dialogs";
import { Spinner } from "@/components/Common/Spinner";
import { Button } from "@/components/ui/button";

interface ProjectDeleteDialogProps {
  projectLabel?: string;
  deleteProject?: () => void;
  isDeletionPending?: boolean;
  resetProject?: () => void;
}

export const useProjectDeleteDialog = ({
  projectLabel,
  deleteProject,
  isDeletionPending,
  resetProject,
}: ProjectDeleteDialogProps) => {
  const {
    DialogFragment: deleteProjectDialog,
    openDialog: openDeleteProjectDialog,
    closeDialog: closeDeleteProjectDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        Delete Project <span className="font-light">{projectLabel}</span> ?
      </div>
    ),
    description:
      "This action is permanent and cannot be undone. All associations with this project will also be removed.",
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deleteProject?.();
              closeDeleteProjectDialog();
            }}
          >
            Confirm
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              resetProject?.();
              closeDeleteProjectDialog();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetProject,
  });

  return {
    deleteProjectDialog,
    openDeleteProjectDialog,
    closeDeleteProjectDialog,
  };
};
