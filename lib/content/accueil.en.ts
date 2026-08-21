// English translation of the home page content — mirrors accueil.ts
// (fr) faithfully. Keep in sync with the French source; do not add or
// remove facts, only translate.

export const chapo = {
  kicker: "From the Numidians to today",
  title: "Algeria, a land of passages and resistance",
  body: "From Berber kingdoms to Muslim dynasties, from Ottoman rule to the independence won in 1962, Algeria carries more than three thousand years of intertwined history — and still tells it today in three languages and a mosaic of regional traditions.",
};

export type FriseImage = { src: string; alt: string; credit: string };
export type FriseEntry = {
  periode: string;
  titre: string;
  texte: string;
  image?: FriseImage;
};

export const frise: FriseEntry[] = [
  {
    periode: "Before the 7th century",
    titre: "Prehistory and Berber kingdoms",
    texte:
      "The earliest traces of human occupation in the region go back several hundred thousand years. From antiquity, Berber (Amazigh) populations organized structured kingdoms, including Numidia, unified in the 2nd century BC under King Massinissa, later made famous by Jugurtha's resistance against Rome.",
    image: {
      src: "/frise/massinissa.jpg",
      alt: "Royal Numidian mausoleum of Massinissa, El Khroub",
      credit: "Photo: Riad Hadjsadok / Wikimedia Commons, CC BY-SA 4.0",
    },
  },
  {
    periode: "146 BC – 5th century",
    titre: "Roman Numidia",
    texte:
      "After the fall of Carthage, the region was gradually integrated into the Roman Empire. Cities such as Timgad, Djemila, Tipasa and Cherchell flourished and are today among the best-preserved Roman archaeological sites in the world. Augustine of Hippo, one of the Fathers of the Church, was born in Thagaste (present-day Souk Ahras) and later became bishop of Hippo (Annaba).",
    image: {
      src: "/frise/djemila.jpg",
      alt: "Ruined Roman columns at Djemila",
      credit: "Photo: Yves Jalabert / Wikimedia Commons, CC BY-SA 2.0",
    },
  },
  {
    periode: "5th – 7th century",
    titre: "Vandals, then Byzantines",
    texte:
      "After the decline of the Western Roman Empire, the region came under Vandal rule, then was reconquered by the Byzantine Empire in the 6th century.",
  },
  {
    periode: "7th – 8th century",
    titre: "Arab-Muslim conquest",
    texte:
      "Arab-Muslim armies reached the Maghreb from the 670s onward. This period durably introduced Islam and the Arabic language, which blended with the Berber social and linguistic structures already in place.",
  },
  {
    periode: "8th – 16th century",
    titre: "Berber Muslim dynasties",
    texte:
      "Several dynasties of Berber origin, converted to Islam, successively governed the territory: the Rustamids (capital Tahert, present-day Tiaret), the Zirids, the Hammadids, then the great Almoravid and Almohad empires which for a time unified the whole Maghreb and Andalusia. In the west, the Zayyanid kingdom of Tlemcen became a major cultural and commercial hub for more than three centuries.",
  },
  {
    periode: "1516 – 1830",
    titre: "Regency of Algiers, Ottoman period",
    texte:
      "Algiers became the seat of a regency attached to the Ottoman Empire, locally ruled by a dey. This period saw Algiers strengthen as a Mediterranean power and the establishment of a distinctive Ottoman-local administration.",
    image: {
      src: "/frise/ottoman-port.jpg",
      alt: "Old engraving of the port of Algiers, Bab Dzira, Ottoman era",
      credit: "Engraving: Adolphe Jean-Baptiste Bayot / Wikimedia Commons, CC BY 4.0",
    },
  },
  {
    periode: "1830 – 1962",
    titre: "French colonization",
    texte:
      "The capture of Algiers by France in 1830 opened a period of more than a century of colonization, marked by direct administration, land transfers, and profound social upheaval for the Algerian population.",
    image: {
      src: "/frise/colonial-casbah.jpg",
      alt: "Algiers and the Casbah circa 1900, French colonial period",
      credit: "Photo: Viollet, c. 1900 / Wikimedia Commons, public domain",
    },
  },
  {
    periode: "1954 – 1962",
    titre: "War of liberation and independence",
    texte:
      "On November 1, 1954, the outbreak of the uprising marked the start of the war of independence, led notably by the National Liberation Front (FLN). Independence was proclaimed on July 5, 1962, after negotiations concluded by the Évian Accords.",
  },
  {
    periode: "Since 1962",
    titre: "Independent Algeria",
    texte:
      "Since 1962, Algeria has built its state on this multiple historical foundation — Berber, Arab-Muslim, Ottoman and Mediterranean — which continues to shape its culture, cuisine and regional way of life.",
    image: {
      src: "/frise/alger-moderne.jpg",
      alt: "Aerial view of the bay of Algiers today",
      credit: "Photo: Photographie-Kamel-C / Wikimedia Commons, CC BY 2.0",
    },
  },
];

export const langues = {
  titre: "Languages",
  intro: "Algeria is multilingual today:",
  items: [
    {
      nom: "Tamazight (Berber)",
      texte:
        "official language since 2016, with several regional variants (Kabyle, Chaoui, Tuareg written in Tifinagh, Mozabite…).",
    },
    {
      nom: "Literary Arabic",
      texte: "the official language and the language of education and administration.",
    },
    {
      nom: "Algerian Arabic (darja)",
      texte:
        "spoken daily by the vast majority of the population, a blend of Arabic, Berber, and Turkish, Spanish and French loanwords.",
    },
    {
      nom: "French",
      texte:
        "inherited from the colonial period, remains very present in higher education, business and part of everyday life, without official status.",
    },
  ],
};

export const religion = {
  titre: "Religion",
  texte:
    "Sunni Islam, of the Maliki school, is very largely the majority religion in Algeria and deeply structures the country's social and cultural calendar. The territory has also carried other religious legacies: an influential early Christianity (illustrated by Augustine of Hippo and the bishopric of Hippo), gradually erased after Islamization, as well as a Jewish community established for centuries, most of whose members left the country at independence. Small religious minorities, including Christian communities, are present today.",
};
