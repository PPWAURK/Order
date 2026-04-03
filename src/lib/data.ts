import "server-only";

import type { Prisma } from "@prisma/client";
import { cache } from "react";

import { prisma } from "./prisma";
import type { AdminCategory, MenuCategory } from "./types";

type MenuCategoryRecord = Prisma.CategoryGetPayload<{
  include: {
    products: {
      where: {
        isAvailable: true;
      };
    };
  };
}>;

type AdminCategoryRecord = Prisma.CategoryGetPayload<{
  include: {
    products: true;
    _count: {
      select: {
        products: true;
      };
    };
  };
}>;

export const getMenuCatalog = cache(async (): Promise<MenuCategory[]> => {
  const categories: MenuCategoryRecord[] = await prisma.category.findMany({
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

  return categories.filter(
    (category: MenuCategoryRecord) => category.products.length > 0,
  );
});

export const getAdminCatalog = cache(async (): Promise<AdminCategory[]> => {
  const categories: AdminCategoryRecord[] = await prisma.category.findMany({
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
