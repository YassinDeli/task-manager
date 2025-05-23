import axios from "axios";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { Project } from "@/types/project";
import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { ServerResponse } from "@/types";

const findPaginated = async ({
  page = "1",
  size = "5",
  sort,
  search = "",
  filter = "",
  join = "", // Default to an empty string
}: IQueryObject): Promise<Paginated<Project>> => {
  const params: { [key: string]: any } = {
    page,
    size,
    sort,
    join: join ? `${join},responsible.user,user` : 'responsible.user,user', // Ensure responsible.user is included
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;

  const response = await axios.get<Paginated<Project>>(`/api/projects/list`, {
    params,
  });

  return response.data;
};

const findAll = async (): Promise<Project[]> => {
  const response = await axios.get<Project[]>(`/api/projects`, {
    params: {
      join: 'responsible.user', // Ensure responsible.user is included
    },
  });
  return response.data;
};

const findById = async (projectId: number): Promise<Project> => {
  const response = await axios.get<Project>(`/api/projects/${projectId}`);
  return response.data;
};

const create = async (
  project: Partial<Project>
): Promise<ServerResponse<Project>> => {
  const response = await axios.post("/api/projects", project);
  return response.data;
};

const update = async (
  projectId?: number,
  project?: Partial<Project>
): Promise<ServerResponse<Project>> => {
  const response = await axios.put(`/api/projects/${projectId}`, project);
  return response.data;
};

const remove = async (projectId?: number): Promise<ServerResponse<Project>> => {
  const response = await axios.delete(`/api/projects/${projectId}`);
  return response.data;
};

const duplicate = async (id: number): Promise<ServerResponse<Project>> => {
  const response = await axios.get<ServerResponse<Project>>(
    `/api/projects/duplicate/${id}`
  );
  return response.data;
};

const seed = async (): Promise<Project> => {
  const response = await axios.get("/api/projects/seed");
  return response.data;
};

export const project = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  duplicate,
  remove,
  seed,
};
