import { TaskRepository } from "../repositories/task.repository";
import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { Task } from "@/types/task";
import { EmployeeService } from "@/lib/entreprise/services/employee.service";
import { UserService } from "@/lib/users-management/services/user.service";

export class TaskService {
  private taskRepository: TaskRepository;
  private employeeService: EmployeeService;
  private userService: UserService;
  constructor(
    taskRepository: TaskRepository,
    employeeService: EmployeeService,
    userService: UserService
  ) {
    this.taskRepository = taskRepository;
    this.employeeService = employeeService;
    this.userService = userService;
  }

  async getPaginatedTasks(queryObject: IQueryObject): Promise<Paginated<Task>> {
    return this.taskRepository.findPaginated(queryObject);
  }

  async getAllTasks(queryObject: IQueryObject): Promise<Task[]> {
    return this.taskRepository.findByCondition(queryObject);
  }

  async getTaskById(id: number): Promise<Task | null> {
    return this.taskRepository.findById(id);
  }

  async createTask(data: Partial<Task>): Promise<Task> {
    const task: Task = await this.taskRepository.create(data);
    return task;
  }

  async updateTask(id: number, data: Partial<Task>): Promise<Task> {
    return this.taskRepository.update(id, data);
  }

  async duplicateTask(taskId: number): Promise<Task | undefined> {
    const task = await this.taskRepository.findOneByCondition({
      filter: `id||$eq||${taskId}`,
      join: "",
    });
    if (task) {
      return this.createTask({
        title: `${task.title} Duplicate`,
        description: task.description,
      });
    }
  }

  async deleteTask(id: number): Promise<Task> {
    return this.taskRepository.softDelete(id);
  }

  async countTasks(where: any = {}): Promise<number> {
    return this.taskRepository.count(where);
  }
}
