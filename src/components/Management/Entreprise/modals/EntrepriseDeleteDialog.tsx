import { useDialog } from "@/components/Common/Dialogs";
import { Spinner } from "@/components/Common/Spinner";
import { Button } from "@/components/ui/button";

interface EntrepriseDeleteDialogProps {
  entrepriseLabel?: string;
  deleteEntreprise?: () => void;
  isDeletionPending?: boolean;
  resetEntreprise?: () => void;
}

export const useEntrepriseDeleteDialog = ({
  entrepriseLabel,
  deleteEntreprise,
  isDeletionPending,
  resetEntreprise,
}: EntrepriseDeleteDialogProps) => {
  const {
    DialogFragment: deleteEntrepriseDialog,
    openDialog: openDeleteEntrepriseDialog,
    closeDialog: closeDeleteEntrepriseDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        Delete Entreprise <span className="font-light">{entrepriseLabel}</span> ?
      </div>
    ),
    description:
      "This action is permanent and cannot be undone. All associations with this entreprise will also be removed.",
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deleteEntreprise?.();
              closeDeleteEntrepriseDialog();
            }}
          >
            Confirm
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              resetEntreprise?.();
              closeDeleteEntrepriseDialog();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetEntreprise,
  });

  return {
    deleteEntrepriseDialog,
    openDeleteEntrepriseDialog,
    closeDeleteEntrepriseDialog,
  };
};
