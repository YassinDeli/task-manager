import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useTasks = () => {
  const { isFetching: isFetchTasksPending, data: tasksResp } =
    useQuery({
      queryKey: ["tasks"],
      queryFn: () => api.task.findAll(),
    });

  const tasks = React.useMemo(() => {
    if (!tasksResp) return [];
    return tasksResp;
  }, [tasksResp]);

  return {
    tasks,
    isFetchTasksPending,
  };
};