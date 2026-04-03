import {
  CakeSlice,
  Candy,
  Cookie,
  CupSoda,
  IceCreamCone,
  Popcorn,
  Sparkles,
  UtensilsCrossed,
  type LucideProps,
} from "lucide-react";

import { iconOptionValues } from "./catalog-data";

const iconMap = {
  CakeSlice,
  Candy,
  Cookie,
  CupSoda,
  IceCreamCone,
  Popcorn,
  Sparkles,
  UtensilsCrossed,
} as const;

type IconName = (typeof iconOptionValues)[number];

type CategoryIconProps = LucideProps & {
  icon: string;
};

export function CategoryIcon({ icon, ...props }: CategoryIconProps) {
  const Icon = iconMap[icon as IconName] ?? Sparkles;
  return <Icon {...props} />;
}
