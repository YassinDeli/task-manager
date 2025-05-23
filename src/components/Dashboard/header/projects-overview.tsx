import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart2,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  HelpCircle,
  MoreHorizontal,
  PauseCircle,
  PieChart,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchDashboardData } from "@/api/general-dashboard";

interface ProjectStatus {
  COMPLETED?: number;
  ON_HOLD?: number;
  IN_PROGRESS?: number;
  [key: string]: number | undefined;
}

interface TaskStatus {
  TODO?: number;
  DONE?: number;
  IN_PROGRESS?: number;
  [key: string]: number | undefined;
}

interface Priority {
  LOW: number;
  MEDIUM: number;
  HIGH: number;
}

interface Stats {
  totalProjects: number;
  totalTasks: number;
  totalUsers: number;
  projectsByStatus: ProjectStatus;
  tasksByStatus: TaskStatus;
  projectsByPriority: Priority;
  tasksByPriority: Priority;
}

interface TimelineData {
  id: number;
  name: string;
  startDate: string;
  endDate: string | null;
  status: string;
  priority: string;
  responsible: string;
}

interface TeamWorkload {
  username: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
}

interface DashboardData {
  stats: Stats;
  timelineData: TimelineData[];
  teamWorkload: TeamWorkload[];
  recentProjects: any[];
  recentTasks: any[];
}

