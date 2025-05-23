import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const entrepriseService = container.EntrepriseService;
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid ID", code: 400 });
  }

  try {
    switch (req.method) {
      case "GET": {
        const entreprise = await entrepriseService.getEntrepriseById(
          Number(id)
        );
        if (!entreprise) {
          return res
            .status(404)
            .json({ error: "Entreprise Not Found", code: 404 });
        }
        return res.status(200).json(entreprise);
      }
      case "PUT": {
        const updatedEntreprise = await entrepriseService.updateEntreprise(
          Number(id),
          req.body
        );
        return res.status(200).json({
          message: "Entreprise Updated Successfully",
          code: 200,
          data: updatedEntreprise,
        });
      }
      case "DELETE": {
        await entrepriseService.deleteEntreprise(Number(id));
        return res.status(200).json({
          message: "Entreprise Deleted Successfully",
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
