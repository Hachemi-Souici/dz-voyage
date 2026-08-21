import { Amiri, IBM_Plex_Mono, Work_Sans } from "next/font/google";

// Polices partagees entre le layout localise (app/[locale]/layout.tsx) et
// le layout de l'admin (app/admin/layout.tsx, hors i18n) — evite de
// dupliquer les appels next/font/google dans les deux racines.
export const amiri = Amiri({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const workSans = Work_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-utility",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const fontVariables = `${amiri.variable} ${workSans.variable} ${ibmPlexMono.variable}`;
