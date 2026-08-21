import type { Config } from "tailwindcss";

// Source unique des tokens visuels du projet (brief Dz.Voyage §1).
// Ne pas ajouter de couleur ou de police en dehors de ce fichier.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nuit: "#16324F", // bleu portes de la Casbah — titres, fonds foncés
        argile: "#B5432C", // terre cuite kabyle — accents, CTA
        dune: "#D9A85C", // sable du Sahara — accents secondaires
        zellige: "#1E6E68", // faïence maghrébine — liens, succès ; couleur région Ouest (Tlemcen/Oran)
        chaux: "#F2F0E9", // blanc chaulé — fond de page (chaleur atténuée par rapport au ton sable initial, pour laisser respirer les couleurs régionales)
        encre: "#231F1A", // texte
        gres: "#A15C2E", // grès ocre des gorges de Constantine et ruines romaines — couleur région Est
        olivier: "#4F7942", // oliveraies et forêts du Djurdjura (Kabylie) — couleur région Centre
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        utility: ["var(--font-utility)", "monospace"],
      },
    },
  },
};

export default config;
