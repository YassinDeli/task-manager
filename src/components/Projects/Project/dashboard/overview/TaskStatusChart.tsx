import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface TaskStatusChartProps {
  taskStatusData: Array<{ name: string; value: number; color: string }>;
}

export const TaskStatusChart: React.FC<TaskStatusChartProps> = ({
  taskStatusData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Task Status
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-[300px] flex items-center justify-center">
        <PieChart width={400} height={300}>
          <Pie
            data={taskStatusData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {taskStatusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </CardContent>
    </Card>
  );
};