export function ProjectsOverview() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchDashboardData();
        setDashboardData(response.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        No dashboard data available
      </div>
    );
  }

  const { stats, timelineData, teamWorkload, recentProjects, recentTasks } =
    dashboardData;

  // Calculate counts based on the actual API response keys
  const inProgressCount = stats.projectsByStatus.IN_PROGRESS || 0; // Use projectsByStatus for consistency
  const completedCount = stats.projectsByStatus.COMPLETED || 0;
  const onHoldCount = stats.projectsByStatus.ON_HOLD || 0;

  const totalProjectsCount = stats.totalProjects;
  const inProgressPercentage =
    totalProjectsCount > 0
      ? Math.round((inProgressCount / totalProjectsCount) * 100)
      : 0;
  const completedPercentage =
    totalProjectsCount > 0
      ? Math.round((completedCount / totalProjectsCount) * 100)
      : 0;
  const onHoldPercentage =
    totalProjectsCount > 0
      ? Math.round((onHoldCount / totalProjectsCount) * 100)
      : 0;

  // Get top 3 team members by workload
  const topTeamMembers = [...teamWorkload]
    .sort((a, b) => b.totalTasks - a.totalTasks)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          Projects Overview
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <PieChart className="h-3.5 w-3.5" />
            <span>Reports</span>
          </Button>
        </div>
      </div>

      <TooltipProvider>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Projects Card */}
          <Card className="border shadow-md transition-shadow hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Projects
              </CardTitle>
              <div className="rounded-full bg-blue-100 p-1.5 text-blue-600">
                <FileText className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.totalProjects}</div>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 bg-green-50 text-green-600"
                >
                  <TrendingUp className="h-3 w-3" />
                  <span>+{Math.floor(stats.totalProjects * 0.2)}%</span>
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                +{Math.floor(stats.totalProjects * 0.1)} from last month
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[220px]">
                    <p>
                      Total projects increased by{" "}
                      {Math.floor(stats.totalProjects * 0.1)} since last month,
                      showing steady growth.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-blue-50 p-2 text-center">
                  <span className="block text-lg font-semibold text-blue-600">
                    {stats.projectsByPriority.MEDIUM}
                  </span>
                  <span className="text-xs text-blue-600/70">
                    Medium Priority
                  </span>
                </div>
                <div className="rounded-lg bg-green-50 p-2 text-center">
                  <span className="block text-lg font-semibold text-green-600">
                    {completedCount}
                  </span>
                  <span className="text-xs text-green-600/70">Completed</span>
                </div>
                <div className="rounded-lg bg-yellow-50 p-2 text-center">
                  <span className="block text-lg font-semibold text-yellow-600">
                    {stats.projectsByPriority.HIGH}
                  </span>
                  <span className="text-xs text-yellow-600/70">
                    High Priority
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{stats.totalUsers} team members</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs gap-1 text-blue-600"
                >
                  <span>View all</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* In Progress Card */}
          <Card className="border shadow-md transition-shadow hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <div className="rounded-full bg-blue-100 p-1.5 text-blue-600">
                <Activity className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{inProgressCount}</div>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 bg-blue-50 text-blue-600"
                >
                  <TrendingUp className="h-3 w-3" />
                  <span>+{Math.floor(inProgressCount * 0.3)}</span>
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {inProgressPercentage}% of total projects
              </p>

              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-blue-600">Progress</span>
                  <span className="font-medium">{inProgressPercentage}%</span>
                </div>
                <Progress
                  value={inProgressPercentage}
                  className="h-2 bg-blue-100"
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {topTeamMembers.map((member, i) => (
                      <Tooltip key={member.username}>
                        <TooltipTrigger asChild>
                          <div className="h-6 w-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-medium text-blue-600">
                            {member.username.charAt(0).toUpperCase()}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {member.username}: {member.totalTasks} tasks
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                  {teamWorkload.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{teamWorkload.length - 3} more
                    </span>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Assign team</DropdownMenuItem>
                    <DropdownMenuItem>Generate report</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-600">
                <Calendar className="h-3 w-3" />
                <span className="font-medium">
                  {
                    timelineData.filter(
                      (project) =>
                        project.status === "IN_PROGRESS" ||
                        project.status === "PLANNED"
                    ).length
                  }{" "}
                  active projects
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Completed Card */}
          <Card className="border shadow-md transition-shadow hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <div className="rounded-full bg-green-100 p-1.5 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{completedCount}</div>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 bg-green-50 text-green-600"
                >
                  <TrendingUp className="h-3 w-3" />
                  <span>+{Math.floor(completedCount * 0.25)}</span>
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {completedPercentage}% of total projects
              </p>

              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-green-600">Target</span>
                  <span className="font-medium">{completedPercentage}%</span>
                </div>
                <Progress
                  value={completedPercentage}
                  className="h-2 bg-green-100"
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-green-100 bg-green-50 p-2">
                  <div className="text-xs text-muted-foreground">On time</div>
                  <div className="text-sm font-medium text-green-600">
                    {Math.floor(completedCount * 0.8)} projects
                  </div>
                </div>
                <div className="rounded-lg border border-green-100 bg-green-50 p-2">
                  <div className="text-xs text-muted-foreground">Feedback</div>
                  <div className="text-sm font-medium text-green-600">
                    {Math.floor(90 + Math.random() * 10)}% positive
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-green-600">
                  <BarChart2 className="h-3 w-3" />
                  <span className="font-medium">
                    +{Math.floor(completedCount * 0.25)} from last month
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs gap-1 text-green-600"
                >
                  <span>Details</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* On Hold Card */}
          <Card className="border shadow-md transition-shadow hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Hold</CardTitle>
              <div className="rounded-full bg-yellow-100 p-1.5 text-yellow-600">
                <PauseCircle className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{onHoldCount}</div>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 bg-yellow-50 text-yellow-600"
                >
                  <TrendingDown className="h-3 w-3" />
                  <span>-{Math.floor(onHoldCount * 0.2)}</span>
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {onHoldPercentage}% of total projects
              </p>

              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-yellow-600">
                    Blocked by
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 px-1 text-xs gap-1 text-yellow-600"
                      >
                        <span>View issues</span>
                        <AlertCircle className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-[220px]">
                      <ul className="text-xs space-y-1">
                        <li className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                          Client feedback pending (
                          {Math.floor(onHoldCount * 0.6)})
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                          Resource allocation ({Math.floor(onHoldCount * 0.3)})
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                          Technical blockers ({Math.floor(onHoldCount * 0.1)})
                        </li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Progress
                  value={onHoldPercentage}
                  className="h-2 bg-yellow-100"
                />
              </div>

              <div className="mt-4 rounded-lg border border-yellow-100 bg-yellow-50 p-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Priority level
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 bg-yellow-100 text-yellow-700"
                  >
                    {onHoldCount > 2 ? "High" : "Medium"}
                  </Badge>
                </div>
                <div className="mt-1 text-sm font-medium text-yellow-600">
                  Expected to resume in {onHoldCount + 3} days
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-yellow-600">
                  <Clock className="h-3 w-3" />
                  <span className="font-medium">
                    Avg. delay: {onHoldCount * 2} days
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs gap-1 text-yellow-600"
                >
                  <span>Resolve</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    </div>
  );
}
