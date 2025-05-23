// src/pages/api/dashboard/general.ts
import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const generalDashboardService = container.GeneralDashboardService;

  try {
    switch (req.method) {
      case "GET": {
        const dashboardData =
          await generalDashboardService.getGeneralDashboardData();
        return res.status(200).json({
          message: "General dashboard data retrieved successfully",
          code: 200,
          data: dashboardData,
        });
      }
      default:
        return res.status(405).json({
          error: "Method Not Allowed",
          code: 405,
        });
    }
  } catch (error) {
    console.error("[GENERAL_DASHBOARD_ERROR]", error);
    return res.status(500).json({
      error: "Internal Server Error",
      code: 500,
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
