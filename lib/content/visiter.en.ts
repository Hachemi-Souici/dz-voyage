// English translation of the "places to visit" page content — mirrors
// visiter.ts (fr) faithfully.
import type { Region } from "@/types/database";

export const chapo =
  "Ancient sites, Saharan ksour, coastal towns and Berber mountains: an overview of each region's highlights, the festivals that punctuate the year, and the music that accompanies them.";

export const regions: { region: Region; titre: string; texte: string }[] = [
  {
    region: "est",
    titre: "East",
    texte:
      "Constantine, the \"city of suspended bridges,\" overlooks its spectacular gorges. Annaba preserves the Saint Augustine basilica and the ruins of Hippo. The Roman sites of Timgad and Djemila, UNESCO World Heritage sites, are among the best-preserved in the Mediterranean basin.",
  },
  {
    region: "ouest",
    titre: "West",
    texte:
      "Tlemcen, former Zayyanid capital, brings together the Great Mosque and the site of Mansourah. Oran mixes Spanish facades, the Santa Cruz fort and a very lively cultural scene. The Mostaganem coast completes this coastal ensemble.",
  },
  {
    region: "centre",
    titre: "Center",
    texte:
      "Algiers the White: the Casbah (UNESCO), the Jardin d'Essai, the Notre-Dame d'Afrique basilica. Nearby, the Roman ruins of Tipasa (UNESCO) overlook the Mediterranean. In Kabylia, the Djurdjura massif and Tikjda offer hiking and mountains.",
  },
  {
    region: "sud",
    titre: "South",
    texte:
      "The Hoggar and the Tassili n'Ajjer (UNESCO) hold one of the largest collections of prehistoric rock art in the world. The M'zab valley, around Ghardaïa (UNESCO), showcases a unique ksour architecture. Timimoun and Djanet round out the Saharan must-sees.",
  },
];

export const musique = {
  titre: "Musical culture",
  texte:
    "Algerian music reflects the same regional diversity as its cuisine: chaâbi, born in the Casbah of Algiers (carried by figures such as El Hadj M'Hamed El Anka); raï, originating from Oran and now known internationally; malouf from Constantine, Arab-Andalusian music; Kabyle music, carried by artists such as Idir or Lounis Aït Menguellet; and diwan, spiritual music of the South with sub-Saharan roots.",
};
