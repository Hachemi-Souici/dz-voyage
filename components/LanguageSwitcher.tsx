"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_LABELS: Record<string, string> = { fr: "FR", en: "EN" };

/**
 * Bouton unique affichant la langue courante — un clic bascule vers
 * l'autre langue (seulement 2 langues supportees, pas besoin d'un
 * selecteur). Reste sur la meme page (slugs traduits pris en charge
 * automatiquement par next-intl).
 */
export function LanguageSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const otherLocale = routing.locales.find((candidate) => candidate !== locale) ?? locale;

  const handleClick = () => {
    router.replace(
      // @ts-expect-error -- les params correspondent toujours a la route courante
      { pathname, params },
      { locale: otherLocale },
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={t("languageSwitcherLabel")}
      className="rounded border border-nuit/30 px-2 py-1 font-utility text-xs uppercase tracking-wide text-nuit hover:border-nuit"
    >
      {LOCALE_LABELS[locale] ?? locale}
    </button>
  );
}
