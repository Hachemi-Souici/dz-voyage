import { getTranslations } from "next-intl/server";
import { getCurrentProfile } from "@/lib/auth";
import { UserMenu } from "@/components/UserMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Link } from "@/i18n/navigation";

type Props = { showLanguageSwitcher?: boolean };

export async function SiteHeader({ showLanguageSwitcher = true }: Props = {}) {
  const [profile, t] = await Promise.all([getCurrentProfile(), getTranslations("nav")]);

  const navLinks = [
    { href: "/" as const, label: t("home") },
    { href: "/cuisine" as const, label: t("cuisine") },
    { href: "/visiter" as const, label: t("visit") },
    { href: "/blog" as const, label: t("blog") },
    { href: "/contact" as const, label: t("contact") },
  ];

  return (
    <header className="border-b border-nuit/10 bg-chaux">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-xl text-nuit">
          {t("siteName")}
        </Link>

        <nav aria-label={t("ariaLabel")}>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-utility text-sm uppercase tracking-wide text-nuit">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-argile">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4 font-utility text-sm uppercase tracking-wide">
          {showLanguageSwitcher && <LanguageSwitcher />}
          {profile ? (
            <UserMenu username={profile.username} isAdmin={profile.is_admin} />
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
