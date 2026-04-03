"use server";

import { revalidatePath } from "next/cache";

import {
  defaultCategoryColor,
  iconOptionValues,
  normalizeThemeColor,
  slugifyCategoryName,
} from "./catalog-data";
import { prisma } from "./prisma";

function getStringValue(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

function getRequiredValue(formData: FormData, key: string) {
  const value = getStringValue(formData, key);

  if (!value) {
    throw new Error(`Missing field: ${key}`);
  }

  return value;
}

function getIntValue(formData: FormData, key: string, fallback = 1) {
  const raw = getStringValue(formData, key);
  const parsed = Number.parseInt(raw, 10);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return parsed;
}

function getPriceCents(formData: FormData, key: string) {
  const raw = getRequiredValue(formData, key);
  const parsed = Number.parseFloat(raw);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`Invalid price: ${key}`);
  }

  return Math.round(parsed * 100);
}

async function createUniqueSlug(name: string) {
  const baseSlug = slugifyCategoryName(name);
  let candidate = baseSlug;
  let suffix = 2;

  while (await prisma.category.findUnique({ where: { slug: candidate } })) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export async function createCategoryAction(formData: FormData) {
  const name = getRequiredValue(formData, "name");
  const iconInput = getStringValue(formData, "icon");
  const sortOrder = getIntValue(formData, "sortOrder");
  const themeColor =
    getStringValue(formData, "themeColor") || defaultCategoryColor;
  const icon = iconOptionValues.includes(iconInput as (typeof iconOptionValues)[number])
    ? iconInput
    : "Sparkles";
  const slug = await createUniqueSlug(name);

  await prisma.category.create({
    data: {
      name,
      slug,
      icon,
      sortOrder,
      themeColor: normalizeThemeColor(themeColor),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteCategoryAction(formData: FormData) {
  const id = getRequiredValue(formData, "id");

  await prisma.category.delete({
    where: {
      id,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createProductAction(formData: FormData) {
  const categoryId = getRequiredValue(formData, "categoryId");
  const name = getRequiredValue(formData, "name");
  const description = getRequiredValue(formData, "description");
  const priceCents = getPriceCents(formData, "price");
  const sortOrder = getIntValue(formData, "sortOrder");
  const imageUrl = getStringValue(formData, "imageUrl");
  const badge = getStringValue(formData, "badge");
  const isAvailable = formData.get("isAvailable") === "on";

  await prisma.product.create({
    data: {
      categoryId,
      name,
      description,
      priceCents,
      sortOrder,
      imageUrl: imageUrl || null,
      badge: badge || null,
      isAvailable,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteProductAction(formData: FormData) {
  const id = getRequiredValue(formData, "id");

  await prisma.product.delete({
    where: {
      id,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}
