import { Button } from "@/components/ui/button";
import { useSheet } from "@/components/Common/Sheets";
import { Spinner } from "@/components/Common/Spinner";
import { EntrepriseInformation } from "@/components/Management/Entreprise/form/EntrepriseInformation"; // Adjust the path as needed
import { useEntrepriseStore } from "@/hooks/stores/useEntrepriseStore";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import { toast } from "sonner";
import { ServerResponse } from "@/types";
import { Entreprise, UpdateEnterpriseDto } from "@/types/entreprise"; // Adjust the path as needed
import { FolderOpen } from "lucide-react"; // Import the icon

interface EntrepriseUpdateSheetProps {
  updateEntreprise?: () => void;
  isUpdatePending?: boolean;
  resetEntreprise?: () => void;
}

export const useEntrepriseUpdateSheet = ({
  updateEntreprise,
  isUpdatePending,
  resetEntreprise,
}: EntrepriseUpdateSheetProps) => {
  const entrepriseStore = useEntrepriseStore();

  const {
    SheetFragment: updateEntrepriseSheet,
    openSheet: openUpdateEntrepriseSheet,
    closeSheet: closeUpdateEntrepriseSheet,
  } = useSheet({
    title: (
      <div className="flex items-center">
        <FolderOpen className="mr-2" /> {/* Add the icon here */}
        <span>Update Entreprise</span>
      </div>
    ),
    description: "Update the entreprise details",
    children: (
      <div className="space-y-6">
        {/* Entreprise Information Section */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium">Entreprise Details</h3>
          <EntrepriseInformation />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end pt-4">
          <Button onClick={updateEntreprise} disabled={isUpdatePending}>
            Update Entreprise
            <Spinner show={isUpdatePending} />
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              resetEntreprise?.();
              closeUpdateEntrepriseSheet();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    className: "min-w-[50vw] max-h-[90vh] overflow-y-auto",
    onToggle: () => {
      resetEntreprise?.();
    },
  });

  return {
    updateEntrepriseSheet,
    openUpdateEntrepriseSheet,
    closeUpdateEntrepriseSheet,
  };
};
