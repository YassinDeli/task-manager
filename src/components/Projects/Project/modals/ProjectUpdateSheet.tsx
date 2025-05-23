import { Button } from "@/components/ui/button";
import { useSheet } from "@/components/Common/Sheets";
import { Spinner } from "@/components/Common/Spinner";
import { ProjectInformation } from "@/components//Projects/Project/form/ProjectInformation"; // Adjust the path as needed
import { ResponsibleInformation } from "@/components/Projects/Project/form/ResponsableInformation"; // Adjust the path as needed
import { useProjectStore } from "@/hooks/stores/useProjectStore";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { useEmployeeStore } from "@/hooks/stores/useEmployeeStore";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import { toast } from "sonner";
import { ServerResponse } from "@/types";
import { Project } from "@/types/project"; // Adjust the path as needed
import { FolderOpen } from "lucide-react"; // Import the icon
import { UserSelection } from "../form/ProjectManagerSelection";

interface ProjectUpdateSheetProps {
  updateProject?: () => void;
  isUpdatePending?: boolean;
  resetProject?: () => void;
}

export const useProjectUpdateSheet = ({
  updateProject,
  isUpdatePending,
  resetProject,
}: ProjectUpdateSheetProps) => {
  const projectStore = useProjectStore();
  const userStore = useUserStore();
  const employeeStore = useEmployeeStore();

  const {
    SheetFragment: updateProjectSheet,
    openSheet: openUpdateProjectSheet,
    closeSheet: closeUpdateProjectSheet,
  } = useSheet({
    title: (
      <div className="flex items-center">
        <FolderOpen className="mr-2" /> {/* Add the icon here */}
        <span>Update Project</span>
      </div>
    ),
    description:
      "Update the project details and responsible person information",
    children: (
      <div className="space-y-6">
        {/* Project Information Section */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium">Project Details</h3>
          <ProjectInformation />
          <UserSelection />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end pt-4">
          <Button onClick={updateProject} disabled={isUpdatePending}>
            Update Project
            <Spinner show={isUpdatePending} />
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              resetProject?.();
              closeUpdateProjectSheet();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    className: "min-w-[50vw] max-h-[90vh] overflow-y-auto",
    onToggle: () => {
      resetProject?.();
      userStore.reset();
      employeeStore.reset();
    },
  });

  return {
    updateProjectSheet,
    openUpdateProjectSheet,
    closeUpdateProjectSheet,
  };
};
