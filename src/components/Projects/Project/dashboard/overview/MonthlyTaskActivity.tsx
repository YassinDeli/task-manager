"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CalendarDays } from "lucide-react";

interface MonthlyTaskActivityProps {
  monthlyTaskCompletionData: Array<{
    month: string;
    completed: number;
    created: number;
  }>;
}

export const MonthlyTaskActivity: React.FC<MonthlyTaskActivityProps> = ({
  monthlyTaskCompletionData,
}) => {
  const hasData = monthlyTaskCompletionData?.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Monthly Task Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-[300px] h-[300px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyTaskCompletionData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                name="Completed"
                type="monotone"
                dataKey="completed"
                stroke="hsl(var(--chart-1, 0, 100%, 50%))"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                name="Created"
                type="monotone"
                dataKey="created"
                stroke="hsl(var(--chart-2, 200, 100%, 40%))"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-muted-foreground pt-10">
            No data available.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
