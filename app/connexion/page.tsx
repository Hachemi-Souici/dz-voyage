import type { Metadata } from "next";
import Link from "next/link";
import { ConnexionForm } from "@/components/ConnexionForm";

export const metadata: Metadata = { title: "Connexion" };

export default function ConnexionPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-nuit">Connexion</h1>
      <p className="mt-2 text-encre/80">
        Connectez-vous pour publier sur le blog et réagir aux publications.
      </p>

      <div className="mt-8">
        <ConnexionForm />
      </div>

      <p className="mt-6 text-sm text-encre/70">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="text-zellige hover:text-argile">
          Inscrivez-vous
        </Link>
      </p>
    </div>
  );
}
