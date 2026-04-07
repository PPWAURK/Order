import "server-only";

import { Prisma, type PrismaClient } from "@prisma/client";

const DEFAULT_BUDGET_SETTINGS_ID = "default";

type BudgetDbClient = PrismaClient | Prisma.TransactionClient;

function padMonth(value: number) {
  return value.toString().padStart(2, "0");
}

export function getCurrentMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${padMonth(date.getMonth() + 1)}`;
}

function addMonthKey(monthKey: string, offset: number) {
  const [year, month] = monthKey.split("-").map(Number);
  const nextDate = new Date(year, month - 1 + offset, 1);

  return getCurrentMonthKey(nextDate);
}

function buildMissingMonthKeys(lastMonthKey: string, currentMonthKey: string) {
  const monthKeys: string[] = [];
  let nextMonthKey = lastMonthKey;

  while (nextMonthKey < currentMonthKey) {
    nextMonthKey = addMonthKey(nextMonthKey, 1);
    monthKeys.push(nextMonthKey);
  }

  return monthKeys;
}

export function formatBudgetMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);

  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
}

export async function getOrCreateBudgetSettings(db: BudgetDbClient) {
  return db.budgetSettings.upsert({
    where: { id: DEFAULT_BUDGET_SETTINGS_ID },
    update: {},
    create: { id: DEFAULT_BUDGET_SETTINGS_ID },
  });
}

export async function syncBudgetAllocations(db: BudgetDbClient) {
  const settings = await getOrCreateBudgetSettings(db);
  const currentMonthKey = getCurrentMonthKey();
  const latestAllocation = await db.budgetAllocation.findFirst({
    orderBy: { monthKey: "desc" },
  });

  if (!latestAllocation) {
    await db.budgetAllocation.create({
      data: {
        monthKey: currentMonthKey,
        amountCents: settings.monthlyBudgetCents,
      },
    });

    return { settings, currentMonthKey };
  }

  if (latestAllocation.monthKey < currentMonthKey) {
    const missingMonthKeys = buildMissingMonthKeys(latestAllocation.monthKey, currentMonthKey);

    if (missingMonthKeys.length > 0) {
      await db.budgetAllocation.createMany({
        data: missingMonthKeys.map((monthKey) => ({
          monthKey,
          amountCents: settings.monthlyBudgetCents,
        })),
      });
    }
  }

  return { settings, currentMonthKey };
}

export async function getBudgetSummary(db: BudgetDbClient) {
  const { settings, currentMonthKey } = await syncBudgetAllocations(db);
  const [allocationTotals, orderTotals, currentMonthAllocation, currentMonthOrders] =
    await Promise.all([
      db.budgetAllocation.aggregate({
        _sum: { amountCents: true },
      }),
      db.orderRecord.aggregate({
        _sum: { totalCents: true },
      }),
      db.budgetAllocation.findUnique({
        where: { monthKey: currentMonthKey },
      }),
      db.orderRecord.aggregate({
        _sum: { totalCents: true },
        where: {
          createdAt: {
            gte: new Date(`${currentMonthKey}-01T00:00:00`),
            lt: new Date(`${addMonthKey(currentMonthKey, 1)}-01T00:00:00`),
          },
        },
      }),
    ]);

  const totalAllocatedCents = allocationTotals._sum.amountCents ?? 0;
  const totalSpentCents = orderTotals._sum.totalCents ?? 0;
  const availableBudgetCents = totalAllocatedCents - totalSpentCents;
  const currentMonthBudgetCents =
    currentMonthAllocation?.amountCents ?? settings.monthlyBudgetCents;

  return {
    availableBudgetCents,
    carryoverCents: Math.max(availableBudgetCents - currentMonthBudgetCents, 0),
    currentMonthBudgetCents,
    currentMonthLabel: formatBudgetMonthLabel(currentMonthKey),
    currentMonthSpentCents: currentMonthOrders._sum.totalCents ?? 0,
    monthlyBudgetCents: settings.monthlyBudgetCents,
  };
}

export async function updateMonthlyBudget(db: BudgetDbClient, monthlyBudgetCents: number) {
  const { currentMonthKey } = await syncBudgetAllocations(db);

  await db.budgetSettings.update({
    where: { id: DEFAULT_BUDGET_SETTINGS_ID },
    data: { monthlyBudgetCents },
  });

  await db.budgetAllocation.upsert({
    where: { monthKey: currentMonthKey },
    update: { amountCents: monthlyBudgetCents },
    create: {
      monthKey: currentMonthKey,
      amountCents: monthlyBudgetCents,
    },
  });
}

export async function placeOrderWithBudget(db: BudgetDbClient, totalCents: number) {
  if (!Number.isFinite(totalCents) || totalCents <= 0) {
    throw new Error("Montant de commande invalide.");
  }

  await syncBudgetAllocations(db);

  const [allocationTotals, orderTotals] = await Promise.all([
    db.budgetAllocation.aggregate({
      _sum: { amountCents: true },
    }),
    db.orderRecord.aggregate({
      _sum: { totalCents: true },
    }),
  ]);

  const availableBudgetCents =
    (allocationTotals._sum.amountCents ?? 0) - (orderTotals._sum.totalCents ?? 0);

  if (totalCents > availableBudgetCents) {
    throw new Error("Budget insuffisant pour confirmer cette commande.");
  }

  await db.orderRecord.create({
    data: { totalCents },
  });

  return availableBudgetCents - totalCents;
}
