import type { ComponentType } from "react";
import {
  BuildingIcon,
  CompassIcon,
  LandmarkIcon,
  MountainIcon,
  SunIcon,
} from "@/components/icons";

export type TravelStyleMeta = {
  icon: ComponentType<{ className?: string }>;
  badgeClass: string;
  iconClass: string;
  barClass: string;
};

const STYLE_META: Record<string, TravelStyleMeta> = {
  beach: {
    icon: SunIcon,
    badgeClass: "bg-amber-50 text-amber-900",
    iconClass: "text-amber-500",
    barClass: "from-amber-400 to-amber-500",
  },
  city: {
    icon: BuildingIcon,
    badgeClass: "bg-orange-50 text-orange-900",
    iconClass: "text-orange-500",
    barClass: "from-orange-400 to-orange-500",
  },
  mountain: {
    icon: MountainIcon,
    badgeClass: "bg-teal-50 text-teal-900",
    iconClass: "text-teal-600",
    barClass: "from-teal-600 to-teal-700",
  },
  culture: {
    icon: LandmarkIcon,
    badgeClass: "bg-rose-50 text-rose-900",
    iconClass: "text-rose-500",
    barClass: "from-rose-400 to-rose-500",
  },
  road: {
    icon: CompassIcon,
    badgeClass: "bg-yellow-50 text-yellow-900",
    iconClass: "text-yellow-500",
    barClass: "from-yellow-400 to-yellow-500",
  },
  adventure: {
    icon: CompassIcon,
    badgeClass: "bg-orange-50 text-orange-900",
    iconClass: "text-orange-600",
    barClass: "from-orange-500 to-rose-500",
  },
};

const DEFAULT_META: TravelStyleMeta = {
  icon: CompassIcon,
  badgeClass: "bg-teal-50 text-teal-900",
  iconClass: "text-teal-600",
  barClass: "from-teal-600 to-teal-700",
};

export function getTravelStyleMeta(style: string): TravelStyleMeta {
  const key = style.toLowerCase();
  const match = Object.entries(STYLE_META).find(([token]) =>
    key.includes(token),
  );
  return match ? match[1] : DEFAULT_META;
}
