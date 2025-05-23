"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { toDateOnly, transformDate } from "@/lib/date.util";
import { Progress } from "@/components/ui/progress";

interface ProjectTimelineCardProps {
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  timelinePercentage?: number;
}

export function ProjectTimelineCard({
  startDate,
  endDate,
  timelinePercentage = 0,
}: ProjectTimelineCardProps) {
  // Safely format dates
  const formattedStartDate = startDate
    ? transformDate(startDate.toString())
    : "Not set";
  const formattedEndDate = endDate
    ? transformDate(endDate.toString())
    : "Not set";

  // Calculate days remaining if both dates are valid
  let daysRemaining = null;
  if (startDate && endDate) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();

      if (isValidDate(start) && isValidDate(end)) {
        const totalDays = Math.ceil(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        );
        const daysPassed = Math.ceil(
          (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        );
        daysRemaining = totalDays - daysPassed;
      }
    } catch {
      // Silently handle date calculation errors
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardDescription>Project Timeline</CardDescription>
        <CardTitle className="text-2xl">
          {Math.round(timelinePercentage)}%
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Progress value={timelinePercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground text-xs">Start Date</div>
            <div className="font-medium">{formattedStartDate}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">End Date</div>
            <div className="font-medium">{formattedEndDate}</div>
          </div>
        </div>

        {daysRemaining !== null && (
          <div className="text-sm">
            <div className="text-muted-foreground text-xs">Time Remaining</div>
            <div className="font-medium">
              {daysRemaining > 0
                ? `${daysRemaining} days`
                : "Project completed"}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to validate dates
function isValidDate(date: Date): boolean {
  return !isNaN(date.getTime());
}
