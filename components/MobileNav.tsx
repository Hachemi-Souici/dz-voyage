"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import { Link } from "@/i18n/navigation";
import { SignOutButton } from "@/components/SignOutButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

type Profile = { username: string; isAdmin: boolean } | null;

const MENU_ITEM_CLASS = "block rounded px-3 py-2 hover:bg-chaux hover:text-argile";
const SECTION_LABEL_CLASS =
  "px-3 pb-1 pt-2 font-utility text-xs uppercase tracking-wide text-encre/50";

/**
 * Nav principale + compte utilisateur, replies en hamburger sur
 * mobile/tablette (< lg) — la nav en ligne et l'avatar du header
 * restent reserves a lg (voir SiteHeader). Contact ("Devenir guide")
 * desactive du menu pour l'instant — decision produit temporaire.
 */
type Props = { profile: Profile; showLanguageSwitcher?: boolean };

export function MobileNav({ profile, showLanguageSwitcher = true }: Props) {
  const t = useTranslations("nav");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const links = [
    { href: "/" as const, label: t("home") },
    { href: "/cuisine" as const, label: t("cuisine") },
    { href: "/visiter" as const, label: t("visit") },
    { href: "/blog" as const, label: t("blog") },
  ];

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <div ref={containerRef} className="relative lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t("menuLabel")}
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded border border-nuit/30"
      >
        <span className="h-0.5 w-5 bg-nuit" aria-hidden="true" />
        <span className="h-0.5 w-5 bg-nuit" aria-hidden="true" />
        <span className="h-0.5 w-5 bg-nuit" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label={t("ariaLabel")}
          className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-nuit/10 bg-white p-1 shadow-lg"
        >
          {showLanguageSwitcher && (
            <>
              <div className="px-2 pt-1">
                <LanguageSwitcher />
              </div>
              <div className="my-1 h-px bg-nuit/10" aria-hidden="true" />
            </>
          )}

          <p className={SECTION_LABEL_CLASS}>{t("pagesLabel")}</p>
          <ul className="flex flex-col font-utility text-sm uppercase tracking-wide text-nuit">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={closeMenu} className={MENU_ITEM_CLASS}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="my-1 h-px bg-nuit/10" aria-hidden="true" />

          <p className={SECTION_LABEL_CLASS}>{t("accountLabel")}</p>
          <ul className="flex flex-col font-utility text-sm uppercase tracking-wide text-nuit">
            {profile ? (
              <>
                <li>
                  <Link href="/blog/publier" onClick={closeMenu} className={MENU_ITEM_CLASS}>
                    {t("publish")}
                  </Link>
                </li>
                <li>
                  <Link href="/blog/mes-publications" onClick={closeMenu} className={MENU_ITEM_CLASS}>
                    {t("myPosts")}
                  </Link>
                </li>
                {profile.isAdmin && (
                  // Hors routage i18n (voir middleware.ts) : lien absolu simple.
                  <li>
                    <NextLink href="/admin/moderation" onClick={closeMenu} className={MENU_ITEM_CLASS}>
                      {t("moderation")}
                    </NextLink>
                  </li>
                )}
                <li>
                  <SignOutButton className={`w-full text-left ${MENU_ITEM_CLASS}`} />
                </li>
              </>
            ) : (
              <li>
                <Link href="/connexion" onClick={closeMenu} className={MENU_ITEM_CLASS}>
                  {t("login")}
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
