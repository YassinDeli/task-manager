import { Check, CheckCircle, CircleDot, Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "./separator";
import React from "react";

interface StepProps {
  className?: string;
  title: string;
  description?: string;
  isActive?: boolean;
  isCompleted?: boolean;
  isLastStep?: boolean;
}

const Step = ({
  className,
  title,
  description,
  isActive = false,
  isCompleted = false,
  isLastStep = false,
}: StepProps) => {
  return (
    <li className={cn("flex flex-col w-full", className)}>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <div className="flex">
            <div
              className={cn(
                "z-10 flex  items-center justify-center rounded-full border-2",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : isCompleted
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/20 bg-background text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <CheckCircle />
              ) : isActive ? (
                <CircleDot />
              ) : (
                <Dot />
              )}
            </div>
            {!isLastStep && <div className={cn("w-full")} />}
          </div>
          <div className="mt-2">
            <h3
              className={cn(
                "text-sm font-medium",
                isActive || isCompleted
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
        <Separator className="shrink-1" />
      </div>
    </li>
  );
};

interface StepperProps {
  steps: Array<{
    title: string;
    description?: string;
  }>;
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("flex w-full", className)}>
      <ol className="flex flex-row items-center gap-4 w-full">
        {steps.map((step, index) => (
          <Step
            key={index}
            title={step.title}
            description={step.description}
            isActive={currentStep === index}
            isCompleted={currentStep > index}
            isLastStep={index === steps.length - 1}
          />
        ))}
      </ol>
    </div>
  );
}
