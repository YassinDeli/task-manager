import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { EmployeeRepository } from "../repositories/employee.repository";
import { Employee, User } from "@/types";
import { UserService } from "@/lib/users-management/services/user.service";

export class EmployeeService {
  private employeeRepository: EmployeeRepository;
  private userService: UserService;

  constructor(
    employeeRepository: EmployeeRepository,
    userService: UserService
  ) {
    this.employeeRepository = employeeRepository;
    this.userService = userService;
  }
  async getPaginatedEmployees(
    queryObject: IQueryObject
  ): Promise<Paginated<Employee>> {
    return this.employeeRepository.findPaginated(queryObject);
  }

  async getAllEmployees(queryObject: IQueryObject): Promise<Employee[]> {
    return this.employeeRepository.findByCondition(queryObject);
  }

  async getEmployeeById(id: number): Promise<Employee | null> {
    return this.employeeRepository.findById(id);
  }

  async createEmployee(data: Partial<Employee>): Promise<Employee> {
    return this.employeeRepository.create(data);
  }

  // In employee.service.ts
  async createResponsibleWithUser(data: Partial<Employee>) {
    if (!data.user?.email) {
      throw new Error("User email is required");
    }

    // First check if user exists using findOneByCondition
    const existingUser = await this.userService.findOneByCondition({
      filter: `email:${data.user.email}`,
    });

    if (existingUser) {
      // Update existing user to be responsible (roleId: 3)
      const updatedUser = await this.userService.updateUser(existingUser.id, {
        ...existingUser,
        roleId: 3, // Responsible role
      });

      // Check if employee record already exists for this user
      const existingEmployee = await this.employeeRepository.findOneByCondition(
        {
          filter: `userId:${updatedUser.id}`,
        }
      );

      if (existingEmployee) {
        // Update existing employee if needed
        return this.employeeRepository.update(existingEmployee.id, {
          phone: data.phone || existingEmployee.phone,
        });
      }

      // Create new employee record
      return this.employeeRepository.create({
        userId: updatedUser.id,
        phone: data.phone,
      });
    } else {
      // Create new user with responsible role
      const user = await this.userService.createUser({
        ...data.user,
        roleId: 3,
      });
      return this.employeeRepository.create({
        userId: user.id,
        phone: data.phone,
      });
    }
  }

  async updateEmployee(id: number, data: Partial<Employee>): Promise<Employee> {
    return this.employeeRepository.update(id, data);
  }

  async deleteEmployee(id: number): Promise<Employee> {
    return this.employeeRepository.softDelete(id);
  }

  async countEmployees(where: any = {}): Promise<number> {
    return this.employeeRepository.count(where);
  }
}
