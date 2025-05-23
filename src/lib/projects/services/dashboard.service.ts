import { TaskService } from "@/lib/tasks/services/task.service";
import { EmployeeService } from "@/lib/entreprise/services/employee.service";
import { ProjectService } from "@/lib/projects/services/project.service";
import { UserService } from "@/lib/users-management/services/user.service"; // You'll need to import this

export class DashboardService {
  private taskService: TaskService;
  private employeeService: EmployeeService;
  private projectService: ProjectService;
  private userService: UserService; // Add this

  constructor(
    taskService: TaskService,
    employeeService: EmployeeService,
    projectService: ProjectService,
    userService: UserService // Add this
  ) {
    this.taskService = taskService;
    this.employeeService = employeeService;
    this.projectService = projectService;
    this.userService = userService; // Add this
  }

  async getDashboardData(projectId: number) {
    try {
      console.log(`[Dashboard] Fetching data for project ${projectId}`);

      // 1. Get project with responsible employee
      const project = await this.projectService.getProjectById(projectId);
      if (!project) {
        throw new Error(`Project ${projectId} not found`);
      }

      // 2. Get all tasks with assigned users (not employees)
      const tasks = await this.taskService.getAllTasks({
        filter: `projectId||$eq||${projectId}`,
        join: "user,project", // Changed from employee.user to just user
      });

      // 3. Build team members list (all users who have tasks in this project)
      const teamMembersMap = new Map<string, any>(); // Changed to string for userId

      // Add project responsible first if exists
      if (project.responsibleId) {
        const responsible = await this.employeeService.getEmployeeById(
          project.responsibleId
        );
        if (responsible) {
          teamMembersMap.set(responsible.userId, {
            ...responsible,
            role: "responsible",
          });
        }
      }

      // Add all users from tasks
      tasks.forEach((task) => {
        if (task.user && !teamMembersMap.has(task.user.id)) {
          // Determine role based on user's roleId
          let role = "employee"; // default
          if (task.user.roleId === 1) role = "responsible";
          if (task.user.roleId === 2) role = "admin";

          teamMembersMap.set(task.user.id, {
            id: null, // No employee id
            phone: null,
            userId: task.user.id,
            createdAt: null,
            updatedAt: null,
            deletedAt: null,
            role: role,
            user: task.user, // Include full user data if needed
          });
        }
      });

      // Convert map to array
      const teamMembers = Array.from(teamMembersMap.values());

      // 4. Generate team contributions data for the chart
      const teamContributionsData = [];

      // Add responsible first if exists
      if (project.responsibleId) {
        const responsibleTasks = tasks.filter(
          (task) => task.userId === project.userId // Assuming project has userId for responsible
        );

        teamContributionsData.push({
          name: "Responsible",
          tasks: responsibleTasks.length,
          completed: responsibleTasks.filter((t) => t.status === "DONE").length,
        });
      }

      // Group tasks by user for contributions
      const tasksByUser = new Map<string, any>();
      tasks.forEach((task) => {
        if (!tasksByUser.has(task.userId)) {
          tasksByUser.set(task.userId, []);
        }
        tasksByUser.get(task.userId).push(task);
      });

      // Add contributions for each team member
      teamMembers.forEach((member) => {
        if (member.role !== "responsible") {
          const userTasks = tasksByUser.get(member.userId) || [];
          const roleName =
            member.role.charAt(0).toUpperCase() + member.role.slice(1);

          teamContributionsData.push({
            name: `${roleName}`,
            tasks: userTasks.length,
            completed: userTasks.filter((t) => t.status === "DONE").length,
          });
        }
      });

      // Add unassigned tasks if they exist (tasks with no userId)
      const unassignedTasks = tasks.filter((task) => !task.userId);
      if (unassignedTasks.length > 0) {
        teamContributionsData.push({
          name: "Unassigned Tasks",
          tasks: unassignedTasks.length,
          completed: unassignedTasks.filter((t) => t.status === "DONE").length,
        });
      }

      // 5. Prepare statistics
      const stats = {
        totalTasks: tasks.length,
        completedTasks: tasks.filter((t) => t.status === "DONE").length,
        inProgressTasks: tasks.filter((t) => t.status === "IN_PROGRESS").length,
        teamSize: teamMembers.length,
      };

      return {
        project,
        tasks,
        teamMembers,
        teamContributionsData,
        stats,
      };
    } catch (error) {
      console.error("[Dashboard] Error fetching data:", error);
      throw error;
    }
  }
}
