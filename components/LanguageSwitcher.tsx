"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_LABELS: Record<string, string> = { fr: "FR", en: "EN" };

/**
 * Toggle FR/EN — reste sur la meme page en changeant de langue (slugs
 * traduits pris en charge automatiquement par next-intl). La langue
 * choisie est retenue par cookie (NEXT_LOCALE) pour les visites suivantes.
 */
export function LanguageSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const handleSelect = (nextLocale: string) => {
    if (nextLocale === locale) return;
    router.replace(
      // @ts-expect-error -- les params correspondent toujours a la route courante
      { pathname, params },
      { locale: nextLocale },
    );
  };

  return (
    <div
      role="group"
      aria-label={t("languageSwitcherLabel")}
      className="flex items-center gap-1 rounded border border-nuit/30 p-0.5"
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => handleSelect(loc)}
          aria-current={loc === locale ? "true" : undefined}
          className={`rounded px-2 py-1 font-utility text-xs uppercase tracking-wide transition-colors ${
            loc === locale ? "bg-nuit text-chaux" : "text-nuit hover:text-argile"
          }`}
        >
          {LOCALE_LABELS[loc] ?? loc}
        </button>
      ))}
    </div>
  );
}
