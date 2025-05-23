import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set response headers
  res.setHeader("Content-Type", "application/json");

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
      code: 405,
      message: "Only GET requests are supported",
    });
  }

  try {
    const projectId = req.query.projectId;

    // Validate projectId exists and is a single value
    if (!projectId || Array.isArray(projectId)) {
      console.error("Project ID missing or invalid format:", projectId);
      return res.status(400).json({
        success: false,
        error: "Invalid Request",
        code: 400,
        message:
          "Project ID must be provided in URL path (e.g., /api/dashboard/1)",
      });
    }

    // Convert to number
    const numericProjectId = parseInt(projectId as string, 10);
    if (isNaN(numericProjectId)) {
      console.error("Invalid Project ID format:", projectId);
      return res.status(400).json({
        success: false,
        error: "Invalid Project ID",
        code: 400,
        message: "Project ID must be a number",
      });
    }

    console.log("Processing project ID:", numericProjectId);

    // Fetch the dashboard data from a service
    const dashboardService = container.DashboardService;
    const data = await dashboardService.getDashboardData(numericProjectId);

    return res.status(200).json({
      success: true,
      code: 200,
      data,
    });
  } catch (error: any) {
    console.error("API Error:", error);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        code: 404,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      code: 500,
      message: error.message || "An unexpected error occurred",
    });
  }
}
