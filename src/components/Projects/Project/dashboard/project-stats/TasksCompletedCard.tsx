"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface TasksCompletedCardProps {
  completedTasks: number;
  totalTasks: number;
}

export function TasksCompletedCard({
  completedTasks,
  totalTasks,
}: TasksCompletedCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Tasks Completed</CardDescription>
        <CardTitle className="text-2xl">
          {completedTasks}/{totalTasks}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          {completedTasks > 0 ? (
            <span className="text-green-500 font-medium">
              ✓ {completedTasks} tasks completed
            </span>
          ) : (
            <span className="text-amber-500 font-medium">
              No tasks completed yet
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
