import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_NEXT = "/fr";
const DEFAULT_ON_ERROR = "/fr/connexion";

/**
 * N'accepte qu'un chemin relatif interne ("/xxx"), jamais une URL absolue
 * ni un chemin protocole-relatif ("//evil.com") — évite l'open redirect
 * via les paramètres `next`/`onError` fournis par le client.
 */
function isSafeRelativePath(path: string | null): path is string {
  return !!path && path.startsWith("/") && !path.startsWith("//");
}

/**
 * Point de retour du flux OAuth (Google) — échange le code
 * d'autorisation contre une session, pattern officiel @supabase/ssr.
 * Route technique hors routage i18n : les chemins de destination
 * (localisés) sont transmis explicitement par le bouton Google
 * (GoogleSignInButton) via `next` et `onError`, et validés ici avant
 * toute redirection.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next");
  const onErrorParam = searchParams.get("onError");
  const next = isSafeRelativePath(nextParam) ? nextParam : DEFAULT_NEXT;
  const onError = isSafeRelativePath(onErrorParam) ? onErrorParam : DEFAULT_ON_ERROR;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}${onError}?erreur=oauth`);
}
