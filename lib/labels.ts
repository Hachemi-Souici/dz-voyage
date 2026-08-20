import type { PostType, Region } from "@/types/database";

export const TYPE_LABELS: Record<PostType, string> = {
  nature: "Nature",
  recette: "Recette",
  lieu: "Lieu",
};

export const REGION_LABELS: Record<Region, string> = {
  est: "Est",
  ouest: "Ouest",
  centre: "Centre",
  sud: "Sud",
};

export const REGIONS: Region[] = ["est", "ouest", "centre", "sud"];
