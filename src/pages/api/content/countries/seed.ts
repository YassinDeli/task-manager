import { seedCountries } from "@/lib/address/seeder/country.seeder";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed", code: 405 });
  }

  try {
    await seedCountries();
    return res
      .status(200)
      .json({ message: "Countries Seeded Successfully", code: 200 });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", code: 500, details: error });
  }
}
