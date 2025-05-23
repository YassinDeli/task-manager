import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TeamMemberContribution {
  name: string;
  tasks: number;
  completed: number;
}

interface TeamContributionsChartProps {
  teamContributionsData?: TeamMemberContribution[];
  isLoading?: boolean;
  error?: string;
}

export const TeamContributionsChart: React.FC<TeamContributionsChartProps> = ({
  teamContributionsData,
  isLoading = false,
  error,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Contributions
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          <Skeleton className="w-full h-[300px]" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Contributions
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[300px] flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!teamContributionsData || teamContributionsData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Contributions
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No team data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Contributions
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-[300px]">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[...teamContributionsData].sort((a, b) => b.tasks - a.tasks)}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            layout="vertical"
          >
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value, name, props) => {
                const completionRate =
                  props.payload.tasks > 0
                    ? Math.round(
                        (props.payload.completed / props.payload.tasks) * 100
                      )
                    : 0;
                return [value, `${name} (${completionRate}%)`];
              }}
            />
            <Legend />
            <Bar
              dataKey="tasks"
              name="Total Tasks"
              fill="hsl(var(--chart-1))"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="completed"
              name="Completed Tasks"
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
