// dashboard/overview/index.tsx
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { TaskStatusChart } from "./overview/TaskStatusChart";
import { TaskPriorityChart } from "./overview/TaskPriorityChart";
import { MonthlyTaskActivity } from "./overview/MonthlyTaskActivity";
import { TeamContributionsChart } from "./overview/TeamContributionsChart";
import { RecentActivityList } from "./overview/RecentActivityList";
import { UpcomingMilestones } from "./overview/UpcomingMilestones";

interface OverviewProps {
  taskStatusData: Array<{ name: string; value: number; color: string }>;
  taskPriorityData: Array<{ name: string; value: number; color: string }>;
  monthlyTaskCompletionData: Array<{
    month: string;
    completed: number;
    created: number;
  }>;
  teamContributionsData?: Array<{
    name: string;
    tasks: number;
    completed: number;
  }>;
  recentActivityData: Array<{
    id: string;
    user: string;
    action: string;
    item: string;
    time: string;
  }>;
  upcomingMilestonesData?: Array<{
    id: string;
    name: string;
    date: string;
    status: "On Track" | "At Risk" | "Delayed" | string;
  }>;
}

export const Overview: React.FC<OverviewProps> = ({
  taskStatusData,
  taskPriorityData,
  monthlyTaskCompletionData,
  teamContributionsData = [],
  recentActivityData,
  upcomingMilestonesData = [],
}) => {
  return (
    <TabsContent value="overview" className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <TaskStatusChart taskStatusData={taskStatusData} />
        <TaskPriorityChart taskPriorityData={taskPriorityData} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <MonthlyTaskActivity
          monthlyTaskCompletionData={monthlyTaskCompletionData}
        />
        <TeamContributionsChart teamContributionsData={teamContributionsData} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivityList recentActivityData={recentActivityData} />
        <UpcomingMilestones upcomingMilestonesData={upcomingMilestonesData} />
      </div>
    </TabsContent>
  );
};
