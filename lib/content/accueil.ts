// Textes de la page d'accueil — brief Dz.Voyage §4. Ne pas reformuler,
// contenu validé.

export const chapo = {
  kicker: "Depuis les Numides jusqu'à aujourd'hui",
  title: "L'Algérie, terre de passages et de résistances",
  body: "Des royaumes berbères aux dynasties musulmanes, de la régence d'Ottomane à l'indépendance conquise en 1962, l'Algérie porte plus de trois mille ans d'histoires mêlées — et les raconte encore aujourd'hui dans trois langues et une mosaïque de traditions régionales.",
};

export type FriseImage = { src: string; alt: string; credit: string };
export type FriseEntry = {
  periode: string;
  titre: string;
  texte: string;
  image?: FriseImage;
};

// Photos sourcées sur Wikimedia Commons (licences libres, brief §4.1) —
// deux périodes n'ont volontairement pas d'image (aucune piste photo
// fiable trouvée pour Vandales/Byzantins et les dynasties berbères
// musulmanes ; aucune photo authentique et bien documentée trouvée pour
// les scènes de liesse du 5 juillet 1962 — mieux vaut une entrée sans
// photo qu'une photo hors-sujet).
export const frise: FriseEntry[] = [
  {
    periode: "Avant le VIIe siècle",
    titre: "Préhistoire et royaumes berbères",
    texte:
      "Les premières traces d'occupation humaine sur le territoire remontent à plusieurs centaines de milliers d'années. Les populations berbères (Amazighs) y organisent dès l'Antiquité des royaumes structurés, dont la Numidie, unifiée au IIe siècle av. J.-C. sous le roi Massinissa, puis rendue célèbre par la résistance de Jugurtha face à Rome.",
    image: {
      src: "/frise/massinissa.jpg",
      alt: "Mausolée royal numide de Massinissa, El Khroub",
      credit: "Photo : Riad Hadjsadok / Wikimedia Commons, CC BY-SA 4.0",
    },
  },
  {
    periode: "146 av. J.-C. – Ve siècle",
    titre: "Numidie romaine",
    texte:
      "Après la chute de Carthage, la région est progressivement intégrée à l'Empire romain. Des cités comme Timgad, Djemila, Tipasa ou Cherchell prospèrent et comptent aujourd'hui parmi les sites archéologiques romains les mieux conservés au monde. C'est à Thagaste (aujourd'hui Souk Ahras) qu'est né Augustin d'Hippone, l'un des Pères de l'Église, plus tard évêque d'Hippone (Annaba).",
    image: {
      src: "/frise/djemila.jpg",
      alt: "Colonnes romaines en ruines à Djemila",
      credit: "Photo : Yves Jalabert / Wikimedia Commons, CC BY-SA 2.0",
    },
  },
  {
    periode: "Ve – VIIe siècle",
    titre: "Vandales puis Byzantins",
    texte:
      "Après le déclin de l'Empire romain d'Occident, la région passe sous domination vandale, puis est reconquise par l'Empire byzantin au VIe siècle.",
  },
  {
    periode: "VIIe – VIIIe siècle",
    titre: "Conquête arabo-musulmane",
    texte:
      "Les armées arabo-musulmanes atteignent le Maghreb à partir des années 670. Cette période introduit durablement l'islam et la langue arabe, qui se mêlent aux structures sociales et linguistiques berbères déjà en place.",
  },
  {
    periode: "VIIIe – XVIe siècle",
    titre: "Dynasties berbères musulmanes",
    texte:
      "Plusieurs dynasties d'origine berbère, converties à l'islam, gouvernent successivement le territoire : les Rostémides (capitale Tahert, actuelle Tiaret), les Zirides, les Hammadides, puis les grands ensembles almoravide et almohade qui unifient un temps tout le Maghreb et l'Andalousie. À l'ouest, le royaume zianide de Tlemcen devient un foyer culturel et commercial majeur pendant plus de trois siècles.",
  },
  {
    periode: "1516 – 1830",
    titre: "Régence d'Alger, période ottomane",
    texte:
      "Alger devient le siège d'une régence rattachée à l'Empire ottoman, dirigée localement par un dey. Cette période voit le renforcement d'Alger comme puissance méditerranéenne et l'installation d'une administration ottomane-locale originale.",
    image: {
      src: "/frise/ottoman-port.jpg",
      alt: "Gravure ancienne du port d'Alger, Bab Dzira, époque ottomane",
      credit: "Gravure : Adolphe Jean-Baptiste Bayot / Wikimedia Commons, CC BY 4.0",
    },
  },
  {
    periode: "1830 – 1962",
    titre: "Colonisation française",
    texte:
      "La prise d'Alger par la France en 1830 ouvre une période de plus d'un siècle de colonisation, marquée par une administration directe, des transferts de terres et de profonds bouleversements sociaux pour la population algérienne.",
    image: {
      src: "/frise/colonial-casbah.jpg",
      alt: "Alger et la Casbah vers 1900, période coloniale française",
      credit: "Photo : Viollet, v. 1900 / Wikimedia Commons, domaine public",
    },
  },
  {
    periode: "1954 – 1962",
    titre: "Guerre de libération et indépendance",
    texte:
      "Le 1er novembre 1954, le déclenchement de l'insurrection marque le début de la guerre d'indépendance, menée notamment par le Front de libération nationale (FLN). L'indépendance est proclamée le 5 juillet 1962, après des négociations conclues par les accords d'Évian.",
  },
  {
    periode: "Depuis 1962",
    titre: "L'Algérie indépendante",
    texte:
      "Depuis 1962, l'Algérie construit son État sur ce socle historique multiple — berbère, arabo-musulman, ottoman et méditerranéen — qui continue d'irriguer sa culture, sa cuisine et son art de vivre régional.",
    image: {
      src: "/frise/alger-moderne.jpg",
      alt: "Vue aérienne de la baie d'Alger aujourd'hui",
      credit: "Photo : Photographie-Kamel-C / Wikimedia Commons, CC BY 2.0",
    },
  },
];

export const langues = {
  titre: "Langues",
  intro: "L'Algérie est aujourd'hui plurilingue :",
  items: [
    {
      nom: "Le tamazight (berbère)",
      texte:
        "langue officielle depuis 2016, se décline en plusieurs variantes régionales (kabyle, chaouie, targui écrit en tifinagh, mozabite…).",
    },
    {
      nom: "L'arabe littéraire",
      texte: "langue officielle et langue de l'enseignement et de l'administration.",
    },
    {
      nom: "L'arabe algérien (darja)",
      texte:
        "parlé au quotidien par la grande majorité de la population, mélange d'arabe, de berbère et d'emprunts turcs, espagnols et français.",
    },
    {
      nom: "Le français",
      texte:
        "hérité de la période coloniale, reste très présent dans l'enseignement supérieur, les affaires et une partie de la vie quotidienne, sans statut officiel.",
    },
  ],
};

export const religion = {
  titre: "Religion",
  texte:
    "L'islam sunnite, de rite malikite, est très largement majoritaire en Algérie et structure profondément le calendrier social et culturel du pays. Le territoire a aussi porté d'autres héritages religieux : un christianisme antique influent (illustré par Augustin d'Hippone et l'évêché d'Hippone), progressivement effacé après l'islamisation, ainsi qu'une communauté juive implantée pendant des siècles, dont la majorité des membres a quitté le pays au moment de l'indépendance. De petites minorités religieuses, dont des communautés chrétiennes, sont présentes aujourd'hui.",
};
