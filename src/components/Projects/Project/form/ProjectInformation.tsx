import { useProjectStore } from "@/hooks/stores/useProjectStore";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { FormBuilder } from "@/components/Common/FormBuilder/FormBuilder";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker"; // make sure this is your actual date picker path
import { DynamicForm } from "@/types";

interface ProjectInformationProps {
  className?: string;
}

export const ProjectInformation = ({ className }: ProjectInformationProps) => {
  const { t } = useTranslation();
  const projectStore = useProjectStore();

  const form: DynamicForm = {
    name: "Project Information",
    description: "Manage project information and track progress.",
    grids: [
      {
        name: "General Info",
        gridItems: [
          {
            id: 1,
            fields: [
              {
                label: "Project Name",
                variant: "text",
                required: true,
                placeholder: "Enter the project name",
                description: "Official title of the project.",
                error: projectStore.errors?.name?.[0],
                props: {
                  value: projectStore.name,
                  onChange: (value) => {
                    projectStore.set("name", value);
                    projectStore.resetError("name");
                  },
                },
              },
              {
                label: "Description",
                variant: "textarea",
                required: false,
                placeholder: "Describe the project...",
                description: "Brief overview of the project's goals.",
                error: projectStore.errors?.description?.[0],
                props: {
                  value: projectStore.description?.toString(),
                  onChange: (value) => {
                    projectStore.set("description", value);
                    projectStore.resetError("description");
                  },
                },
              },
            ],
          },
        ],
      },
      {
        name: "Project Settings",
        gridItems: [
          {
            id: 1,
            fields: [
              {
                label: "Status",
                variant: "select",
                required: true,
                placeholder: "Select status",
                description: "Current project status.",
                error: projectStore.errors?.status?.[0],
                props: {
                  value: projectStore.status,
                  onValueChange: (value: string) => {
                    projectStore.set("status", value as any);
                    projectStore.resetError("status");
                  },
                  selectOptions: [
                    { label: "Not Started", value: "NOT_STARTED" },
                    { label: "Planned", value: "PLANNED" },
                    { label: "In Progress", value: "IN_PROGRESS" },
                    { label: "Completed", value: "COMPLETED" },
                    { label: "On Hold", value: "ON_HOLD" },
                    { label: "Cancelled", value: "CANCELLED" },
                  ],
                },
              },
              {
                label: "Priority",
                variant: "select",
                required: true,
                placeholder: "Select priority",
                description: "Priority level of the project.",
                error: projectStore.errors?.priority?.[0],
                props: {
                  value: projectStore.priority,
                  onValueChange: (value: string) => {
                    projectStore.set("priority", value as any);
                    projectStore.resetError("priority");
                  },
                  selectOptions: [
                    { label: "Low", value: "LOW" },
                    { label: "Medium", value: "MEDIUM" },
                    { label: "High", value: "HIGH" },
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  };

  return (
    <div className={cn("flex flex-col pb-20 overflow-hidden container mx-auto", className)}>
      {/* Render form without date fields */}
      <FormBuilder className="mx-auto mt-5" form={form} />

      {/* Custom rendered Start Date */}
      <div className="mt-6">
        <Label>Start Date</Label>
        <div className="w-full mt-2">
          <DatePicker
            className="w-full"
            value={
              projectStore.startDate ? new Date(projectStore.startDate) : undefined
            }
            onChange={(value: Date | null) => {
              projectStore.set("startDate", value);
              projectStore.resetError("startDate");
            }}
            nullable
          />
          {projectStore.errors.startDate?.[0] && (
            <span className="text-red-500 text-xs mt-1">
              {projectStore.errors.startDate[0]}
            </span>
          )}
        </div>
      </div>

      {/* Custom rendered End Date */}
      <div className="mt-6">
        <Label>End Date</Label>
        <div className="w-full mt-2">
          <DatePicker
            className="w-full"
            value={
              projectStore.endDate ? new Date(projectStore.endDate) : undefined
            }
            onChange={(value: Date | null) => {
              projectStore.set("endDate", value);
              projectStore.resetError("endDate");
            }}
            nullable
          />
          {projectStore.errors.endDate?.[0] && (
            <span className="text-red-500 text-xs mt-1">
              {projectStore.errors.endDate[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
