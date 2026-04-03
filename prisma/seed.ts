import { PrismaClient } from "@prisma/client";

import { seedCatalog } from "../src/lib/catalog-data";
import { ensureDatabase } from "./ensure-database";

const prisma = new PrismaClient();

async function main() {
  await ensureDatabase(prisma);
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  for (const category of seedCatalog) {
    const { products, ...categoryData } = category;

    await prisma.category.create({
      data: {
        ...categoryData,
        products: {
          create: products,
        },
      },
    });
  }
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
