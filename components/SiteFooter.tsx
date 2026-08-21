import { getTranslations } from "next-intl/server";

export async function SiteFooter() {
  const t = await getTranslations();

  return (
    <footer className="border-t border-nuit/10 bg-nuit text-chaux">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="font-display text-lg">{t("nav.siteName")}</p>
        <p className="mt-2 max-w-prose text-sm text-chaux/80">{t("footer.tagline")}</p>
      </div>
    </footer>
  );
}
