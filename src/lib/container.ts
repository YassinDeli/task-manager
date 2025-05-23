// lib/container.ts

import { PrismaClient } from "@prisma/client";
import { UserService } from "./users-management/services/user.service";
import { UserRepository } from "./users-management/repositories/user.repository";
import { RoleRepository } from "./users-management/repositories/role.repository";
import { RolePermissionRepository } from "./users-management/repositories/role-permission.repository";
import { RoleService } from "./users-management/services/role.service";
import { PermissionRepository } from "./users-management/repositories/permission.repository";
import { PermissionService } from "./users-management/services/permission.service";
import { AuthService } from "./auth/services/auth.service";
import { EntrepriseService } from "./entreprise/services/entreprise.service";
import { EntrepriseRepository } from "./entreprise/repositories/entreprise.repository";
import { TaskService } from "./tasks/services/task.service";
import { TaskRepository } from "./tasks/repositories/task.repository";
import { AddressService } from "./address/services/address.service";
import { AddressRepository } from "./address/repositories/address.repository";
import { EmployeeService } from "./entreprise/services/employee.service";
import { EmployeeRepository } from "./entreprise/repositories/employee.repository";
import { CountryRepository } from "./address/repositories/country.repository";
import { CountryService } from "./address/services/country.service";
import { ProjectRepository } from "./projects/repositories/project.repository";
import { ProjectService } from "./projects/services/project.service";
import { DashboardService } from "./projects/services/dashboard.service"; // Import DashboardService
import { GeneralDashboardService } from "./dashboard/services/GeneralDashboard.service"; // Import DashboardService

const prisma = new PrismaClient();

// user-management + auth
const userService = new UserService(new UserRepository(prisma));
const authService = new AuthService(userService);
const roleService = new RoleService(
  new RoleRepository(prisma),
  new RolePermissionRepository(prisma)
);
const permissionService = new PermissionService(
  new PermissionRepository(prisma)
);

const addressService = new AddressService(new AddressRepository(prisma)); // address
const countryService = new CountryService(new CountryRepository(prisma)); // country

// entreprise
const employeeService = new EmployeeService(
  new EmployeeRepository(prisma),
  userService
); // employee
const entrepriseService = new EntrepriseService(
  new EntrepriseRepository(prisma),
  addressService,
  employeeService
);

// task
const taskService = new TaskService(
  new TaskRepository(prisma),
  employeeService,
  userService
);

// project
const projectRepository = new ProjectRepository(prisma); // Create ProjectRepository instance
const projectService = new ProjectService(
  projectRepository,
  employeeService,
  taskService // Inject TaskService, remove UserService
);

// dashboard for each project not en general
const dashboardService = new DashboardService(
  taskService,
  employeeService,
  projectService,
  userService
);

// dashboard General

const generaldashboardservice = new GeneralDashboardService(
  taskService,
  employeeService,
  projectService,
  userService
);

const container = {
  AuthService: authService,
  UserService: userService,
  RoleService: roleService,
  PermissionService: permissionService,
  TaskService: taskService,
  AddressService: addressService,
  CountryService: countryService,
  EntrepriseService: entrepriseService,
  EmployeeService: employeeService,
  ProjectService: projectService,
  DashboardService: dashboardService,
  GeneralDashboardService: generaldashboardservice, // Add DashboardService to the container
};

export default container;
