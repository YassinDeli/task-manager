import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Flag } from "lucide-react";

interface TaskPriorityChartProps {
  taskPriorityData: Array<{ name: string; value: number; color: string }>;
}

export const TaskPriorityChart: React.FC<TaskPriorityChartProps> = ({
  taskPriorityData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5" />
          Task Priority
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-[300px] flex items-center justify-center">
        <PieChart width={400} height={300}>
          <Pie
            data={taskPriorityData}
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
            {taskPriorityData.map((entry, index) => (
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
