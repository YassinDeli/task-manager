import { Employee } from "./entreprise";
import { DatabaseEntity } from "./utils/database-entity";

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
}

export interface Role extends DatabaseEntity {
  id: number;
  label: string;
  description: string | null;
  permissions?: RolePermission[];
  users?: User[];
}

export interface Permission extends DatabaseEntity {
  id: number;
  label: string;
  description: string | null;
  roles?: RolePermission[];
}

export interface RolePermission extends DatabaseEntity {
  id: number;
  roleId: number;
  permissionId: number;
  role?: Role;
  permission?: Permission;
}
