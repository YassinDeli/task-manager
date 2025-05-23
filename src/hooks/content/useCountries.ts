import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useCountries = () => {
  const { isFetching: isFetchCountriesPending, data: countriesResp } =
    useQuery({
      queryKey: ["countries"],
      queryFn: () => api.country.findAll(),
    });

  const countries = React.useMemo(() => {
    if (!countriesResp) return [];
    return countriesResp;
  }, [countriesResp]);

  return {
    countries,
    isFetchCountriesPending,
  };
};