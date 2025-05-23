import { BaseRepository } from "@/lib/prisma/repositories/prisma-abstract-repository";
import { Project } from "@/types/project";
import { PrismaClient } from "@prisma/client";

export class ProjectRepository extends BaseRepository<Project> {
  [x: string]: any;
  constructor(prisma: PrismaClient) {
    super(prisma.project, prisma);
  }
  
}