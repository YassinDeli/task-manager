// src/lib/dashboard/dashboard.api.js
import axios from "axios";

export const fetchDashboardData = async () => {
  try {
    const response = await axios.get("/api/general-dashboard");
    return response.data; // Assuming your API returns { success, data, message } structure
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

export const dashboardApi = {
  fetchDashboardData,
  // Can add more methods here as needed
};
