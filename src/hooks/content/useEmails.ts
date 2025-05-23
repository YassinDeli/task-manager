import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useEmails = () => {
  //entreprises
  const {
    isFetching: isFetchEntrepriseEmailsPending,
    data: entrepriseEmailsResp,
    refetch: refetchEntrepriseEmails,
  } = useQuery({
    queryKey: ["entreprise-emails"],
    queryFn: () => api.entreprise.findAllEmails(),
  });

  const entrepriseEmails = React.useMemo(() => {
    if (!entrepriseEmailsResp) return [];
    return entrepriseEmailsResp;
  }, [entrepriseEmailsResp]);

  //employees
  const {
    isFetching: isFetchEmployeeEmailsPending,
    data: employeeEmailsResp,
    refetch: refetchEmployeeEmails,
  } = useQuery({
    queryKey: ["employee-emails"],
    queryFn: () => api.employee.findAllEmails(),
  });

  const employeeEmails = React.useMemo(() => {
    if (!employeeEmailsResp) return [];
    return employeeEmailsResp;
  }, [employeeEmailsResp]);

  const refetchEmails = () => {
    refetchEntrepriseEmails();
    refetchEmployeeEmails();
  };

  return {
    emails: [...entrepriseEmails, ...employeeEmails],
    isFetchEmailsPending:
      isFetchEntrepriseEmailsPending || isFetchEmployeeEmailsPending,
    refetchEmails,
  };
};
