import type { Metadata } from "next";
import Link from "next/link";
import { ConnexionForm } from "@/components/ConnexionForm";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export const metadata: Metadata = { title: "Connexion" };

type PageProps = { searchParams: Promise<{ erreur?: string }> };

export default async function ConnexionPage({ searchParams }: PageProps) {
  const { erreur } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-nuit">Connexion</h1>
      <p className="mt-2 text-encre/80">
        Connectez-vous pour publier sur le blog et réagir aux publications.
      </p>

      {erreur === "oauth" && (
        <p role="alert" className="mt-4 text-sm text-argile">
          La connexion avec Google a échoué. Réessayez.
        </p>
      )}

      <div className="mt-8">
        <GoogleSignInButton label="Se connecter avec Google" />
      </div>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-encre/50">
        <span className="h-px flex-1 bg-nuit/15" />
        ou
        <span className="h-px flex-1 bg-nuit/15" />
      </div>

      <ConnexionForm />

      <p className="mt-6 text-sm text-encre/70">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="text-zellige hover:text-argile">
          Inscrivez-vous
        </Link>
      </p>
    </div>
  );
}
