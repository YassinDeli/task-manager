import { Button } from "@/components/ui/button";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { cn } from "@/lib/utils";
import React from "react";
import { EntrepriseInformation } from "./form/EntrepriseInformation";
import { useEntrepriseStore } from "@/hooks/stores/useEntrepriseStore";
import { addressSchema } from "@/types/validations/address.validation";
import {
  employeeSchema,
  entrepriseSchema,
} from "@/types/validations/entreprise.validation";
import { ResponsibleInformation } from "./form/ResponsableInformation";
import { useUserStore } from "@/hooks/stores/useUserStore";
import {
  Address,
  baseUserSchema,
  Employee,
  Entreprise,
  ServerErrorResponse,
  ServerResponse,
  User,
} from "@/types";
import { useEmployeeStore } from "@/hooks/stores/useEmployeeStore";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { Stepper } from "@/components/ui/stepper";

interface EntrepriseCreateFormProps {
  className?: string;
}
export const EntrepriseCreateForm = ({
  className,
}: EntrepriseCreateFormProps) => {
  //router
  const router = useRouter();
  //breadcrumb
  const { setRoutes } = useBreadcrumb();

  React.useEffect(() => {
    setRoutes?.([
      { title: "Management", href: "/management" },
      { title: "Entreprises", href: "/management/entreprises" },
      { title: "New Entreprise", href: "/management/new-entreprise" },
    ]);
  }, []);

  const entrepriseStore = useEntrepriseStore();
  const userStore = useUserStore();
  const employeeStore = useEmployeeStore();

  const { mutate: createEntreprise, isPending: isCreatePending } = useMutation({
    mutationFn: async (data: Partial<Entreprise>) =>
      api.entreprise.create(data),
    onSuccess: (res: ServerResponse<Entreprise>) => {
      router.push("/management/entreprises");
      toast.success(res.message);
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data.error);
    },
  });

  const steps = [
    {
      title: "Step 1",
      description: "Entreprise Information",
    },
    {
      title: "Step 2",
      description: "Responsible Information",
    },
  ];

  const [currentStep, setCurrentStep] = React.useState(0);

  const isStep1Valid = () => {
    const entrepriseObject = entrepriseStore.getEntreprise();
    const addressObject = entrepriseStore.getEntrepriseAddress();

    const entrepriseResult = entrepriseSchema.safeParse(entrepriseObject);
    if (!entrepriseResult.success) {
      entrepriseStore.set(
        "errors",
        entrepriseResult.error.flatten().fieldErrors
      );
    }

    const addressResult = addressSchema.safeParse(addressObject);
    if (!addressResult.success) {
      entrepriseStore.set(
        "addressErrors",
        addressResult.error.flatten().fieldErrors
      );
    }

    return addressResult.success && entrepriseResult.success;
  };

  const isStep2Valid = () => {
    const userObject = userStore.getUser();
    const employeeObject = employeeStore.getEmployee();

    const userResult = baseUserSchema.safeParse(userObject);
    if (!userResult.success) {
      userStore.set("errors", userResult.error.flatten().fieldErrors);
    }

    const employeeResult = employeeSchema.safeParse(employeeObject);
    if (!employeeResult.success) {
      employeeStore.set("errors", employeeResult.error.flatten().fieldErrors);
    }
    return userResult.success && employeeResult.success;
  };

  const handleCreateEntreprise = () => {
    const entrepriseObject = entrepriseStore.getEntreprise();
    const addressObject = entrepriseStore.getEntrepriseAddress();
    const employeeObject = employeeStore.getEmployee();
    const userObject = userStore.getUser();

    createEntreprise({
      ...entrepriseObject,
      address: addressObject as Address,
      responsible: {
        ...employeeObject,
        user: userObject as User,
      } as Employee,
    });
  };

  const nextStep = () => {
    let valid;
    if (currentStep == 0) {
      valid = isStep1Valid();
    }
    if (currentStep == 1) {
      valid = isStep2Valid();
    }
    if (valid && currentStep + 1 < steps.length)
      setCurrentStep(currentStep + 1);
    else if (valid) {
      handleCreateEntreprise();
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="min-h-40 flex items-center justify-center">
            <EntrepriseInformation />
          </div>
        );
      case 1:
        return (
          <div className="min-h-40 flex items-center justify-center">
            <ResponsibleInformation />
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className={cn("flex flex-col overflow-hidden px-10", className)}>
      <Stepper steps={steps} currentStep={currentStep} />
      {renderStepContent()}
      <div className="fixed bottom-0 left-0 w-full bg-transparent p-4 flex justify-end gap-2">
        {currentStep !== 0 && (
          <Button variant="outline" onClick={prevStep}>
            Previous
          </Button>
        )}
        <Button onClick={nextStep}>
          {currentStep === steps.length - 1 ? "Complete" : "Next"}
        </Button>
      </div>
    </div>
  );
};
