import type { Metadata } from "next";
import Link from "next/link";
import { InscriptionForm } from "@/components/InscriptionForm";

export const metadata: Metadata = { title: "Inscription" };

export default function InscriptionPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-nuit">Inscription</h1>
      <p className="mt-2 text-encre/80">
        Créez un compte pour partager vos photos et découvertes d&apos;Algérie.
      </p>

      <div className="mt-8">
        <InscriptionForm />
      </div>

      <p className="mt-6 text-sm text-encre/70">
        Déjà inscrit ?{" "}
        <Link href="/connexion" className="text-zellige hover:text-argile">
          Connectez-vous
        </Link>
      </p>
    </div>
  );
}
