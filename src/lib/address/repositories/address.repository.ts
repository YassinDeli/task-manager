import { BaseRepository } from "@/lib/prisma/repositories/prisma-abstract-repository";
import { Address } from "@/types";
import { PrismaClient } from "@prisma/client";

export class AddressRepository extends BaseRepository<Address> {
  constructor(prisma: PrismaClient) {
    super(prisma.address, prisma);
  }
}
