import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useUsers = () => {
  const { isFetching: isFetchUsersPending, data: usersResp } = useQuery({
    queryKey: ["users-with-roles"],  // Unique key for this filtered query
    queryFn: () => api.user.findPaginated({
      join: "role",  // Ensure roles are included
      size: "1000",  // Fetch all users at once (adjust if needed)
      page: "1",
    }),
  });

  const usersWithRoles = React.useMemo(() => {
    if (!usersResp?.data) return [];
    
    // Filter out users with no role (role === null or undefined)
    return usersResp.data.filter(user => user.role != null);
  }, [usersResp]);

  return {
    users: usersWithRoles,  // Only users WITH roles
    isFetchUsersPending,
  };
};