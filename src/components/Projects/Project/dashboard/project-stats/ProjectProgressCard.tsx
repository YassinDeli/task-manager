"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProjectProgressCardProps {
  progressPercentage: number;
}

export function ProjectProgressCard({
  progressPercentage,
}: ProjectProgressCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Progress</CardDescription>
        <CardTitle className="text-2xl">{progressPercentage}%</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progressPercentage} className="h-2" />
      </CardContent>
    </Card>
  );
}
