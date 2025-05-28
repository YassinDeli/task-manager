import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Project } from "@/types/project";

async function fetchProjects(): Promise<Project[]> {
  const { data } = await axios.get<Project[]>("/api/projects");
  return data;
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
} 