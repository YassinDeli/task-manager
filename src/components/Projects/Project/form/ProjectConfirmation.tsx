"use client";

import { useProjectStore } from "@/hooks/stores/useProjectStore";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  ClipboardList,
  User,
  Mail,
  FileText,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface ProjectConfirmationProps {
  className?: string;
  onConfirm?: () => void;
  onEdit?: () => void;
}

export const ProjectConfirmation = ({
  className,
  onConfirm = () => {},
  onEdit = () => {},
}: ProjectConfirmationProps) => {
  const project = useProjectStore();
  const user = useUserStore();

  // Helper function to determine status badge styling
  const getStatusBadge = (status: string | undefined) => {
    if (!status)
      return { color: "bg-gray-100 text-gray-800", label: "Not Set" };

    switch (status.toLowerCase()) {
      case "active":
        return { color: "bg-green-100 text-green-800", label: "Active" };
      case "pending":
        return { color: "bg-amber-100 text-amber-800", label: "Pending" };
      case "completed":
        return { color: "bg-blue-100 text-blue-800", label: "Completed" };
      case "on hold":
        return { color: "bg-purple-100 text-purple-800", label: "On Hold" };
      default:
        return { color: "bg-gray-100 text-gray-800", label: status };
    }
  };

  const statusBadge = getStatusBadge(project.status);

  return (
    <Card className={cn("w-full shadow-sm", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">
              Project Summary
            </CardTitle>
          </div>
          {project.status && (
            <Badge
              variant="outline"
              className={cn("font-medium", statusBadge.color)}
            >
              {statusBadge.label}
            </Badge>
          )}
        </div>
        <CardDescription>
          Review and confirm your project details
        </CardDescription>
      </CardHeader>
      <Separator />

      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Briefcase className="h-4 w-4" />
            <h3 className="font-medium">Project Details</h3>
          </div>

          <div className="grid gap-3 pl-6">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Project Name
                </p>
                <p className="font-medium">{project.name || "Not specified"}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <p className="font-medium">
                  {project.status || "Not specified"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Description
                </p>
                <p
                  className={cn(
                    "font-medium",
                    !project.description && "text-muted-foreground italic"
                  )}
                >
                  {project.description || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <User className="h-4 w-4" />
            <h3 className="font-medium">Responsible Person</h3>
          </div>

          <div className="grid gap-3 pl-6">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Name
                </p>
                <p className="font-medium">Auto-assigned by system</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="font-medium">Auto-assigned by system</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
