import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const SIGNED_URL_TTL_SECONDS = 60 * 60;

/**
 * Le bucket `post-photos` est privé (règle CLAUDE.md : pas d'exposition
 * publique par défaut) — la policy RLS de storage.objects autorise déjà
 * l'auteur, les admins et tout visiteur sur un post approuvé, donc une
 * URL signée générée ici reflète cet accès.
 */
export async function getPhotoUrl(
  supabase: SupabaseClient<Database>,
  storagePath: string | null | undefined,
): Promise<string | null> {
  if (!storagePath) return null;

  const { data, error } = await supabase.storage
    .from("post-photos")
    .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS);

  if (error || !data) return null;
  return data.signedUrl;
}
