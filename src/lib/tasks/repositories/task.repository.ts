import { BaseRepository } from "@/lib/prisma/repositories/prisma-abstract-repository";
import { Task } from "@/types";
import { PrismaClient } from "@prisma/client";

export class TaskRepository extends BaseRepository<Task> {
  constructor(prisma: PrismaClient) {
    super(prisma.task, prisma);
  }
}