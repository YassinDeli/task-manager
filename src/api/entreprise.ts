import axios from "axios";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { Entreprise, ServerResponse } from "@/types";
import { IQueryObject } from "@/lib/prisma/interfaces/query-params";

const findPaginated = async ({
  page = "1",
  size = "5",
  sort,
  search = "",
  filter = "",
  join = "",
}: IQueryObject): Promise<Paginated<Entreprise>> => {
  const params: { [key: string]: any } = {
    page,
    size,
    sort,
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  console.log("Request Params for Paginated:", params); // Log request parameters
  const response = await axios.get<Paginated<Entreprise>>(
    `/api/entreprises/list`,
    { params: {
      ...params,
      join: "address", // Ensure project data is included
    }, }
  );
  
  console.log("Response Data from Paginated Request:", response.data); // Log the response
  return response.data;
};

const findAll = async (): Promise<Entreprise[]> => {
  console.log("Fetching all entreprises..."); // Log when the API call starts
  const response = await axios.get<Entreprise[]>(`/api/entreprises`);
  console.log("Response Data from Find All:", response.data); // Log the response
  return response.data;
};

const findAllEmails = async (): Promise<string[]> => {
  const params: { [key: string]: any } = {
    fields: "email",
  };
  console.log("Request Params for Emails:", params); // Log request parameters for emails
  const response = await axios.get<Entreprise[]>(`/api/entreprises`, {
    params,
  });
  const emails = response.data.map((e) => e?.email);
  console.log("Emails from Response:", emails); // Log the extracted emails
  return emails;
};

const findById = async (entrepriseId: number): Promise<Entreprise> => {
  console.log(`Fetching entreprise with ID: ${entrepriseId}`); // Log the ID being fetched
  const response = await axios.get<Entreprise>(
    `/api/entreprises/${entrepriseId}`
  );
  console.log("Response Data from Find By ID:", response.data); // Log the response
  return response.data;
};

const create = async (
  entrepriseCreateDto: Partial<Entreprise>
): Promise<ServerResponse<Entreprise>> => {
  console.log("Creating entreprise with data:", entrepriseCreateDto); // Log the data being sent for creation
  const response = await axios.post("/api/entreprises", entrepriseCreateDto);
  console.log("Response Data from Create:", response.data); // Log the response
  return response.data;
};

const update = async (
  entrepriseId: number,
  Entreprise: Partial<Entreprise>
): Promise<Entreprise> => {
  console.log(`Updating entreprise with ID: ${entrepriseId} and data:`, Entreprise); // Log the update details
  const response = await axios.put<Entreprise>(
    `/api/entreprises/${entrepriseId}`,
    Entreprise
    
  );
  console.log("Response Data from Update:", response.data); // Log the response
  return response.data;
};

const remove = async (entrepriseId: number): Promise<void> => {
  console.log(`Deleting entreprise with ID: ${entrepriseId}`); // Log the ID being deleted
  await axios.delete(`/api/entreprises/${entrepriseId}`);
  console.log(`Entreprise with ID: ${entrepriseId} has been deleted`); // Log after deletion
};

const seed = async (): Promise<Entreprise> => {
  console.log("Seeding entreprise data..."); // Log when seeding starts
  const response = await axios.get("/api/entreprises/seed");
  console.log("Response Data from Seed:", response.data); // Log the response
  return response.data;
};

export const entreprise = {
  findPaginated,
  findAll,
  findAllEmails,
  findById,
  create,
  update,
  remove,
  seed,
};
