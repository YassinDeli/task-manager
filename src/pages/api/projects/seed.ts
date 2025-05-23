import { seedProjects } from "@/lib/projects/seeders/project.seeder";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await seedProjects();
    return res.status(200).json({ message: "Projects seeded successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error });
  }
}
