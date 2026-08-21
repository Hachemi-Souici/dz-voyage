import { getTranslations } from "next-intl/server";
import { getCurrentProfile } from "@/lib/auth";
import { UserMenu } from "@/components/UserMenu";
import { NotificationBell } from "@/components/NotificationBell";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileNav } from "@/components/MobileNav";
import { Link } from "@/i18n/navigation";

type Props = { showLanguageSwitcher?: boolean };

// "Devenir guide" (contact) desactive du header pour l'instant — decision
// produit temporaire (page /contact toujours accessible directement).
const navLinks = [
  { href: "/" as const, labelKey: "home" as const },
  { href: "/cuisine" as const, labelKey: "cuisine" as const },
  { href: "/visiter" as const, labelKey: "visit" as const },
  { href: "/blog" as const, labelKey: "blog" as const },
];

export async function SiteHeader({ showLanguageSwitcher = true }: Props = {}) {
  const [profile, t] = await Promise.all([getCurrentProfile(), getTranslations("nav")]);

  return (
    <header className="border-b border-nuit/10 bg-chaux">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <MobileNav />
          <Link href="/" className="font-display text-xl text-nuit">
            {t("siteName")}
          </Link>
        </div>

        <nav aria-label={t("ariaLabel")} className="hidden lg:block">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-utility text-sm uppercase tracking-wide text-nuit">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-argile">
                  {t(link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4 font-utility text-sm uppercase tracking-wide">
          {showLanguageSwitcher && <LanguageSwitcher />}
          {profile ? (
            <>
              <NotificationBell userId={profile.id} />
              <UserMenu username={profile.username} isAdmin={profile.is_admin} />
            </>
          ) : (
            <Link href="/connexion" className="text-nuit hover:text-argile">
              {t("login")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
