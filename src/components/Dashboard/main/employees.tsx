"use client";

import {
  TrendingUp,
  Users,
  Award,
  Clock,
  MoreHorizontal,
  RefreshCw,
  Download,
  Filter,
  UserCheck,
  Target,
  BarChart3,
  User,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { fetchDashboardData } from "@/api/general-dashboard";

interface TeamMember {
  username: string;
  totalTasks: number;
}

interface ChartData {
  username: string;
  tasks: number;
  workloadLevel: "light" | "normal" | "heavy" | "overloaded";
}

const chartConfig = {
  tasks: {
    label: "Tasks",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const tasks = payload[0]?.value || 0;
    const workloadLevel = getWorkloadLevel(tasks);

    return (
      <div className="rounded-lg border bg-card p-4 shadow-lg backdrop-blur-sm">
        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {label
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground">{label}</span>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center text-sm text-muted-foreground">
                <Target className="mr-2 h-3 w-3" />
                Total Tasks
              </span>
              <span className="font-semibold text-primary">{tasks}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <BarChart3 className="mr-2 h-3 w-3" />
                  Workload Level
                </span>
                <Badge variant={getWorkloadBadgeVariant(workloadLevel)}>
                  {workloadLevel.charAt(0).toUpperCase() +
                    workloadLevel.slice(1)}
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

const getWorkloadLevel = (
  tasks: number
): "light" | "normal" | "heavy" | "overloaded" => {
  if (tasks <= 5) return "light";
  if (tasks <= 10) return "normal";
  if (tasks <= 15) return "heavy";
  return "overloaded";
};

const getWorkloadBadgeVariant = (level: string) => {
  switch (level) {
    case "light":
      return "secondary";
    case "normal":
      return "default";
    case "heavy":
      return "outline";
    case "overloaded":
      return "destructive";
    default:
      return "default";
  }
};

const getBarColor = (tasks: number) => {
  const level = getWorkloadLevel(tasks);
  switch (level) {
    case "light":
      return "hsl(var(--primary))";
    case "normal":
      return "hsl(var(--primary))";
    case "heavy":
      return "hsl(var(--warning))";
    case "overloaded":
      return "hsl(var(--destructive))";
    default:
      return "hsl(var(--primary))";
  }
};

export function Employees() {
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

  const processChartData = (data: { teamWorkload: TeamMember[] }) => {
    const { teamWorkload } = data;

    const processedData = teamWorkload.map((member) => ({
      username: member.username,
      tasks: member.totalTasks,
      workloadLevel: getWorkloadLevel(member.totalTasks),
    }));

    // Sort by task count descending
    processedData.sort((a, b) => b.tasks - a.tasks);
    setChartData(processedData);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  // Calculate stats
  const totalEmployees = chartData.length;
  const totalTasks = chartData.reduce((sum, item) => sum + item.tasks, 0);
  const averageTasks =
    totalEmployees > 0 ? Math.round(totalTasks / totalEmployees) : 0;
  const topPerformer = chartData.length > 0 ? chartData[0] : null;

  if (loading) {
    return (
      <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10">
              <Users className="h-3 w-3 text-primary" />
            </div>
            <CardTitle className="text-lg">Employee Workload</CardTitle>
          </div>
          <CardDescription>Loading employee data...</CardDescription>
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
              <Users className="h-3 w-3 text-destructive" />
            </div>
            <CardTitle className="text-lg">Employee Workload</CardTitle>
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
              <Users className="h-3 w-3 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Employee Workload</CardTitle>
              <CardDescription>
                Task distribution across team members
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
                  Filter by Department
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserCheck className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="flex items-center gap-2 rounded-lg border p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Team Size</p>
              <p className="text-lg font-semibold">{totalEmployees}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Target className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Tasks</p>
              <p className="text-lg font-semibold">{totalTasks}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
              <Clock className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg per Person</p>
              <p className="text-lg font-semibold">{averageTasks}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
              <Award className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Top Performer</p>
              <p className="text-lg font-semibold">
                {topPerformer ? topPerformer.username.split(" ")[0] : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                right: 16,
                left: 50,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="username"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                width={40}
                tickFormatter={(value) => value.split(" ")[0]}
              />
              <XAxis dataKey="tasks" type="number" hide />
              <ChartTooltip cursor={false} content={<CustomTooltip />} />
              <Bar
                dataKey="tasks"
                layout="vertical"
                fill="var(--color-tasks)"
                radius={4}
                className="hover:opacity-80 transition-opacity"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.tasks)} />
                ))}
                <LabelList
                  dataKey="tasks"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Employee List with Workload Indicators */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Team Members</span>
            <span className="text-muted-foreground">Workload Status</span>
          </div>
          {chartData.map((employee, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {employee.username
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{employee.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {employee.tasks} task{employee.tasks !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        (employee.tasks /
                          Math.max(...chartData.map((d) => d.tasks))) *
                          100,
                        100
                      )}%`,
                      backgroundColor: getBarColor(employee.tasks),
                    }}
                  />
                </div>
                <Badge
                  variant={getWorkloadBadgeVariant(employee.workloadLevel)}
                  className="text-xs"
                >
                  {employee.workloadLevel.charAt(0).toUpperCase() +
                    employee.workloadLevel.slice(1)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
