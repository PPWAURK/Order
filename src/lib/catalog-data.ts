export const brandName = "Le menu de Charene";

export const defaultCategoryColor = "#F4BE92";

export const iconOptionValues = [
  "CupSoda",
  "Popcorn",
  "UtensilsCrossed",
  "CakeSlice",
  "Sparkles",
  "Candy",
  "IceCreamCone",
  "Cookie",
] as const;

type SeedProduct = {
  name: string;
  description: string;
  priceCents: number;
  imageUrl?: string | null;
  badge?: string | null;
  isAvailable?: boolean;
  sortOrder: number;
};

type SeedCategory = {
  name: string;
  slug: string;
  icon: (typeof iconOptionValues)[number];
  themeColor: string;
  sortOrder: number;
  products: SeedProduct[];
};

export const seedCatalog: SeedCategory[] = [
  {
    name: "Thes au lait",
    slug: "milktea",
    icon: "CupSoda",
    themeColor: "#E9B98C",
    sortOrder: 1,
    products: [
      {
        name: "The au lait nuage perle",
        description: "Base de the noir, creme mousseuse et perles moelleuses avec une finale caramel.",
        priceCents: 1800,
        imageUrl:
          "https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=1200&q=80",
        badge: "Signature",
        sortOrder: 1,
      },
      {
        name: "Lait fraise pop",
        description: "Confiture de fraise fraiche, billes pop et lait doux pour une note legere et acidulee.",
        priceCents: 2000,
        imageUrl:
          "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=1200&q=80",
        badge: "Coup de coeur",
        sortOrder: 2,
      },
      {
        name: "Matcha latte aux dango",
        description: "Un matcha legerement torrefie avec des dango moelleux pour une texture reconfortante.",
        priceCents: 2200,
        badge: "Nouveau",
        sortOrder: 3,
      },
    ],
  },
  {
    name: "Snacks",
    slug: "snacks",
    icon: "Popcorn",
    themeColor: "#F3A7A5",
    sortOrder: 2,
    products: [
      {
        name: "Pop-corn caramel",
        description: "Chaque grain est enrobe d'un caramel dore avec une note beurre bien croustillante.",
        priceCents: 1500,
        imageUrl:
          "https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&w=1200&q=80",
        badge: "Soiree film",
        sortOrder: 1,
      },
      {
        name: "Potatoes fleur de sel",
        description: "Des quartiers de pomme de terre croustillants, releves de fleur de sel et d'herbes.",
        priceCents: 1600,
        imageUrl:
          "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=1200&q=80",
        sortOrder: 2,
      },
      {
        name: "Mais chaud au fromage",
        description: "Du mais chaud melange a une sauce fromage pour un snack sale-sucre tres facile a partager.",
        priceCents: 1400,
        badge: "Populaire",
        sortOrder: 3,
      },
    ],
  },
  {
    name: "Plats",
    slug: "mains",
    icon: "UtensilsCrossed",
    themeColor: "#B6D89E",
    sortOrder: 3,
    products: [
      {
        name: "Riz au poulet grille",
        description: "Poulet dore a l'exterieur, tendre a coeur, servi avec mais cremeux et oeuf mollet.",
        priceCents: 3200,
        imageUrl:
          "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
        badge: "Copieux",
        sortOrder: 1,
      },
      {
        name: "Pates creme champignons",
        description: "Une sauce blanche onctueuse, des champignons et une touche fumee pour un plat a savourer doucement.",
        priceCents: 3000,
        imageUrl:
          "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80",
        sortOrder: 2,
      },
      {
        name: "Assiette d'onigiri teriyaki",
        description: "Petits onigiri, poulet teriyaki et salade croquante dans une assiette legerement rassasiante.",
        priceCents: 2800,
        badge: "Leger",
        sortOrder: 3,
      },
    ],
  },
  {
    name: "Desserts",
    slug: "desserts",
    icon: "CakeSlice",
    themeColor: "#F7C9D7",
    sortOrder: 4,
    products: [
      {
        name: "Pancakes fraise chantilly",
        description: "Des pancakes bien chauds, une creme fouettee legere et des fraises pour finir tout en douceur.",
        priceCents: 2400,
        imageUrl:
          "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1200&q=80",
        badge: "Edition limitee",
        sortOrder: 1,
      },
      {
        name: "Flan caramel",
        description: "Une creme fine et soyeuse, surmontee d'un caramel legerement amer pour plus de relief.",
        priceCents: 1600,
        sortOrder: 2,
      },
      {
        name: "Crepe peche neige",
        description: "De la peche, une creme legerement fouettee et une crepe crousti-fondante, sans lourdeur.",
        priceCents: 2200,
        imageUrl:
          "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
        sortOrder: 3,
      },
    ],
  },
  {
    name: "Surprises",
    slug: "interactive",
    icon: "Sparkles",
    themeColor: "#8FD9D3",
    sortOrder: 5,
    products: [
      {
        name: "Boisson mystere",
        description: "La boisson du jour est choisie par le hasard, parfaite pour celles et ceux qui aiment les surprises.",
        priceCents: 2100,
        badge: "Aleatoire",
        sortOrder: 1,
      },
      {
        name: "Pack de stickers humeur",
        description: "Un petit pack de stickers offert avec la commande, ideal pour echanger avec des amis.",
        priceCents: 900,
        badge: "Interactif",
        sortOrder: 2,
      },
      {
        name: "Carte conseil du comptoir",
        description: "Laissez l'equipe choisir une suggestion du jour, comme si vous tiriez un petit billet surprise.",
        priceCents: 1200,
        sortOrder: 3,
      },
    ],
  },
];

