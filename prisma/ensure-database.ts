import type { PrismaClient } from "@prisma/client";

export async function ensureDatabase(prisma: PrismaClient) {
  await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON;`);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Category" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "icon" TEXT NOT NULL,
      "themeColor" TEXT NOT NULL,
      "sortOrder" INTEGER NOT NULL DEFAULT 1,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key"
    ON "Category"("slug");
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "Category_sortOrder_idx"
    ON "Category"("sortOrder");
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Product" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "categoryId" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "priceCents" INTEGER NOT NULL,
      "imageUrl" TEXT,
      "badge" TEXT,
      "isAvailable" BOOLEAN NOT NULL DEFAULT true,
      "sortOrder" INTEGER NOT NULL DEFAULT 1,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Product_categoryId_fkey"
        FOREIGN KEY ("categoryId")
        REFERENCES "Category" ("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "Product_categoryId_sortOrder_idx"
    ON "Product"("categoryId", "sortOrder");
  `);
}
