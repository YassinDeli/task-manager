import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface RecentActivityListProps {
  recentActivityData: Array<{
    id: string;
    user: string;
    action: string;
    item: string;
    time: string;
  }>;
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({
  recentActivityData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivityData.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-2 pb-4 last:pb-0 border-b last:border-0"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>{" "}
                  {activity.action}{" "}
                  <span className="font-medium">{activity.item}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full">
          View All Activity
        </Button>
      </CardFooter>
    </Card>
  );
};