export function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(priceCents / 100);
}

export function slugifyCategoryName(name: string) {
  const normalized = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (normalized) {
    return normalized;
  }

  return `series-${Date.now().toString(36)}`;
}

export function normalizeThemeColor(color: string) {
  const normalized = color.trim();

  if (/^#[0-9a-fA-F]{6}$/.test(normalized)) {
    return normalized.toUpperCase();
  }

  return defaultCategoryColor;
}

export function hexToRgba(hex: string, alpha: number) {
  const safeHex = hex.replace("#", "");
  const red = Number.parseInt(safeHex.slice(0, 2), 16);
  const green = Number.parseInt(safeHex.slice(2, 4), 16);
  const blue = Number.parseInt(safeHex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function buildSoftGradient(hex: string) {
  return `linear-gradient(135deg, ${hexToRgba(hex, 0.92)} 0%, ${hexToRgba(
    hex,
    0.52,
  )} 42%, rgba(255, 249, 242, 0.94) 100%)`;
}

export function getCategoryStory(slug: string, name: string) {
  const stories: Record<
    string,
    {
      eyebrow: string;
      description: string;
      detail: string;
    }
  > = {
    milktea: {
      eyebrow: "Shaker minute",
      description: "Une zone douce et lactee, parfaite pour ouvrir la commande avec quelque chose de rond et leger.",
      detail: "Les notes de the et de lait restent souples, faciles a aimer des la premiere gorgée.",
    },
    snacks: {
      eyebrow: "A grignoter",
      description: "Du croustillant et du sale juste comme il faut pour accompagner une discussion, une serie ou une balade.",
      detail: "Tout ici se partage facilement et se mange du bout des doigts.",
    },
    mains: {
      eyebrow: "Bien rassasiant",
      description: "Quand il faut quelque chose de chaud et plus complet, c'est ici qu'il faut regarder.",
      detail: "Des portions plus stables, ideales pour le dejeuner ou un vrai regain d'energie.",
    },
    desserts: {
      eyebrow: "Finale sucree",
      description: "Creme, fruits et douceurs legeres se retrouvent ici pour terminer la commande en finesse.",
      detail: "Les textures restent legeres et accompagnent tres bien une boisson.",
    },
    interactive: {
      eyebrow: "Un peu de hasard",
      description: "Ici, la commande devient aussi un jeu avec une petite part d'imprevu.",
      detail: "Parfait a partager entre amis ou pour se laisser tenter sans trop reflechir.",
    },
  };

  return (
    stories[slug] ?? {
      eyebrow: "Nouvelle serie du jour",
      description: `${name} vient d'arriver sur la carte et peut encore recevoir d'autres produits depuis l'administration.`,
      detail: "Cette serie apparait automatiquement sur la carte publique des qu'elle est configuree.",
    }
  );
}
