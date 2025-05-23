import { DatabaseEntity } from "./utils/database-entity";
import { Role } from "./user-management";
// Define the Status and Priority enums
export type Status = "TODO" | "IN_PROGRESS" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type ProjectStatus =
  | "NOT_STARTED"
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ON_HOLD"
  | "CANCELLED";

export interface Project extends DatabaseEntity {
  id: number;
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  status: ProjectStatus;
  priority: Priority;
  responsibleId: number | null;
  responsible?: Employee | null;
  employments?: EmployeeProject[];
  tasks?: Task[];
  userId: string | null;
  user?: User | null;
}

export interface Employee extends DatabaseEntity {
  id: number;
  phone: string | null;
  userId: string;
  user?: User;
  projects?: EmployeeProject[];
  responsibleForProj?: Project[];
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
  projects?: Project[];
}
