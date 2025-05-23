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
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res
        .status(400)
        .json({ error: "Username or E-mail and password are required" });
    }

    const data = await authService.connect({ usernameOrEmail, password });

    res.status(200).json({ message: "Connection successful", code: 200, data });
  } catch (error: any) {
    res.status(401).json({ error: error.message, code: 401 });
  }
}
