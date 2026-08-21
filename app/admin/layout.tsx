import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { fontVariables } from "@/lib/fonts";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "../globals.css";

// Racine dediee pour /admin : espace interne, francais uniquement, hors
// routage i18n (voir proxy.ts). Duplique la coquille html/body du
// layout localise (app/[locale]/layout.tsx) car Next.js exige une racine
// html/body distincte pour les segments qui ne partagent pas de layout
// commun avec app/[locale].
//
// NextIntlClientProvider est tout de meme necessaire ici : SiteHeader
// utilise des composants clients (MobileNav, UserMenu, NotificationBell)
// qui appellent useTranslations/useLocale et plantent sans contexte
// intl. getMessages() retombe sur le francais par defaut (voir
// i18n/request.ts) puisqu'aucun segment [locale] n'est present sur
// cette route.
export const metadata: Metadata = { title: { default: "Modération", template: "%s · Dz.Voyage" } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();

  return (
    <html lang="fr" className={`${fontVariables} h-full`}>
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider locale="fr" messages={messages}>
          <SiteHeader showLanguageSwitcher={false} />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
