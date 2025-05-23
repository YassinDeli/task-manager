import { Address } from "./address";
import { User } from "./user-management";
import { DatabaseEntity } from "./utils/database-entity";

export interface Entreprise extends DatabaseEntity {
  id: number;
  name: string;
  address?: Address;
  addressId?: number;
  phone: string;
  email: string;
  responsible?: Employee;
  responsibleId: number;
}

export interface EmployeeEntreprise extends DatabaseEntity {
  id: number;
  employeeId: number;
  entrepriseId: number;
  position: string | null;
  employee?: Employee;
  entreprise?: Entreprise;
}

export interface Employee extends DatabaseEntity {
  id: number;
  phone: string | null;
  userId: string;
  user?: User;
  employments?: EmployeeEntreprise[];
  responsibleFor?: Entreprise[];
}
export interface CreateEnterpriseDto {
  name: string;
  phone: string;
  email: string;
  responsibleId: number;
  address?: Address; // Optional, include only if you have address data
}

export interface UpdateEnterpriseDto extends CreateEnterpriseDto {}