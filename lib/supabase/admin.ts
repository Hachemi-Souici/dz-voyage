import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Client Supabase avec la clé service_role — contourne RLS.
 * Réservé aux route handlers serveur qui en ont explicitement besoin
 * (modération, matérialisation posts → recipes/places). Ne jamais
 * importer ce module depuis un composant client ou exposer cette clé
 * au navigateur (règle CLAUDE.md §7.2).
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
