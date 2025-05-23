import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const taskService = container.TaskService;
  try {
    switch (req.method) {
      case "GET": {
        const tasks = await taskService.getAllTasks(req.query);
        return res.status(200).json(tasks);
      }
      case "POST": {
        const task = await taskService.createTask(req.body);
        return res.status(200).json({
          message: "Task Created Successfully",
          code: 200,
          data: task,
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
