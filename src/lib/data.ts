import "server-only";

import { cache } from "react";

import { prisma } from "./prisma";
import type { AdminCategory, MenuCategory } from "./types";

export const getMenuCatalog = cache(async (): Promise<MenuCategory[]> => {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: {
      products: {
        where: {
          isAvailable: true,
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  return categories.filter((category) => category.products.length > 0);
});

export const getAdminCatalog = cache(async (): Promise<AdminCategory[]> => {
  return prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: {
      products: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
});
