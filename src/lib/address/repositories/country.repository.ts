import { BaseRepository } from "@/lib/prisma/repositories/prisma-abstract-repository";
import { Country } from "@/types";
import { PrismaClient } from "@prisma/client";

export class CountryRepository extends BaseRepository<Country> {
  constructor(prisma: PrismaClient) {
    super(prisma.country, prisma);
  }
}
