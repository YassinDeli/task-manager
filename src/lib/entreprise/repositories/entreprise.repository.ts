import { BaseRepository } from "@/lib/prisma/repositories/prisma-abstract-repository";
import { Entreprise } from "@/types";
import { PrismaClient } from "@prisma/client";

export class EntrepriseRepository extends BaseRepository<Entreprise> {
  constructor(prisma: PrismaClient) {
    super(prisma.entreprise, prisma);
  }
}
