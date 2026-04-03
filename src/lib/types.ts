export type MenuProduct = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string | null;
  badge: string | null;
  isAvailable: boolean;
  sortOrder: number;
};

export type MenuCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  themeColor: string;
  sortOrder: number;
  products: MenuProduct[];
};

export type AdminCategory = MenuCategory & {
  _count: {
    products: number;
  };
};
