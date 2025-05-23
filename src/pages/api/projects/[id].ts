import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const projectService = container.ProjectService;
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid ID", code: 400 });
  }

  try {
    switch (req.method) {
      case "GET": {
        const project = await projectService.getProjectById(
          Number(id)
        );
        if (!project) {
          return res
            .status(404)
            .json({ error: "Project Not Found", code: 404 });
        }
        return res.status(200).json(project);
      }
      case "PUT": {
        const updatedProject = await projectService.updateProject(
          Number(id),
          req.body
        );
        return res.status(200).json({
          message: "Project Updated Successfully",
          code: 200,
          data: updatedProject,
        });
      }
      case "DELETE": {
        await projectService.deleteProject(Number(id));
        return res.status(200).json({
          message: "Project Deleted Successfully",
          code: 200,
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
