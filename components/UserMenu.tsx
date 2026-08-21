"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import { Link } from "@/i18n/navigation";
import { SignOutButton } from "@/components/SignOutButton";

type Props = { username: string; isAdmin: boolean };

const MENU_ITEM_CLASS =
  "block w-full rounded px-3 py-2 text-left font-utility text-sm text-nuit hover:bg-chaux";

/** Avatar (initiale du pseudo) + menu deroulant : Publier, Mes
 * publications, Moderation (admin), Se deconnecter. */
export function UserMenu({ username, isAdmin }: Props) {
  const t = useTranslations("nav");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const initial = username.charAt(0).toUpperCase();

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t("accountMenuLabel")}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-argile font-utility text-sm text-chaux hover:bg-nuit"
      >
        {initial}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label={t("accountMenuLabel")}
          className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-nuit/10 bg-white p-1 shadow-lg"
        >
          <Link
            href="/blog/publier"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className={MENU_ITEM_CLASS}
          >
            {t("publish")}
          </Link>
          <Link
            href="/blog/mes-publications"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className={MENU_ITEM_CLASS}
          >
            {t("myPosts")}
          </Link>
          {isAdmin && (
            // Hors routage i18n (voir proxy.ts) : lien absolu simple.
            <NextLink
              href="/admin/moderation"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className={MENU_ITEM_CLASS}
            >
              {t("moderation")}
            </NextLink>
          )}
          <div className="my-1 h-px bg-nuit/10" aria-hidden="true" />
          <SignOutButton role="menuitem" className={MENU_ITEM_CLASS} />
        </div>
      )}
    </div>
  );
}
