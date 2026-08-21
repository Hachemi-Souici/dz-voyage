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
        chaux: "#F1EADC", // blanc chaulé — fond de page
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
