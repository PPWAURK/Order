import { MenuExperience } from "@/components/menu-experience";
import { getMenuCatalog } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const categories = await getMenuCatalog();

  return <MenuExperience categories={categories} />;
}
