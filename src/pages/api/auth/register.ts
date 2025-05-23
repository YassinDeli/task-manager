import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authService = container.AuthService;
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed", code: 405 });
  }

  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ error: "All fields are required", code: 401 });
    }

    const data = await authService.register({ email, password, username });

    res
      .status(200)
      .json({ message: "User registered successfully", code: 200, data });
  } catch (error: any) {
    res.status(500).json({ error: error.message, code: 500 });
  }
}
