"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Nav principale repliee en hamburger sur mobile/tablette (< lg) ;
 * la nav en ligne du header reste visible a partir de lg (voir
 * SiteHeader, classe `hidden lg:block`). Contact ("Devenir guide")
 * desactive du menu pour l'instant — decision produit temporaire.
 */
export function MobileNav() {
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
        <nav
          aria-label={t("ariaLabel")}
          className="absolute left-0 z-20 mt-2 w-48 rounded-xl border border-nuit/10 bg-white p-1 shadow-lg"
        >
          <ul className="flex flex-col font-utility text-sm uppercase tracking-wide text-nuit">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded px-3 py-2 hover:bg-chaux hover:text-argile"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
