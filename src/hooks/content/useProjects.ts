import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@/types/project";

export const useProjects = () => {
  const { isFetching: isFetchProjectsPending, data: projectsResp } = useQuery({
    queryKey: ["projects"], // Unique key for this query
    queryFn: () => api.project.findPaginated({
      size: "1000", // Fetch all projects at once (adjust if needed)
      page: "1",
    }),
  });

  const projects = React.useMemo(() => {
    if (!projectsResp?.data) return [];
    return projectsResp.data;
  }, [projectsResp]);

  return {
    projects, // List of projects
    isFetchProjectsPending,
  };
};