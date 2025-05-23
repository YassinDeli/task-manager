import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
  employee?: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

interface ProjectTasksTabProps {
  projectData: {
    name: string;
  };
  projectTasks: Task[];
}

export const ProjectTasksTab = ({
  projectData,
  projectTasks,
}: ProjectTasksTabProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <TabsContent value="tasks">
      <Card>
        <CardHeader>
          <CardTitle>Project Tasks</CardTitle>
          <CardDescription>
            {projectTasks.length} tasks for {projectData.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projectTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tasks found for this project
            </div>
          ) : (
            <div className="space-y-4">
              {projectTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          (task.status === "DONE"
                            ? "success"
                            : task.status === "IN_PROGRESS"
                            ? "default"
                            : "outline") as any
                        }
                      >
                        {task.status.replace("_", " ")}
                      </Badge>
                      {task.priority && (
                        <Badge
                          variant={
                          (  task.priority === "HIGH"
                              ? "destructive"
                              : task.priority === "MEDIUM"
                              ? "warning"
                              : "outline") as any
                          }
                        >
                          {task.priority}
                        </Badge>
                      )}
                    </div>
                    <p className="font-medium">{task.title}</p>
                    {task.description && (
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Due: {formatDate(task.dueDate)}
                    </p>
                    {task.employee && (
                      <p className="text-xs text-muted-foreground">
                        Assigned to: {task.employee.user.firstName}{" "}
                        {task.employee.user.lastName}
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full">Add New Task</Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
};
