import axios from "axios";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { User } from "@/types/user-management";
import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { ServerResponse } from "@/types";

const findPaginated = async ({
  page = "1",
  size = "5",
  sort,
  search = "",
  filter = "",
  join = "role",
}: IQueryObject): Promise<Paginated<User>> => {
  const params: { [key: string]: any } = {
    page,
    size,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<User>>(`/api/users/list`, {
    params,
  });

  return response.data;
};

const activate = async (id?: string): Promise<ServerResponse<User>> => {
  const response = await axios.get(`/api/users/activate/${id}`);
  return response.data;
};

const deactivate = async (id?: string): Promise<ServerResponse<User>> => {
  const response = await axios.get(`/api/users/deactivate/${id}`);
  return response.data;
};

const findAll = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(`/api/users`);
  return response.data;
};

const findById = async (userId: string): Promise<User> => {
  const response = await axios.get<User>(`/api/users/${userId}`);
  return response.data;
};

const create = async (user: Partial<User>): Promise<ServerResponse<User>> => {
  const response = await axios.post("/api/users", user);
  return response.data;
};

const update = async (
  userId?: string,
  user?: Partial<User>
): Promise<ServerResponse<User>> => {
  const response = await axios.put(`/api/users/${userId}`, user);
  return response.data;
};

const remove = async (userId?: string): Promise<ServerResponse<User>> => {
  const response = await axios.delete(`/api/users/${userId}`);
  return response.data;
};

export const user = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  activate,
  deactivate,
  remove,
};
