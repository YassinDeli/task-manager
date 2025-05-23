import { BaseRepository } from "@/lib/prisma/repositories/prisma-abstract-repository";
import { Employee } from "@/types";
import { PrismaClient } from "@prisma/client";

export class EmployeeRepository extends BaseRepository<Employee> {
  constructor(prisma: PrismaClient) {
    super(prisma.employee, prisma);
  }
}
