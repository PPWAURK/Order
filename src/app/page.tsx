import { MenuExperience } from "@/components/menu-experience";
import { getBudgetOverview, getMenuCatalog } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, budget] = await Promise.all([getMenuCatalog(), getBudgetOverview()]);

  return <MenuExperience budget={budget} categories={categories} />;
}
