import "server-only";

import { cache } from "react";

import { getBudgetSummary } from "./budget";
import { prisma } from "./prisma";
import type { AdminCategory, BudgetSummary, MenuCategory } from "./types";

export const getMenuCatalog = cache(async (): Promise<MenuCategory[]> => {
  const categories: MenuCategory[] = await prisma.category.findMany({
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
  const categories: AdminCategory[] = await prisma.category.findMany({
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

  return categories;
});

export const getBudgetOverview = cache(async (): Promise<BudgetSummary> => {
  return getBudgetSummary(prisma);
});
