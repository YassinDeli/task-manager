import { TaskService } from "@/lib/tasks/services/task.service";
import { EmployeeService } from "@/lib/entreprise/services/employee.service";
import { ProjectService } from "@/lib/projects/services/project.service";
import { UserService } from "@/lib/users-management/services/user.service";

export class GeneralDashboardService {
  private taskService: TaskService;
  private employeeService: EmployeeService;
  private projectService: ProjectService;
  private userService: UserService;

  constructor(
    taskService: TaskService,
    employeeService: EmployeeService,
    projectService: ProjectService,
    userService: UserService
  ) {
    this.taskService = taskService;
    this.employeeService = employeeService;
    this.projectService = projectService;
    this.userService = userService;
  }

  async getGeneralDashboardData() {
    try {
      console.log("[General Dashboard] Fetching aggregated data");

      // 1. Get all projects with their status and priority
      const projects = await this.projectService.getAllProjects({
        join: "responsible.user,tasks", // Include responsible person and tasks
      });

      // 2. Get all tasks across all projects
      const tasks = await this.taskService.getAllTasks({
        join: "user,project", // Include assigned user and project
      });

      // 3. Get all active users
      const users = await this.userService.getAllUsers({
        filter: "isActive||$eq||true",
      });

      // 4. Build general statistics
      const stats = {
        totalProjects: projects.length,
        totalTasks: tasks.length,
        totalUsers: users.length,
        projectsByStatus: this.groupByStatus(projects, "status"),
        tasksByStatus: this.groupByStatus(tasks, "status"),
        projectsByPriority: this.groupByPriority(projects),
        tasksByPriority: this.groupByPriority(tasks),
      };

      // 5. Build timeline data for projects
      const timelineData = projects.map((project) => ({
        id: project.id,
        name: project.name,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status,
        priority: project.priority,
        responsible: project.responsible?.user?.username || "Unassigned",
      }));

      // 6. Build team workload data
      const teamWorkload = this.calculateTeamWorkload(tasks, users);

      return {
        stats,
        timelineData,
        teamWorkload,
        recentProjects: projects.slice(0, 5), // Show 5 most recent projects
        recentTasks: tasks.slice(0, 5), // Show 5 most recent tasks
      };
    } catch (error) {
      console.error("[General Dashboard] Error fetching data:", error);
      throw error;
    }
  }

  private groupByStatus(items: any[], statusField: string) {
    const groups: Record<string, number> = {};
    items.forEach((item) => {
      const status = item[statusField] || "UNKNOWN";
      groups[status] = (groups[status] || 0) + 1;
    });
    return groups;
  }

  private groupByPriority(items: any[]) {
    const groups: Record<string, number> = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
    };
    items.forEach((item) => {
      const priority = item.priority || "LOW";
      groups[priority]++;
    });
    return groups;
  }

  private calculateTeamWorkload(tasks: any[], users: any[]) {
    const workload: Record<string, any> = {};

    // Initialize workload for each user
    users.forEach((user) => {
      workload[user.id] = {
        username: user.username,
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        todoTasks: 0,
      };
    });

    // Add unassigned tasks group
    workload.unassigned = {
      username: "Unassigned",
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      todoTasks: 0,
    };

    // Calculate workload
    tasks.forEach((task) => {
      const target = task.userId ? workload[task.userId] : workload.unassigned;
      if (target) {
        target.totalTasks++;
        if (task.status === "DONE") target.completedTasks++;
        else if (task.status === "IN_PROGRESS") target.inProgressTasks++;
        else target.todoTasks++;
      }
    });

    // Convert to array and filter out users with no tasks
    return Object.values(workload).filter((user: any) => user.totalTasks > 0);
  }
}
