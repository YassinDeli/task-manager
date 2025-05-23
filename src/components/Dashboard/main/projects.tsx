"use client";

import {
  Footprints,
  Waves,
  TrendingUp,
  Calendar,
  Users,
  Target,
  MoreHorizontal,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { fetchDashboardData } from "@/api/general-dashboard";

// Define types for the data
interface Task {
  id: number;
  title: string;
  status: string;
}

interface Project {
  id: number;
  name: string;
  tasks: Task[];
}

interface ChartData {
  date: string;
  completed: number;
  tasks: number;
  completionRate: number;
}

const chartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-1))",
    icon: Footprints,
  },
  tasks: {
    label: "Total Tasks",
    color: "hsl(var(--chart-2))",
    icon: Waves,
  },
} satisfies ChartConfig;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const completed =
      payload.find((item: any) => item.dataKey === "completed")?.value || 0;
    const totalTasks =
      payload.find((item: any) => item.dataKey === "tasks")?.value || 0;
    const completionRate =
      totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

    return (
      <div className="rounded-lg border bg-card p-4 shadow-lg backdrop-blur-sm">
        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="text-sm font-medium text-foreground">{label}</span>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center text-sm text-muted-foreground">
                <Footprints className="mr-2 h-3 w-3" />
                Completed
              </span>
              <span className="font-semibold text-primary">{completed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center text-sm text-muted-foreground">
                <Waves className="mr-2 h-3 w-3" />
                Total Tasks
              </span>
              <span className="font-semibold">{totalTasks}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Target className="mr-2 h-3 w-3" />
                  Completion Rate
                </span>
                <Badge
                  variant={
                    completionRate >= 80
                      ? "default"
                      : completionRate >= 60
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {completionRate}%
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export function Projects() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetchDashboardData();
      processChartData(response.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const processChartData = (data: { recentProjects: Project[] }) => {
    const { recentProjects } = data;

    const processedData = recentProjects.map((project) => {
      // Filter out deleted tasks first
      const activeTasks = project.tasks.filter((task) => !task.deletedAt);

      const totalTasks = activeTasks.length;
      const completedTasks = activeTasks.filter(
        (task) => task.status === "DONE"
      ).length;
      const completionRate =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        date: project.name,
        completed: completedTasks,
        tasks: totalTasks,
        completionRate,
      };
    });

    setChartData(processedData);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const getBarColor = (completionRate: number) => {
    if (completionRate >= 80) return "hsl(var(--primary))";
    if (completionRate >= 60) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  const totalProjects = chartData.length;
  const totalTasks = chartData.reduce((sum, item) => sum + item.tasks, 0);
  const totalCompleted = chartData.reduce(
    (sum, item) => sum + item.completed,
    0
  );
  const averageCompletion =
    totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  if (loading) {
    return (
      <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10">
              <BarChart3 className="h-3 w-3 text-primary" />
            </div>
            <CardTitle className="text-lg">Projects Overview</CardTitle>
          </div>
          <CardDescription>Loading project data...</CardDescription>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading chart data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-destructive/10">
              <BarChart3 className="h-3 w-3 text-destructive" />
            </div>
            <CardTitle className="text-lg">Projects Overview</CardTitle>
          </div>
          <CardDescription>Error loading data</CardDescription>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="text-destructive font-medium">{error}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="mt-3"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10">
              <BarChart3 className="h-3 w-3 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Projects Overview</CardTitle>
              <CardDescription>
                Task completion across all projects
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`mr-2 h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Filter className="mr-2 h-4 w-4" />
                  Filter Projects
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  View Calendar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="flex items-center gap-2 rounded-lg border p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <Target className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Projects</p>
              <p className="text-lg font-semibold">{totalProjects}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Footprints className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="text-lg font-semibold">{totalCompleted}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
              <Waves className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Tasks</p>
              <p className="text-lg font-semibold">{totalTasks}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg. Progress</p>
              <p className="text-lg font-semibold">{averageCompletion}%</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                className="text-xs"
                tickFormatter={(value) => {
                  // Truncate long project names
                  return value.length > 12
                    ? `${value.substring(0, 12)}...`
                    : value;
                }}
              />
              <YAxis axisLine={false} tickLine={false} className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="completed"
                stackId="a"
                fill="var(--color-completed)"
                radius={[0, 0, 4, 4]}
                className="hover:opacity-80 transition-opacity"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry.completionRate)}
                  />
                ))}
              </Bar>
              <Bar
                dataKey="tasks"
                stackId="a"
                fill="var(--color-tasks)"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Progress indicators */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Project Progress</span>
            <span className="text-muted-foreground">Completion Rate</span>
          </div>
          {chartData.map((project, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-24 truncate text-xs font-medium">
                {project.date}
              </div>
              <div className="flex-1">
                <div className="flex h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="bg-primary transition-all duration-300"
                    style={{ width: `${project.completionRate}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {project.completed}/{project.tasks}
                </span>
                <Badge
                  variant={
                    project.completionRate >= 80
                      ? "default"
                      : project.completionRate >= 60
                      ? "secondary"
                      : "outline"
                  }
                  className="text-xs"
                >
                  {project.completionRate}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
