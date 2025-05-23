"use client";

import type React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useTaskStore } from "@/hooks/stores/useTaskStore";
import type { Priority, Status, Project, User } from "@/types/project";
import { taskSchema } from "@/types/validations/task.validation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Common/Spinner";
import {
  CheckCircle2,
  ClipboardList,
  Calendar,
  AlertCircle,
  UserIcon,
  Briefcase,
  Clock,
  Flag,
  Save,
  X,
  FileText,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface TaskFormProps {
  className?: string;
  users?: User[];
  projects?: Project[];
  loading?: boolean;
  onSubmit?: (valid: boolean) => void;
  showActions?: boolean;
  onCancel?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  className,
  users,
  projects,
  loading,
  onSubmit,
  showActions = true,
  onCancel,
}) => {
  const taskStore = useTaskStore();

  const validateForm = () => {
    const taskData = {
      title: taskStore.title,
      description: taskStore.description,
      status: taskStore.status,
      priority: taskStore.priority,
      userId: taskStore.userId,
      projectId: taskStore.projectId,
      dueDate: taskStore.dueDate,
    };

    const result = taskSchema.safeParse(taskData);

    if (!result.success) {
      taskStore.set("errors", result.error.flatten().fieldErrors);
      return false;
    }

    taskStore.set("errors", {});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm();
    onSubmit?.(isValid);
  };

  // Helper function to get status badge styling
  const getStatusBadge = (status: string | undefined) => {
    if (!status) return { color: "", icon: null };

    switch (status) {
      case "TODO":
        return {
          color: "bg-slate-100 text-slate-800 border-slate-200",
          icon: <ClipboardList className="h-3 w-3 mr-1" />,
        };
      case "IN_PROGRESS":
        return {
          color: "bg-amber-100 text-amber-800 border-amber-200",
          icon: <Clock className="h-3 w-3 mr-1" />,
        };
      case "DONE":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
        };
      default:
        return { color: "", icon: null };
    }
  };

  // Helper function to get priority badge styling
  const getPriorityBadge = (priority: string | undefined) => {
    if (!priority) return { color: "", icon: null };

    switch (priority) {
      case "LOW":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <Flag className="h-3 w-3 mr-1" />,
        };
      case "MEDIUM":
        return {
          color: "bg-amber-100 text-amber-800 border-amber-200",
          icon: <Flag className="h-3 w-3 mr-1" />,
        };
      case "HIGH":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: <Flag className="h-3 w-3 mr-1" />,
        };
      default:
        return { color: "", icon: null };
    }
  };

  // Get selected user and project
  const selectedUser = users?.find(
    (user) => user.id?.toString() === taskStore.userId
  );
  const selectedProject = projects?.find(
    (project) => project.id?.toString() === taskStore.projectId?.toString()
  );

  // Check if form has any errors
  const hasErrors = Object.keys(taskStore.errors || {}).length > 0;

  const statusBadge = getStatusBadge(taskStore.status);
  const priorityBadge = getPriorityBadge(taskStore.priority);

  return (
    <div
      className={cn(
        "w-full bg-white border border-border rounded-md shadow-sm",
        className
      )}
    >
      <form id="task-form" onSubmit={handleSubmit}>
        {/* Header */}
        <div className="px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">Task Information</h1>
            </div>
            <div className="flex gap-2">
              {taskStore.status && (
                <Badge
                  variant="outline"
                  className={cn("flex items-center", statusBadge.color)}
                >
                  {statusBadge.icon}
                  {taskStore.status.replace("_", " ")}
                </Badge>
              )}
              {taskStore.priority && (
                <Badge
                  variant="outline"
                  className={cn("flex items-center", priorityBadge.color)}
                >
                  {priorityBadge.icon}
                  {taskStore.priority}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Basic Information</h3>
            </div>

            <div className="space-y-4 pl-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-1.5">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Ex. Awesome Task"
                  value={taskStore.title}
                  onChange={(e) => {
                    taskStore.set("title", e.target.value);
                    taskStore.resetError("title");
                  }}
                  className={cn(
                    taskStore.errors.title?.[0] && "border-destructive"
                  )}
                />
                {taskStore.errors.title?.[0] && (
                  <div className="flex items-center gap-1.5 text-destructive text-xs">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{taskStore.errors.title[0]}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="flex items-center gap-1.5"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="This is awesome!"
                  className={cn(
                    "resize-none min-h-[120px]",
                    taskStore.errors.description?.[0] && "border-destructive"
                  )}
                  value={taskStore.description}
                  onChange={(e) => {
                    taskStore.set("description", e.target.value);
                    taskStore.resetError("description");
                  }}
                  rows={5}
                />
                {taskStore.errors.description?.[0] && (
                  <div className="flex items-center gap-1.5 text-destructive text-xs">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{taskStore.errors.description[0]}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Task Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Task Details</h3>
            </div>

            <div className="grid gap-4 pl-6 md:grid-cols-3">
              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status" className="flex items-center gap-1.5">
                  Status <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={taskStore.status}
                  onValueChange={(value) => {
                    taskStore.set("status", value as Status);
                    taskStore.resetError("status");
                  }}
                >
                  <SelectTrigger
                    id="status"
                    className={cn(
                      taskStore.errors.status?.[0] && "border-destructive"
                    )}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="TODO"
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-slate-500" />
                        <span>TODO</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="IN_PROGRESS"
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span>IN PROGRESS</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="DONE"
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>DONE</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {taskStore.errors.status?.[0] && (
                  <div className="flex items-center gap-1.5 text-destructive text-xs">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{taskStore.errors.status[0]}</span>
                  </div>
                )}
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority" className="flex items-center gap-1.5">
                  Priority <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={taskStore.priority}
                  onValueChange={(value) => {
                    taskStore.set("priority", value as Priority);
                    taskStore.resetError("priority");
                  }}
                >
                  <SelectTrigger
                    id="priority"
                    className={cn(
                      taskStore.errors.priority?.[0] && "border-destructive"
                    )}
                  >
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW" className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4 text-blue-500" />
                        <span>LOW</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="MEDIUM"
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4 text-amber-500" />
                        <span>MEDIUM</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="HIGH"
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4 text-red-500" />
                        <span>HIGH</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {taskStore.errors.priority?.[0] && (
                  <div className="flex items-center gap-1.5 text-destructive text-xs">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{taskStore.errors.priority[0]}</span>
                  </div>
                )}
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <Label htmlFor="due-date" className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Due Date
                </Label>
                <DatePicker
                  id="due-date"
                  className="w-full"
                  value={
                    taskStore.dueDate ? new Date(taskStore.dueDate) : undefined
                  }
                  onChange={(value: Date | null) => {
                    taskStore.set("dueDate", value);
                    taskStore.resetError("dueDate");
                  }}
                  nullable
                />
                {taskStore.errors.dueDate?.[0] && (
                  <div className="flex items-center gap-1.5 text-destructive text-xs">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{taskStore.errors.dueDate[0]}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  When this task should be completed
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Assignment */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <UserIcon className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Assignment</h3>
            </div>

            <div className="grid gap-4 pl-6 md:grid-cols-2">
              {/* Employee */}
              <div className="space-y-2">
                <Label htmlFor="employee" className="flex items-center gap-1.5">
                  Employee <span className="text-destructive">*</span>
                </Label>
                <Select
                  onValueChange={(value) => {
                    taskStore.set("userId", value);
                    taskStore.resetError("userId");
                  }}
                  value={taskStore.userId || ""}
                >
                  <SelectTrigger
                    id="employee"
                    className={cn(
                      taskStore.errors.userId?.[0] && "border-destructive"
                    )}
                  >
                    <SelectValue placeholder="Select employee..." />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.map((user: Partial<User>) => (
                      <SelectItem
                        key={user.id}
                        value={user.id?.toString() || ""}
                        className="py-2"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={`https://avatar.vercel.sh/${user.username}.png`}
                              alt={user.username}
                            />
                            <AvatarFallback>
                              {user.username?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span>{user.username}</span>
                            {user.role?.label && (
                              <span className="text-muted-foreground text-xs ml-1">
                                ({user.role.label})
                              </span>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {taskStore.errors.userId?.[0] && (
                  <div className="flex items-center gap-1.5 text-destructive text-xs">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{taskStore.errors.userId[0]}</span>
                  </div>
                )}
              </div>

              {/* Project */}
              <div className="space-y-2">
                <Label htmlFor="project" className="flex items-center gap-1.5">
                  Project <span className="text-destructive">*</span>
                </Label>
                <Select
                  onValueChange={(value) => {
                    taskStore.set(
                      "projectId",
                      value ? Number.parseInt(value) : null
                    );
                    taskStore.resetError("projectId");
                  }}
                  value={
                    taskStore.projectId ? taskStore.projectId.toString() : ""
                  }
                >
                  <SelectTrigger
                    id="project"
                    className={cn(
                      taskStore.errors.projectId?.[0] && "border-destructive"
                    )}
                  >
                    <SelectValue placeholder="Select project..." />
                  </SelectTrigger>
                  <SelectContent>
                    {projects?.map((project) => (
                      <SelectItem
                        key={project.id}
                        value={project.id.toString()}
                        className="py-2"
                      >
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span>{project.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {taskStore.errors.projectId?.[0] && (
                  <div className="flex items-center gap-1.5 text-destructive text-xs">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{taskStore.errors.projectId[0]}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Selected Assignment Summary */}
          {(selectedUser || selectedProject) && (
            <div className="mt-4 border rounded-lg p-4 bg-muted/30">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                Assignment Summary
              </h4>
              <div className="grid gap-3 md:grid-cols-2">
                {selectedUser && (
                  <div className="flex items-start gap-3 bg-white p-3 rounded border">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${selectedUser.username}.png`}
                        alt={selectedUser.username}
                      />
                      <AvatarFallback>
                        {selectedUser.username?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedUser.username}</p>
                      {selectedUser.role?.label && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {selectedUser.role.label}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                {selectedProject && (
                  <div className="flex items-start gap-3 bg-white p-3 rounded border">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedProject.name}</p>
                      {selectedProject.status && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {selectedProject.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Help Information */}
          <div className="flex items-start gap-2 text-sm text-muted-foreground bg-blue-50 p-3 rounded-md">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p>
              Fields marked with <span className="text-destructive">*</span> are
              required. Please ensure all required fields are completed before
              submitting.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
