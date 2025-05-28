import { DatabaseEntity } from "./utils/database-entity";
import { Role } from "./user-management";
import { EmployeeEntreprise, Entreprise } from "./entreprise";

// Define the Status and Priority enums
export enum Status {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE"
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH"
}

export type ProjectStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";

export interface Task extends DatabaseEntity {
  id: number;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  dueDate: Date | null;
  employeeId: number | null;
  employee?: Employee | null;
  projectId: number | null;
  project?: Project | null;
  userId: string | null;
  user?: User | null;
}

export interface Employee extends DatabaseEntity {
  id: number;
  phone: string | null;
  userId: string;
  user?: User;
  tasks?: Task[];
  employments?: EmployeeEntreprise[];
}

export interface Project extends DatabaseEntity {
  id: number;
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  status: ProjectStatus;
  employees?: EmployeeProject[];
  tasks?: Task[];
}

export interface EmployeeProject extends DatabaseEntity {
  id: number;
  employeeId: number;
  projectId: number;
  role: string | null;
  employee?: Employee;
  project?: Project;
}

export interface User extends DatabaseEntity {
  id: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: Date | null;
  isActive: boolean | null;
  password: string | null;
  username: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  roleId: number | null;
  role?: Role | null;
  employee?: Employee | null;
  refreshToken: string | null;
  tasks?: Task[];
}
