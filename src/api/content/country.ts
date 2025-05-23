import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { Country } from "@/types";
import axios from "axios";

const findPaginated = async ({
  page = "1",
  size = "5",
  sort,
  search = "",
  filter = "",
  join = "",
}: IQueryObject): Promise<Paginated<Country>> => {
  const params: { [key: string]: any } = {
    page,
    size,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<Country>>(
    `/api/content/countries/list`,
    { params }
  );

  return response.data;
};

const findAll = async (): Promise<Country[]> => {
  const response = await axios.get<Country[]>(`/api/content/countries`);
  return response.data;
};

export const country = {
  findPaginated,
  findAll,
};
