import axios from "axios";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { Role } from "@/types/user-management";
import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { ServerResponse } from "@/types";

const findPaginated = async ({
  page = "1",
  size = "5",
  sort,
  search = "",
  filter = "",
  join = "permissions.permission",
}: IQueryObject): Promise<Paginated<Role>> => {
  const params: { [key: string]: any } = {
    page,
    size,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<Role>>(`/api/roles/list`, {
    params,
  });

  return response.data;
};

const findAll = async (): Promise<Role[]> => {
  const response = await axios.get<Role[]>(`/api/roles`);
  return response.data;
};

const findById = async (roleId: number): Promise<Role> => {
  const response = await axios.get<Role>(`/api/roles/${roleId}`);
  return response.data;
};

const create = async (role: Partial<Role>): Promise<ServerResponse<Role>> => {
  const response = await axios.post("/api/roles", role);

  return response.data;
};

const update = async (
  roleId: number,
  role: Partial<Role>
): Promise<ServerResponse<Role>> => {
  const response = await axios.put(`/api/roles/${roleId}`, role);
  return response.data;
};

const duplicate = async (roleId?: number): Promise<ServerResponse<Role>> => {
  const response = await axios.get(`/api/roles/duplicate/${roleId}`);
  return response.data;
};

const remove = async (roleId?: number): Promise<ServerResponse<Role>> => {
  const response = await axios.delete(`/api/roles/${roleId}`);
  return response.data;
};

export const role = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  duplicate,
  remove,
};
