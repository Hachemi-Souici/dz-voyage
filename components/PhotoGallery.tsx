"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GalleryItem } from "@/types/gallery";

type Props = {
  items: GalleryItem[];
  emptyMessage: string;
  columns?: "2-3" | "1-2-3";
};

/**
 * Grille de cartes (photo + titre + extrait) avec lightbox au clic
 * (photo agrandie + description complète). Utilisée par les pages
 * cuisine, visiter et blog pour un rendu cohérent.
 */
export function PhotoGallery({ items, emptyMessage, columns = "2-3" }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openItem = items.find((item) => item.id === openId) ?? null;

  useEffect(() => {
    if (!openItem) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openItem]);

  if (items.length === 0) {
    return <p className="mt-2 text-sm text-encre/60">{emptyMessage}</p>;
  }

  const gridCols =
    columns === "1-2-3"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-2 sm:grid-cols-3";

  return (
    <>
      <ul className={`mt-3 grid gap-4 ${gridCols}`}>
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(item.id)}
              className="group block w-full overflow-hidden rounded-xl border border-nuit/10 bg-white text-left shadow-sm transition-shadow hover:shadow-md"
            >
              {item.imageUrl ? (
                <div className="relative aspect-4/3">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 50vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex aspect-4/3 items-center justify-center bg-chaux text-encre/40">
                  <span className="font-utility text-xs uppercase tracking-wide">
                    Pas de photo
                  </span>
                </div>
              )}
              <div className="p-3">
                {item.badge && (
                  <p className="font-utility text-xs uppercase tracking-wide text-dune">
                    {item.badge}
                  </p>
                )}
                <p className="mt-0.5 font-display text-base text-nuit">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-encre/70">{item.excerpt}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {openItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={openItem.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-encre/80 p-4"
          onClick={() => setOpenId(null)}
        >
          <div
            className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            {openItem.imageUrl && (
              <div className="relative aspect-4/3 shrink-0">
                <Image
                  src={openItem.imageUrl}
                  alt={openItem.title}
                  fill
                  sizes="42rem"
                  className="object-cover"
                />
              </div>
            )}
            <div className="overflow-y-auto p-6">
              {openItem.badge && (
                <p className="font-utility text-xs uppercase tracking-wide text-dune">
                  {openItem.badge}
                </p>
              )}
              <h3 className="mt-1 font-display text-2xl text-nuit">{openItem.title}</h3>
              <p className="mt-3 whitespace-pre-line text-encre/85">
                {openItem.description}
              </p>
              {openItem.credit && (
                <p className="mt-4 font-utility text-xs text-encre/50">
                  {openItem.credit}
                </p>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                {openItem.href && (
                  <Link
                    href={openItem.href}
                    className="rounded bg-argile px-4 py-2 font-utility text-sm uppercase tracking-wide text-chaux hover:bg-nuit"
                  >
                    {openItem.hrefLabel ?? "Voir la publication"}
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setOpenId(null)}
                  className="rounded border border-nuit/30 px-4 py-2 font-utility text-sm uppercase tracking-wide text-nuit hover:border-nuit"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
