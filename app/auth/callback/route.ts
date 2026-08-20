import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Point de retour du flux OAuth (Google) — échange le code
 * d'autorisation contre une session, pattern officiel @supabase/ssr.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/connexion?erreur=oauth`);
}
