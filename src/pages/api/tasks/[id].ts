import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const taskService = container.TaskService;
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid ID", code: 400 });
  }

  try {
    switch (req.method) {
      case "GET": {
        const task = await taskService.getTaskById(
          Number(id)
        );
        if (!task) {
          return res
            .status(404)
            .json({ error: "Task Not Found", code: 404 });
        }
        return res.status(200).json(task);
      }
      case "PUT": {
        const updatedTask = await taskService.updateTask(
          Number(id),
          req.body
        );
        return res.status(200).json({
          message: "Task Updated Successfully",
          code: 200,
          data: updatedTask,
        });
      }
      case "DELETE": {
        await taskService.deleteTask(Number(id));
        return res.status(200).json({
          message: "Task Deleted Successfully",
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
