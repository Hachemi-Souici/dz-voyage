import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { UploadForm } from "@/components/UploadForm";

export const metadata: Metadata = { title: "Publier" };

export default async function PublierPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/connexion");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-nuit">Publier sur le blog</h1>
      <p className="mt-2 text-encre/80">
        Partagez une découverte nature, une recette ou un lieu à visiter.
        Publié sous le pseudo <strong>{profile.username}</strong>.
      </p>

      <div className="mt-8">
        <UploadForm authorId={profile.id} />
      </div>
    </div>
  );
}
