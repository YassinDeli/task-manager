import axios from "axios";
import { ServerResponse } from "@/types";

export const dashboard = {
  getDashboardData: async (projectId: number): Promise<ServerResponse<any>> => {
    try {
      const response = await axios.get<ServerResponse<any>>(
        `/api/dashboard/${projectId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  },
};
