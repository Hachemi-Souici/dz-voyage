"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = { className?: string; role?: string };

export function SignOutButton({
  className = "font-utility text-sm uppercase tracking-wide text-nuit hover:text-argile",
  role,
}: Props = {}) {
  const t = useTranslations("nav");
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button type="button" role={role} onClick={handleSignOut} className={className}>
      {t("logout")}
    </button>
  );
}
