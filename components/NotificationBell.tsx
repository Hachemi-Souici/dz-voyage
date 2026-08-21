"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import type { NotificationType } from "@/types/database";

type Notification = {
  id: string;
  post_id: string | null;
  type: NotificationType;
  read: boolean;
  post: { title: string } | null;
};

/**
 * Cloche de notifications in-app (pas d'email/push pour l'instant) —
 * charge les notifications de l'utilisateur au montage, les marque
 * lues a l'ouverture du panneau. Deux evenements : "publication
 * approuvee" (auteur, lien vers la publication) et "publication a
 * moderer" (admins, lien vers /admin/moderation — voir
 * app/api/moderate et app/api/posts/[id]/moderation).
 */
export function NotificationBell({ userId }: { userId: string }) {
  const t = useTranslations("notifications");
  const locale = useLocale();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("notifications")
      .select("id, post_id, type, read, post:posts(title)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => setNotifications((data as Notification[] | null) ?? []));
  }, [userId]);

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleToggle = async () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);

    if (nextOpen && unreadCount > 0) {
      setNotifications((current) => current.map((n) => ({ ...n, read: true })));
      const supabase = createClient();
      await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t("bellLabel")}
        className="relative flex h-8 w-8 items-center justify-center rounded-full text-nuit hover:bg-chaux"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
          <path
            d="M18 16v-5a6 6 0 0 0-5-5.917V4a1 1 0 1 0-2 0v1.083A6 6 0 0 0 6 11v5l-1.7 2.55A1 1 0 0 0 5.13 20h13.74a1 1 0 0 0 .83-1.45L18 16Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M9.5 20a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-argile px-1 font-utility text-[10px] text-chaux">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label={t("bellLabel")}
          className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-nuit/10 bg-white p-2 shadow-lg"
        >
          {notifications.length === 0 ? (
            <p className="px-2 py-2 text-sm text-encre/60">{t("empty")}</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {notifications.map((notification) => {
                const message = t(
                  notification.type === "post_pending" ? "postPending" : "postApproved",
                  { title: notification.post?.title ?? "" },
                );
                // "post_pending" (admins) pointe vers /admin/moderation,
                // hors routage i18n (pas de prefixe de langue) ;
                // "post_approved" (auteur) pointe vers la publication.
                const href =
                  notification.type === "post_pending"
                    ? "/admin/moderation"
                    : notification.post_id
                      ? `/${locale}/blog/${notification.post_id}`
                      : null;

                return (
                  <li key={notification.id}>
                    {href ? (
                      <a
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className="block rounded px-2 py-2 text-sm text-encre hover:bg-chaux"
                      >
                        {message}
                      </a>
                    ) : (
                      <p className="px-2 py-2 text-sm text-encre">{message}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
