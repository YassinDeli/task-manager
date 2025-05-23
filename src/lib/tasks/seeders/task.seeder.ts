import { PrismaClient, Status, Priority } from "@prisma/client";
import { tasks } from "../data/task.data";

export async function seedTasks() {
  const prisma = new PrismaClient();

  try {
    const upsertPromises = tasks.map((task) =>
      prisma.task.upsert({
        where: { id: task.id },
        update: {
          title: task.title,
          description: task.description,
          status: task.status as Status,
          priority: task.priority as Priority,

          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          employeeId: task.employeeId ?? null,
          projectId: task.projectId ?? null,
          userId: task.userId ?? null,
        },
        create: {
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status as Status,
          priority: task.priority as Priority,

          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          employeeId: task.employeeId ?? null,
          projectId: task.projectId ?? null,
          userId: task.userId ?? null,
        },
      })
    );

    await Promise.all(upsertPromises);
    console.log("✅ Tasks seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding tasks:", error);
  } finally {
    await prisma.$disconnect();
  }
}
