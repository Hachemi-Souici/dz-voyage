// Textes de la page à visiter — brief Dz.Voyage §6. Ne pas reformuler,
// contenu validé.
import type { Region } from "@/types/database";

export const chapo =
  "Sites antiques, ksour sahariens, villes côtières et montagnes berbères : un aperçu des incontournables de chaque région, des festivals qui rythment l'année et de la musique qui les accompagne.";

export const regions: { region: Region; titre: string; texte: string }[] = [
  {
    region: "est",
    titre: "Est",
    texte:
      "Constantine, « ville des ponts suspendus », domine ses gorges spectaculaires. Annaba conserve la basilique Saint-Augustin et les ruines d'Hippone. Les sites romains de Timgad et Djemila, classés au patrimoine mondial de l'UNESCO, comptent parmi les mieux préservés du bassin méditerranéen.",
  },
  {
    region: "ouest",
    titre: "Ouest",
    texte:
      "Tlemcen, ancienne capitale zianide, réunit la Grande Mosquée et le site de Mansourah. Oran mêle façades espagnoles, le fort de Santa Cruz et une vie culturelle très animée. La côte de Mostaganem complète cet ensemble littoral.",
  },
  {
    region: "centre",
    titre: "Centre",
    texte:
      "Alger la Blanche : la Casbah (UNESCO), le Jardin d'Essai, la basilique Notre-Dame d'Afrique. À proximité, les ruines romaines de Tipasa (UNESCO) surplombent la Méditerranée. En Kabylie, le massif du Djurdjura et Tikjda offrent randonnée et montagne.",
  },
  {
    region: "sud",
    titre: "Sud",
    texte:
      "Le Hoggar et le Tassili n'Ajjer (UNESCO) abritent l'un des plus grands ensembles d'art rupestre préhistorique au monde. La vallée du M'zab, autour de Ghardaïa (UNESCO), présente une architecture ksourienne unique. Timimoun et Djanet complètent les incontournables sahariens.",
  },
];

export const musique = {
  titre: "Culture musicale",
  texte:
    "La musique algérienne reflète la même diversité régionale que sa cuisine : le chaâbi, né dans la Casbah d'Alger (porté par des figures comme El Hadj M'Hamed El Anka) ; le raï, originaire d'Oran, aujourd'hui connu internationalement ; le malouf de Constantine, musique arabo-andalouse ; la musique kabyle, portée par des artistes comme Idir ou Lounis Aït Menguellet ; et le diwan, musique spirituelle du Sud aux racines subsahariennes.",
};
