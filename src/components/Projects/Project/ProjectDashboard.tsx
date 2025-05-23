"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ProjectTasksTab } from "./dashboard/taskview";
import { ProjectViewTabs } from "./dashboard/Tabs/views";
import { TabsContent } from "@/components/ui/tabs";
import { ProjectProgressCard } from "./dashboard/project-stats/ProjectProgressCard";
import { TasksCompletedCard } from "./dashboard/project-stats/TasksCompletedCard";
import { TeamMembersCard } from "./dashboard/project-stats/TeamMembersCard";
import { ProjectTimelineCard } from "./dashboard/project-stats/ProjectTimelineCard";
import { Overview } from "./dashboard/overview";
import { TeamTab } from "@/components/Projects/Project/dashboard/TeamTab";
import ContentSection from "@/components/Common/ContentSection";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { api } from "@/api";

export const ProjectDashboard = () => {
  const router = useRouter();
  const { id } = router.query;
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setRoutes } = useBreadcrumb();

  useEffect(() => {
    if (!id) return;

    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await api.dashboard.getDashboardData(Number(id));
        setDashboardData(response.data);

        // Update breadcrumbs after data is loaded
        setRoutes?.([
          { title: "Projects", href: "/projects" },
          {
            title: response.data.project.name,
            href: `/projects/${id}`,
          },
          { title: "Dashboard" }, // Current page
        ]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [id, setRoutes]); // Add setRoutes to dependency array

  const calculateTimelinePercentage = () => {
    if (!dashboardData?.project.startDate || !dashboardData?.project.endDate) {
      return 0;
    }
    const start = new Date(dashboardData.project.startDate).getTime();
    const end = new Date(dashboardData.project.endDate).getTime();
    const now = new Date().getTime();
    return Math.round(((now - start) / (end - start)) * 100);
  };

  const generateChartData = () => {
    if (!dashboardData?.tasks) return null;

    const tasks = dashboardData.tasks;
    const project = dashboardData.project;
    // Task Status Data
    const statusCounts = tasks.reduce((acc: any, task: any) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});

    const taskStatusData = [
      {
        name: "TODO",
        value: statusCounts.TODO || 0,
        color: "hsl(var(--chart-1))",
      },
      {
        name: "IN_PROGRESS",
        value: statusCounts.IN_PROGRESS || 0,
        color: "hsl(var(--chart-2))",
      },
      {
        name: "DONE",
        value: statusCounts.DONE || 0,
        color: "hsl(var(--chart-3))",
      },
    ];

    // Task Priority Data
    const priorityCounts = tasks.reduce((acc: any, task: any) => {
      if (task.priority) {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
      }
      return acc;
    }, {});

    const taskPriorityData = [
      {
        name: "LOW",
        value: priorityCounts.LOW || 0,
        color: "hsl(var(--chart-3))",
      },
      {
        name: "MEDIUM",
        value: priorityCounts.MEDIUM || 0,
        color: "hsl(var(--chart-2))",
      },
      {
        name: "HIGH",
        value: priorityCounts.HIGH || 0,
        color: "hsl(var(--chart-1))",
      },
    ];

    // Monthly Completion Data
    const monthlyTaskCompletionData = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(0, i).toLocaleString("default", {
        month: "short",
      });
      const completed = tasks.filter((task: any) => {
        return (
          task.status === "DONE" && new Date(task.createdAt).getMonth() === i
        );
      }).length;
      const created = tasks.filter((task: any) => {
        const taskDate = new Date(task.createdAt);
        return taskDate.getMonth() === i;
      }).length;
      return { month, completed, created };
    });

    // Team Contributions Data
    const teamContributionsData = dashboardData.teamContributionsData || [];

    // Recent Activity (example)
    const recentActivityData = tasks.slice(0, 3).map((task: any) => ({
      id: task.id,
      user: task.employee
        ? `${task.employee.user?.firstName} ${task.employee.user?.lastName}`
        : "Unassigned",
      action: "updated",
      item: task.title,
      time: "recently",
    }));

    const upcomingMilestonesData = [
      // Project end date as a milestone
      {
        id: "project-end",
        name: "Project Completion",
        date: project.endDate,
        status:
          project.status === "CANCELLED"
            ? "Cancelled"
            : project.status === "COMPLETED"
            ? "Completed"
            : "On Track",
      },
      // Important tasks with due dates as milestones
      ...tasks
        .filter((task: any) => task.dueDate)
        .map((task: any) => ({
          id: `task-${task.id}`,
          name: task.title,
          date: task.dueDate,
          status:
            task.status === "DONE"
              ? "Completed"
              : new Date(task.dueDate) < new Date()
              ? "Delayed"
              : "On Track",
        })),
    ].filter((milestone) => milestone.date);

    return {
      taskStatusData,
      taskPriorityData,
      monthlyTaskCompletionData,
      teamContributionsData,
      recentActivityData,
      upcomingMilestonesData,
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium text-red-500">{error}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium">No dashboard data available</p>
      </div>
    );
  }

  const chartData = generateChartData();

  return (
    <div className="h-screen overflow-y-auto p-6">
      <ContentSection
        title={`Projects - ${dashboardData.project.name} Dashboard`}
        desc="Monitor progress, track tasks, and manage your project"
        className="w-full"
      ></ContentSection>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
        <ProjectProgressCard
          progressPercentage={
            dashboardData.stats.totalTasks > 0
              ? Math.round(
                  (dashboardData.stats.completedTasks /
                    dashboardData.stats.totalTasks) *
                    100
                )
              : 0
          }
        />
        <TasksCompletedCard
          completedTasks={dashboardData.stats.completedTasks}
          totalTasks={dashboardData.stats.totalTasks}
        />
        <TeamMembersCard
          teamMembers={dashboardData.teamMembers}
          projectTasks={dashboardData.tasks}
          responsibleId={dashboardData.project.responsibleId}
        />
        <ProjectTimelineCard
          startDate={new Date(dashboardData.project.startDate)}
          endDate={
            dashboardData.project.endDate
              ? new Date(dashboardData.project.endDate)
              : null
          }
          timelinePercentage={calculateTimelinePercentage()}
        />
      </div>

      <div className="mb-6">
        <ProjectViewTabs>
          <TabsContent value="overview">
            {chartData && (
              <Overview
                taskStatusData={chartData.taskStatusData}
                taskPriorityData={chartData.taskPriorityData}
                monthlyTaskCompletionData={chartData.monthlyTaskCompletionData}
                teamContributionsData={chartData.teamContributionsData}
                recentActivityData={chartData.recentActivityData}
                upcomingMilestonesData={chartData.upcomingMilestonesData}
              />
            )}
          </TabsContent>

          <TabsContent value="tasks">
            <ProjectTasksTab
              projectData={dashboardData.project}
              projectTasks={dashboardData.tasks}
            />
          </TabsContent>

          <TabsContent value="team">
            <TeamTab
              projectName={dashboardData.project.name}
              teamMembers={dashboardData.teamMembers}
              projectTasks={dashboardData.tasks}
            />
          </TabsContent>
        </ProjectViewTabs>
      </div>
    </div>
  );
};

export default ProjectDashboard;
