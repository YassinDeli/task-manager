import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { transformDate } from "@/lib/date.util";

interface Milestone {
  id: string;
  name: string;
  date: string;
  status: "On Track" | "At Risk" | "Delayed" | string;
}

interface UpcomingMilestonesProps {
  upcomingMilestonesData?: Milestone[]; // Make prop optional
}

export const UpcomingMilestones: React.FC<UpcomingMilestonesProps> = ({
  upcomingMilestonesData = [], // Default empty array
}) => {
  // Sort milestones by date (soonest first)
  const sortedMilestones = React.useMemo(() => {
    try {
      return [...(upcomingMilestonesData || [])].sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
    } catch {
      return [];
    }
  }, [upcomingMilestonesData]);

  if (sortedMilestones.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            No upcoming milestones
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedMilestones.map((milestone) => {
            const formattedDate = transformDate(milestone.date);
            const statusVariant =
              milestone.status === "On Track"
                ? "outline"
                : milestone.status === "At Risk"
                ? "warning"
                : "destructive";

            return (
              <div
                key={milestone.id}
                className="flex items-center justify-between pb-4 last:pb-0 border-b last:border-0"
              >
                <div className="space-y-1">
                  <p className="font-medium">{milestone.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formattedDate}
                  </p>
                </div>
                <Badge variant={statusVariant}>{milestone.status}</Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full">
          View All Milestones
        </Button>
      </CardFooter>
    </Card>
  );
};
