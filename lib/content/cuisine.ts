// Textes de la page cuisine — brief Dz.Voyage §5. Ne pas reformuler,
// contenu validé.
import type { Region } from "@/types/database";

export const chapo =
  "Quatre régions, quatre cuisines. Le couscous se décline différemment d'Alger à Tlemcen, la pâtisserie change de nom d'une ville à l'autre, et le Sahara cuisine avec le sable et les dattes. Explorez les plats et les gâteaux traditionnels région par région.";

export const regions: { region: Region; titre: string; texte: string }[] = [
  {
    region: "est",
    titre: "Est",
    texte:
      "La cuisine de l'Est, autour de Constantine et Annaba, est réputée pour ses saveurs relevées et ses plats mijotés : la chorba frik (soupe à la semoule concassée), la doubara (soupe de pois chiches), le mhadjeb (galette farcie à la semoule), ou encore le tajine zitoune (tajine aux olives). Côté sucré, le makroudh de Constantine et ses variantes au miel sont emblématiques.",
  },
  {
    region: "ouest",
    titre: "Ouest",
    texte:
      "À Tlemcen et Oran, l'héritage andalou-ottoman a façonné une cuisine raffinée, historiquement associée aux grandes occasions et aux mariages : couscous tlemcani, mderbel (feuilles de vigne ou légumes farcis), karantita (galette de pois chiches à l'oranaise). En pâtisserie, la région est réputée pour la finesse de ses gâteaux aux amandes.",
  },
  {
    region: "centre",
    titre: "Centre",
    texte:
      "Alger et la Kabylie mêlent influences turques et traditions berbères : la chakhchoukha, la rechta (pâtes fines au poulet), le couscous aux fèves fraîches, et en Kabylie une cuisine plus rustique à l'huile d'olive, aux figues et au beurre fermier (smen). Les pâtisseries d'inspiration ottomane (baklawa, kalb el louz) sont particulièrement présentes dans la capitale.",
  },
  {
    region: "sud",
    titre: "Sud",
    texte:
      "Dans le Grand Sud saharien, la cuisine s'adapte au désert : la taguella (pain cuit sous le sable), le méchoui (agneau grillé entier), le couscous au lait caillé (rayeb), et une cuisine touarègue centrée sur les dattes, le lait de chamelle et les céréales locales.",
  },
];

export const gateaux = {
  titre: "Gâteaux traditionnels (toutes régions)",
  texte:
    "Baklawa, makroudh, kalb el louz, griwech, tcharek, mbardja — la pâtisserie algérienne, souvent à base de semoule, d'amandes et de miel, se retrouve dans tout le pays avec des variantes locales, en particulier lors des fêtes religieuses et des mariages.",
};
