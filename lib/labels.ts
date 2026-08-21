import type { PostType, Region } from "@/types/database";

export const TYPE_LABELS: Record<PostType, string> = {
  nature: "Nature",
  recette: "Recette",
  lieu: "Lieu",
};

export const TYPE_LABELS_EN: Record<PostType, string> = {
  nature: "Nature",
  recette: "Recipe",
  lieu: "Place",
};

export const REGION_LABELS: Record<Region, string> = {
  est: "Est",
  ouest: "Ouest",
  centre: "Centre",
  sud: "Sud",
};

export const REGION_LABELS_EN: Record<Region, string> = {
  est: "East",
  ouest: "West",
  centre: "Center",
  sud: "South",
};

export const REGIONS: Region[] = ["est", "ouest", "centre", "sud"];

/** Libellés de région selon la langue courante (fr par défaut). */
export function getRegionLabels(locale: string): Record<Region, string> {
  return locale === "en" ? REGION_LABELS_EN : REGION_LABELS;
}

/** Libellés de type de publication selon la langue courante (fr par défaut). */
export function getTypeLabels(locale: string): Record<PostType, string> {
  return locale === "en" ? TYPE_LABELS_EN : TYPE_LABELS;
}
