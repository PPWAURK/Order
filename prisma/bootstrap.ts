import { PrismaClient } from "@prisma/client";

import { ensureDatabase } from "./ensure-database";

const prisma = new PrismaClient();

async function main() {
  await ensureDatabase(prisma);
}

main()
  .catch((error) => {
    console.error("Database bootstrap failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
