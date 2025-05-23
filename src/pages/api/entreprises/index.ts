// pages/api/entreprise/index.ts
import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const entrepriseService = container.EntrepriseService;
  try {
    switch (req.method) {
      case "GET": {
        const entreprises = await entrepriseService.getAllEntreprises(
          req.query
        );
        return res.status(200).json(entreprises);
      }
      case "POST": {
        const entreprise =
          await entrepriseService.createEntrepriseWithResponsable(req.body);
        return res.status(200).json({
          message: "Entreprise Created Succssfully",
          code: 200,
          data: entreprise,
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
