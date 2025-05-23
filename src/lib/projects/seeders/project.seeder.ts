import { PrismaClient } from "@prisma/client";
import {  ProjectStatus, Priority } from "@/types/project";
import { projects } from "../data/project.data";

export async function seedProjects() {
  const prisma = new PrismaClient();

  try {
    const upsertPromises = projects.map((project) =>
      prisma.project.upsert({
        where: { id: project.id },
        update: {
          name: project.name,
          description: project.description,
          startDate: project.startDate,
          endDate: project.endDate,
          status: project.status as ProjectStatus,
          priority: project.priority as Priority,
          responsibleId: project.responsibleId ?? null,
        },
        create: {
          id: project.id,
          name: project.name,
          description: project.description,
          startDate: project.startDate,
          endDate: project.endDate,
          status: project.status as ProjectStatus,
          priority: project.priority as Priority,
          responsibleId: project.responsibleId ?? null,
        },
      })
    );

    await Promise.all(upsertPromises);
    console.log("✅ Projects seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding projects:", error);
  } finally {
    await prisma.$disconnect();
  }
}
