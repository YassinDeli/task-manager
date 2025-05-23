import axios from "axios";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { Employee } from "@/types";
import { IQueryObject } from "@/lib/prisma/interfaces/query-params";

const findPaginated = async ({
  page = "1",
  size = "5",
  sort,
  search = "",
  filter = "",
  join = "",
}: IQueryObject): Promise<Paginated<Employee>> => {
  const params: { [key: string]: any } = {
    page,
    size,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<Employee>>(`/api/employees/list`, {
    params,
  });

  return response.data;
};

const findAll = async (): Promise<Employee[]> => {
  const response = await axios.get<Employee[]>(`/api/employees`);
  return response.data;
};

//this functions fetches all emails from all employees
const findAllEmails = async (): Promise<string[]> => {
  const params: { [key: string]: any } = {
    join: "user",
  };
  const response = await axios.get<Employee[]>(`/api/employees`, {
    params,
  });
  return response.data.map((e) => e?.user?.email).filter(Boolean) as string[];
};

const findById = async (employeeId: number): Promise<Employee> => {
  const response = await axios.get<Employee>(`/api/employees/${employeeId}`);
  return response.data;
};

const create = async (employee: Employee): Promise<Employee> => {
  const response = await axios.post<Employee>("/api/employees", employee);
  return response.data;
};

const update = async (
  entrepriseId: number,
  employee: Partial<Employee>
): Promise<Employee> => {
  const response = await axios.put<Employee>(
    `/api/employees/${entrepriseId}`,
    employee
  );
  return response.data;
};

const remove = async (employeeId: number): Promise<void> => {
  await axios.delete(`/api/employees/${employeeId}`);
};

export const employee = {
  findPaginated,
  findAll,
  findAllEmails,
  findById,
  create,
  update,
  remove,
};
