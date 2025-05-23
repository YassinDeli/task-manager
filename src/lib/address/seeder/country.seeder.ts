import { PrismaClient } from "@prisma/client";
import { countries } from "../data/country.data";
import container from "@/lib/container";

export async function seedCountries() {
  const prisma = new PrismaClient();

  const appMetadataService = container.SeederService;

  try {
    const upsertPromises = countries.map((country) =>
      prisma.country.upsert({
        where: { alpha2code: country.alpha2code },
        update: {},
        create: {
          alpha2code: country.alpha2code || null,
          alpha3code: country.alpha3code || null,
        },
      })
    );
    await Promise.all(upsertPromises);
    await appMetadataService.confirmSeederObject("countries");
  } catch (error) {
    console.error("Error seeding permissions:", error);
  } finally {
    await prisma.$disconnect();
  }
}
