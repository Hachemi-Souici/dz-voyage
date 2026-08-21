import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ConnexionForm } from "@/components/ConnexionForm";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ erreur?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("login") };
}

export default async function ConnexionPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { erreur } = await searchParams;
  const t = await getTranslations("loginForm");

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-nuit">{t("title")}</h1>
      <p className="mt-2 text-encre/80">{t("subtitle")}</p>

      {erreur === "oauth" && (
        <p role="alert" className="mt-4 text-sm text-argile">
          {t("oauthError")}
        </p>
      )}

      <div className="mt-8">
        <GoogleSignInButton label={t("googleCta")} locale={locale} />
      </div>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-encre/50">
        <span className="h-px flex-1 bg-nuit/15" />
        {t("or")}
        <span className="h-px flex-1 bg-nuit/15" />
      </div>

      <ConnexionForm />

      <p className="mt-6 text-sm text-encre/70">
        {t("noAccount")}{" "}
        <Link href="/inscription" className="text-zellige hover:text-argile">
          {t("signUpLink")}
        </Link>
      </p>
    </div>
  );
}
