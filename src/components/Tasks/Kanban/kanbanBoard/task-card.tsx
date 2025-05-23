"use client";

import { useDrag } from "react-dnd";
import { Edit, Trash2 } from "lucide-react";
import type { Task } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type TaskCardProps = {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const priorityColors = {
    LOW: "bg-green-100 text-green-800 hover:bg-green-100",
    MEDIUM: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    HIGH: "bg-red-100 text-red-800 hover:bg-red-100",
  };

  return (
    <Card
      // @ts-ignore
      ref={drag}
      className={`cursor-grab ${
        isDragging ? "opacity-50" : "opacity-100"
      } transition-opacity`}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{task.title}</CardTitle>
          <Badge variant="outline" className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 pb-2 text-sm text-muted-foreground space-y-1">
        <p>{task.description}</p>

        {task.dueDate && (
          <p className="text-xs text-gray-500">
            📅 Due: {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}

        {task.user?.username && (
          <p className="text-xs text-gray-500">
            👤 Assigned: {task.user.username}
          </p>
        )}

        {task.project?.name && (
          <p className="text-xs text-gray-500">
            🏢 Project: {task.project.name}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-2 flex justify-end space-x-2">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
