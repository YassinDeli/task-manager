import { seedTasks } from "@/lib/tasks/seeders/task.seeder";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await seedTasks();
    return res.status(200).json({ message: "Tasks seeded successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error });
  }
}
