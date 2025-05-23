import { Button } from "@/components/ui/button";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { cn } from "@/lib/utils";
import React from "react";
import { ProjectInformation } from "./form/ProjectInformation";
import { UserSelection } from "./form/ProjectManagerSelection";
import { useProjectStore } from "@/hooks/stores/useProjectStore";
import { projectSchema } from "@/types/validations/project.validation";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { Stepper } from "@/components/ui/stepper";
import { ProjectValidation } from "./form/ProjectValidation";
import { ProjectConfirmation } from "./form/ProjectConfirmation";
import {
  ServerErrorResponse,
  ServerResponse,
} from "@/types/utils/server.response";
import { Project } from "@/types/project";

interface ProjectCreateFormProps {
  className?: string;
}

export const ProjectCreateForm = ({ className }: ProjectCreateFormProps) => {
  const router = useRouter();
  const { setRoutes } = useBreadcrumb();

  React.useEffect(() => {
    setRoutes?.([
      { title: "Projects", href: "/projects" },
      { title: "Project", href: "/projects/projects" },
      { title: "New Project", href: "/projects/new-project" },
    ]);
  }, [setRoutes]);

  const projectStore = useProjectStore();

  const { mutate: createProject, isPending: isCreatePending } = useMutation({
    mutationFn: async (data: Partial<Project>) => api.project.create(data),
    onSuccess: (res: ServerResponse<Project>) => {
      router.push("/projects/project");
      toast.success(res.message);
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data.error);
    },
  });

  const steps = [
    {
      title: "Project Information",
      description: "Enter basic project details",
    },
    {
      title: "Assign Manager",
      description: "Select project manager",
    },
    {
      title: "Review",
      description: "Validate project information",
    },
    {
      title: "Confirmation",
      description: "Create your project",
    },
  ];

  const [currentStep, setCurrentStep] = React.useState(0);

  const isStep1Valid = () => {
    const projectObject = projectStore.getProject();
    const projectResult = projectSchema.safeParse(projectObject);
    if (!projectResult.success) {
      projectStore.set("errors", projectResult.error.flatten().fieldErrors);
    }
    return projectResult.success;
  };

  const isStep2Valid = () => {
    const projectObject = projectStore.getProject();
    if (!projectObject.userId) {
      projectStore.set("errors", { userId: ["Project manager is required"] });
      return false;
    }
    return true;
  };

  const handleCreateProject = () => {
    const projectObject = projectStore.getProject();
    createProject(projectObject);
  };

  const nextStep = () => {
    let valid = true;

    if (currentStep === 0) {
      valid = isStep1Valid();
    } else if (currentStep === 1) {
      valid = isStep2Valid();
    }

    if (valid && currentStep + 1 < steps.length) {
      setCurrentStep(currentStep + 1);
    } else if (valid) {
      handleCreateProject();
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ProjectInformation />;
      case 1:
        return <UserSelection />;
      case 2:
        return <ProjectValidation />;
      case 3:
        return <ProjectConfirmation onConfirm={handleCreateProject} />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("flex flex-col overflow-hidden px-10", className)}>
      <Stepper steps={steps} currentStep={currentStep} />
      <div className="py-6">{renderStepContent()}</div>
      <div className="fixed bottom-0 left-0 w-full bg-transparent p-4 flex justify-end gap-2">
        {currentStep !== 0 && (
          <Button variant="outline" onClick={prevStep}>
            Previous
          </Button>
        )}
        <Button onClick={nextStep} disabled={isCreatePending}>
          {currentStep === steps.length - 1 ? "Create Project" : "Next"}
        </Button>
      </div>
    </div>
  );
};
