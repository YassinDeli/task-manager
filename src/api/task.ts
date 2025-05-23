import axios from "axios";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { Task } from "@/types/task";
import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { ServerResponse } from "@/types";

const findPaginated = async ({
  page = "1",
  size = "5",
  sort,
  search = "",
  filter = "",
  join = "",
}: IQueryObject): Promise<Paginated<Task>> => {
  const params: { [key: string]: any } = {
    page,
    size,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<Task>>(`/api/tasks/list`, {
    params: {
      ...params,
      join: "project,user", // Ensure project data is included
    },
  });

  return response.data;
};
const findAll = async (): Promise<Task[]> => {
  const response = await axios.get<Task[]>(`/api/tasks`);
  return response.data;
};

const findById = async (taskId: number): Promise<Task> => {
  const response = await axios.get<Task>(`/api/tasks/${taskId}`);
  return response.data;
};

const create = async (task: Partial<Task>): Promise<ServerResponse<Task>> => {
  const response = await axios.post("/api/tasks", task);
  return response.data;
};

const update = async (
  taskId?: number,
  task?: Partial<Task>
): Promise<ServerResponse<Task>> => {
  const response = await axios.put(`/api/tasks/${taskId}`, task);
  return response.data;
};

const remove = async (taskId?: number): Promise<ServerResponse<Task>> => {
  const response = await axios.delete(`/api/tasks/${taskId}`);
  return response.data;
};
const duplicate = async (id: number): Promise<ServerResponse<Task>> => {
  const response = await axios.get<ServerResponse<Task>>(
    `/api/tasks/duplicate/${id}`
  );
  return response.data;
};

const seed = async (): Promise<Task> => {
  const response = await axios.get("/api/tasks/seed");
  return response.data;
};

export const task = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  duplicate,
  remove,
};
