import { defineRouting } from "next-intl/routing";

// Routage bilingue : prefixe de langue toujours present (/fr/... et /en/...).
// Les slugs sont traduits pour les pages publiques principales — brief
// i18n validé avec l'utilisateur (structure /fr + /en, slugs traduits).
export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/cuisine": { fr: "/cuisine", en: "/food" },
    "/cuisine/[region]": { fr: "/cuisine/[region]", en: "/food/[region]" },
    "/visiter": { fr: "/visiter", en: "/visit" },
    "/visiter/[region]": { fr: "/visiter/[region]", en: "/visit/[region]" },
    "/blog": "/blog",
    "/blog/[id]": "/blog/[id]",
    "/blog/publier": { fr: "/blog/publier", en: "/blog/publish" },
    "/contact": "/contact",
    "/connexion": { fr: "/connexion", en: "/login" },
    "/inscription": { fr: "/inscription", en: "/register" },
  },
});

export type AppLocale = (typeof routing.locales)[number];
