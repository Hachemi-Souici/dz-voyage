import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/cuisine", label: "Cuisine" },
  { href: "/visiter", label: "À visiter" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Devenir guide" },
];

export async function SiteHeader() {
  const profile = await getCurrentProfile();

  return (
    <header className="border-b border-nuit/10 bg-chaux">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-xl text-nuit">
          Dz.Voyage
        </Link>

        <nav aria-label="Navigation principale">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-utility text-sm uppercase tracking-wide text-nuit">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-argile">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4 font-utility text-sm uppercase tracking-wide">
          {profile ? (
            <>
              <Link href="/blog/publier" className="text-argile hover:text-nuit">
                Publier
              </Link>
              {profile.is_admin && (
                <Link href="/admin/moderation" className="text-nuit hover:text-argile">
                  Modération
                </Link>
              )}
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/connexion" className="text-nuit hover:text-argile">
                Connexion
              </Link>
              <Link href="/inscription" className="text-argile hover:text-nuit">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
