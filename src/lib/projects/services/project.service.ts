import { ProjectRepository } from "../repositories/project.repository";
import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { Project } from "@/types/project";
import { EmployeeService } from "@/lib/entreprise/services/employee.service";
import { TaskService } from "@/lib/tasks/services/task.service";

export class ProjectService {
  private projectRepository: ProjectRepository;
  private employeeService: EmployeeService;
  private taskService: TaskService;

  constructor(
    projectRepository: ProjectRepository,
    employeeService: EmployeeService,
    taskService: TaskService
  ) {
    this.projectRepository = projectRepository;
    this.employeeService = employeeService;
    this.taskService = taskService;
  }

  async getAllProjects(queryObject: IQueryObject): Promise<Project[]> {
    // Ensure we always join the responsible employee and user
    const enhancedQuery = {
      ...queryObject,
      join: queryObject.join
        ? `${queryObject.join},responsible.user`
        : "responsible.user",
    };
    return this.projectRepository.findByCondition(enhancedQuery);
  }

  async getPaginatedProjects(
    queryObject: IQueryObject
  ): Promise<Paginated<Project>> {
    // Ensure we always join the responsible employee and user
    const enhancedQuery = {
      ...queryObject,
      join: queryObject.join
        ? `${queryObject.join},responsible.user`
        : "responsible.user",
    };
    return this.projectRepository.findPaginated(enhancedQuery);
  }

  async getProjectById(id: number): Promise<Project | null> {
    return this.projectRepository.findById(id);
  }

  // In project.service.ts
  async createProject(data: Partial<Project>): Promise<Project> {
    // Auto-assign responsibleId: 1 if not provided
    const projectData = {
      ...data,
      responsibleId: data.responsibleId ?? 1, // Default to 1 if not specified
    };

    const project: Project = await this.projectRepository.create(projectData);
    return project;
  }

  async createProjectWithResponsible(data: Partial<Project>): Promise<Project> {
    // If responsible data is provided, use it, otherwise default to responsibleId: 1
    const responsibleId = data.responsible
      ? (await this.employeeService.createResponsibleWithUser(data.responsible))
          ?.id
      : 1;

    const project = await this.projectRepository.create({
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      priority: data.priority ?? "MEDIUM",
      status: data.status ?? "NOT_STARTED",
      responsibleId, // Will be either the new responsible or 1
      userId: data.userId,
    });

    return project;
  }

  async updateProject(id: number, data: Partial<Project>): Promise<Project> {
    return this.projectRepository.update(id, data);
  }

  async duplicateProject(projectId: number): Promise<Project | undefined> {
    const project = await this.projectRepository.findOneByCondition({
      filter: `id||$eq||${projectId}`,
      join: "",
    });
    if (project) {
      return this.createProject({
        name: `${project.name} Duplicate`,
        description: project.description,
      });
    }
  }

  async deleteProject(id: number): Promise<Project> {
    return this.projectRepository.softDelete(id);
  }

  async countProjects(where: any = {}): Promise<number> {
    return this.projectRepository.count(where);
  }
}
