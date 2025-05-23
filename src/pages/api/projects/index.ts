import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const projectService = container.ProjectService;
  try {
    switch (req.method) {
      case "GET": {
        const projects = await projectService.getAllProjects(req.query);
        return res.status(200).json(projects);
      }
      case "POST": {
        if (req.body.endDate && typeof req.body.endDate === "string") {
          req.body.endDate = new Date(req.body.endDate);
        }

        // Remove the conditional - always use createProjectWithResponsible
        // but it will now handle cases where responsible isn't provided
        const project = await projectService.createProjectWithResponsible(
          req.body
        );
        return res.status(200).json({
          message: "Project Created Successfully",
          code: 200,
          data: project,
        });
      }
      default:
        return res.status(405).json({ error: "Method Not Allowed", code: 405 });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", code: 500, details: error });
  }
}
