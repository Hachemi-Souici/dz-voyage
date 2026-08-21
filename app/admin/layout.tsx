import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "../globals.css";

// Racine dediee pour /admin : espace interne, francais uniquement, hors
// routage i18n (voir middleware.ts). Duplique la coquille html/body du
// layout localise (app/[locale]/layout.tsx) car Next.js exige une racine
// html/body distincte pour les segments qui ne partagent pas de layout
// commun avec app/[locale].
export const metadata: Metadata = { title: { default: "Modération", template: "%s · Dz.Voyage" } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fontVariables} h-full`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader showLanguageSwitcher={false} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
