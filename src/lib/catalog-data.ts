export const brandName = "Charene 的专属菜单";

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
    name: "奶茶",
    slug: "milktea",
    icon: "CupSoda",
    themeColor: "#E9B98C",
    sortOrder: 1,
    products: [
      {
        name: "云朵珍珠奶茶",
        description: "红茶底配厚乳奶盖，珍珠软糯，入口像焦糖云朵。",
        priceCents: 1800,
        imageUrl:
          "https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=1200&q=80",
        badge: "招牌",
        sortOrder: 1,
      },
      {
        name: "草莓啵啵鲜奶",
        description: "新鲜草莓酱和小圆啵啵一起搅进牛乳里，酸甜很轻盈。",
        priceCents: 2000,
        imageUrl:
          "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=1200&q=80",
        badge: "女生最爱",
        sortOrder: 2,
      },
      {
        name: "抹茶团子奶绿",
        description: "抹茶清香里带一点焙火感，搭配糯叽叽白玉团子。",
        priceCents: 2200,
        badge: "新品",
        sortOrder: 3,
      },
    ],
  },
  {
    name: "零食",
    slug: "snacks",
    icon: "Popcorn",
    themeColor: "#F3A7A5",
    sortOrder: 2,
    products: [
      {
        name: "焦糖爆米花桶",
        description: "粒粒裹着琥珀色焦糖壳，酥脆里有奶油香。",
        priceCents: 1500,
        imageUrl:
          "https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&w=1200&q=80",
        badge: "追剧搭子",
        sortOrder: 1,
      },
      {
        name: "海盐脆薯角",
        description: "刚炸好的薯角撒上海盐和香草碎，越吃越停不下。",
        priceCents: 1600,
        imageUrl:
          "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=1200&q=80",
        sortOrder: 2,
      },
      {
        name: "芝士玉米杯",
        description: "热乎玉米粒拌芝士酱，咸甜平衡，适合边逛边吃。",
        priceCents: 1400,
        badge: "人气",
        sortOrder: 3,
      },
    ],
  },
  {
    name: "主食",
    slug: "mains",
    icon: "UtensilsCrossed",
    themeColor: "#B6D89E",
    sortOrder: 3,
    products: [
      {
        name: "嫩煎鸡排饭",
        description: "鸡排外脆内嫩，搭配奶油玉米和半熟蛋，饱腹又治愈。",
        priceCents: 3200,
        imageUrl:
          "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
        badge: "饱饱系列",
        sortOrder: 1,
      },
      {
        name: "奶油蘑菇意面",
        description: "白酱顺滑，蘑菇和培根香气很足，适合慢慢吃。",
        priceCents: 3000,
        imageUrl:
          "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80",
        sortOrder: 2,
      },
      {
        name: "照烧饭团拼盘",
        description: "迷你饭团配照烧鸡腿和脆口生菜，一盘刚刚好。",
        priceCents: 2800,
        badge: "轻食",
        sortOrder: 3,
      },
    ],
  },
  {
    name: "甜品",
    slug: "desserts",
    icon: "CakeSlice",
    themeColor: "#F7C9D7",
    sortOrder: 4,
    products: [
      {
        name: "草莓奶霜松饼",
        description: "松饼热热的，奶霜软软的，再铺一层草莓碎。",
        priceCents: 2400,
        imageUrl:
          "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1200&q=80",
        badge: "限定",
        sortOrder: 1,
      },
      {
        name: "焦糖布丁杯",
        description: "布丁口感细腻，顶层焦糖微苦，甜得很有层次。",
        priceCents: 1600,
        sortOrder: 2,
      },
      {
        name: "蜜桃雪顶可丽饼",
        description: "蜜桃果肉、轻奶油和薄脆可丽饼卷在一起，清爽不腻。",
        priceCents: 2200,
        imageUrl:
          "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
        sortOrder: 3,
      },
    ],
  },
  {
    name: "互动",
    slug: "interactive",
    icon: "Sparkles",
    themeColor: "#8FD9D3",
    sortOrder: 5,
    products: [
      {
        name: "神秘盲盒饮品",
        description: "今天会拿到哪一杯交给好运决定，适合喜欢惊喜的人。",
        priceCents: 2100,
        badge: "随机",
        sortOrder: 1,
      },
      {
        name: "心情贴纸包",
        description: "点单时可获得一份心情贴纸，适合和朋友交换。",
        priceCents: 900,
        badge: "互动",
        sortOrder: 2,
      },
      {
        name: "店员推荐签",
        description: "让店员帮你随机挑一份今日推荐，像抽到一张小纸签。",
        priceCents: 1200,
        sortOrder: 3,
      },
    ],
  },
];

export function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
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
      eyebrow: "现泡慢摇",
      description: "甜度轻一点，口感圆一点，是这一区的主旋律。",
      detail: "从奶香到茶香都做得柔和，适合当作今天的第一杯。",
    },
    snacks: {
      eyebrow: "边逛边吃",
      description: "酥脆和咸香负责撑起聊天、追剧和小聚的氛围。",
      detail: "这一栏都是上手快、分享感强的小食。",
    },
    mains: {
      eyebrow: "认真饱腹",
      description: "想吃得更满足，就从这里挑一份热腾腾的主食。",
      detail: "分量更稳，适合午餐和需要补充元气的时候。",
    },
    desserts: {
      eyebrow: "甜口收尾",
      description: "奶油、水果和轻甜口感在这里排队等你。",
      detail: "偏轻盈、不厚重，很适合搭配饮品一起点。",
    },
    interactive: {
      eyebrow: "带点惊喜",
      description: "把随机感也做成菜单的一部分，给点单多一点乐趣。",
      detail: "适合和朋友一起玩，或者给自己一点临时起意。",
    },
  };

  return (
    stories[slug] ?? {
      eyebrow: "今日新系列",
      description: `${name} 已经加入今日菜单，可以继续在后台补充更多商品。`,
      detail: "这个系列会自动跟随后台配置出现在菜单里。",
    }
  );
}
