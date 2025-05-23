"use client";

import { useProjectStore } from "@/hooks/stores/useProjectStore";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProjectValidationProps {
  className?: string;
}

export const ProjectValidation = ({ className }: ProjectValidationProps) => {
  const project = useProjectStore();
  const user = useUserStore();

  const validationItems = [
    {
      label: "Project Name",
      isValid: !!project.name,
      value: project.name || "Not specified",
      description: "The name of your project",
    },
    {
      label: "Project Status",
      isValid: !!project.status,
      value: project.status || "Not set",
      description: "Current project status",
    },
    {
      label: "User Assignment",
      isValid: !!project.userId,
      value: project.userId ? "User assigned" : "No user assigned",
      description: "Project user assignment status",
    },
  ];

  const validCount = validationItems.filter((item) => item.isValid).length;
  const totalCount = validationItems.length;
  const isComplete = validCount === totalCount;

  return (
    <Card className={cn("w-full shadow-sm", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Validation Summary
          </CardTitle>
          <Badge
            variant={isComplete ? "default" : "outline"}
            className={cn(
              isComplete
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-amber-100 text-amber-800 hover:bg-amber-100"
            )}
          >
            {isComplete ? "Complete" : `${validCount}/${totalCount} Complete`}
          </Badge>
        </div>
        <CardDescription>
          Verify all required project information is correctly provided
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <div className="space-y-5">
          {validationItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
            >
              <div className="mt-0.5 flex-shrink-0">
                {item.isValid ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{item.label}</p>
                  <Badge
                    variant={item.isValid ? "outline" : "secondary"}
                    className={cn(
                      "text-xs font-normal",
                      item.isValid
                        ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                        : "bg-red-50 text-red-700 hover:bg-red-50 border-red-200"
                    )}
                  >
                    {item.isValid ? "Valid" : "Required"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </p>
                <p
                  className={cn(
                    "mt-1.5 text-sm",
                    item.isValid
                      ? "text-foreground"
                      : "text-muted-foreground italic"
                  )}
                >
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {!isComplete && (
          <div className="mt-6 flex items-center gap-2 p-3 rounded-md bg-amber-50 text-amber-800 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p>Please complete all required fields to proceed.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
