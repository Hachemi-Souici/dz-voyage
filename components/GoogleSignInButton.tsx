"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getPathname } from "@/i18n/navigation";

type Props = { label: string; locale: string };

export function GoogleSignInButton({ label, locale }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    setIsSubmitting(true);
    const supabase = createClient();

    // /auth/callback est hors routage i18n (route technique) — on lui
    // transmet explicitement les chemins localisés de retour et d'erreur.
    const next = getPathname({ href: "/", locale });
    const onError = getPathname({ href: "/connexion", locale });
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}&onError=${encodeURIComponent(onError)}`;

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    // La redirection vers Google quitte la page ; pas besoin de retomber
    // isSubmitting à false ici.
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSubmitting}
      className="flex items-center justify-center gap-2 rounded border border-nuit/30 bg-white px-4 py-2 font-utility text-sm uppercase tracking-wide text-nuit hover:border-nuit disabled:opacity-60"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.42 3.58v2.98h3.91c2.29-2.11 3.53-5.22 3.53-8.8Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.93l-3.91-2.98c-1.08.72-2.47 1.15-4.02 1.15-3.09 0-5.71-2.09-6.64-4.89H1.32v3.07C3.28 21.3 7.31 24 12 24Z"
        />
        <path
          fill="#FBBC05"
          d="M5.36 14.35A7.2 7.2 0 0 1 5 12c0-.82.14-1.61.36-2.35V6.58H1.32A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.32 5.42l4.04-3.07Z"
        />
        <path
          fill="#EA4335"
          d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.28 2.7 1.32 6.58l4.04 3.07C6.29 6.85 8.91 4.77 12 4.77Z"
        />
      </svg>
      {label}
    </button>
  );
}
