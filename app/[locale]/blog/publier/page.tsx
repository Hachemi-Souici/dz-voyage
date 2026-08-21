import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { UploadForm } from "@/components/UploadForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("publish") };
}

export default async function PublierPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const profile = await getCurrentProfile();
  if (!profile) return redirect({ href: "/connexion", locale });

  const t = await getTranslations("blog");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-nuit">{t("publishTitle")}</h1>
      <p className="mt-2 text-encre/80">
        {t.rich("publishIntro", {
          username: profile.username,
          b: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>

      <div className="mt-8">
        <UploadForm authorId={profile.id} />
      </div>
    </div>
  );
}
