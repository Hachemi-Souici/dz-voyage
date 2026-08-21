// English translation of the cuisine page content — mirrors cuisine.ts
// (fr) faithfully.
import type { Region } from "@/types/database";

export const chapo =
  "Four regions, four cuisines. Couscous is prepared differently from Algiers to Tlemcen, pastry names change from one city to the next, and the Sahara cooks with sand and dates. Explore traditional dishes and cakes region by region.";

export const regions: { region: Region; titre: string; texte: string }[] = [
  {
    region: "est",
    titre: "East",
    texte:
      "The cuisine of the East, around Constantine and Annaba, is known for its bold flavors and slow-simmered dishes: chorba frik (cracked-wheat soup), doubara (chickpea soup), mhadjeb (semolina-stuffed flatbread), and tajine zitoune (olive tajine). For sweets, Constantine's makroudh and its honey variants are iconic.",
  },
  {
    region: "ouest",
    titre: "West",
    texte:
      "In Tlemcen and Oran, an Andalusian-Ottoman heritage has shaped a refined cuisine, historically associated with major celebrations and weddings: couscous tlemcani, mderbel (stuffed vine leaves or vegetables), karantita (Oran-style chickpea pancake). In pastry, the region is known for the delicacy of its almond cakes.",
  },
  {
    region: "centre",
    titre: "Center",
    texte:
      "Algiers and Kabylia blend Turkish influences with Berber traditions: chakhchoukha, rechta (fine noodles with chicken), couscous with fresh broad beans, and in Kabylia a more rustic cuisine built on olive oil, figs and farm-churned butter (smen). Pastries of Ottoman inspiration (baklawa, kalb el louz) are especially present in the capital.",
  },
  {
    region: "sud",
    titre: "South",
    texte:
      "In the Great Saharan South, cuisine adapts to the desert: taguella (bread baked under the sand), méchoui (whole grilled lamb), couscous with curdled milk (rayeb), and a Tuareg cuisine centered on dates, camel milk and local grains.",
  },
];

export const gateaux = {
  titre: "Traditional cakes (all regions)",
  texte:
    "Baklawa, makroudh, kalb el louz, griwech, tcharek, mbardja — Algerian pastry, often made with semolina, almonds and honey, is found throughout the country with local variations, especially during religious festivals and weddings.",
};
