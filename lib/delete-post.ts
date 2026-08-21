import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Supprime une publication et ses photos en storage (le reste — photos
 * en base, réactions, notifications, recette/lieu matérialisé — part
 * par cascade FK, voir migrations 0001/0008/0010). Utilisé par la
 * suppression volontaire (auteur/admin) et par le rejet en modération
 * (décision produit : un post rejeté ne garde pas sa photo en base).
 */
export async function deletePostAndPhotos(
  admin: SupabaseClient<Database>,
  postId: string,
): Promise<{ error?: string }> {
  const { data: photos } = await admin
    .from("post_photos")
    .select("storage_path")
    .eq("post_id", postId);

  const storagePaths = (photos ?? []).map((photo) => photo.storage_path);
  if (storagePaths.length > 0) {
    await admin.storage.from("post-photos").remove(storagePaths);
  }

  const { error } = await admin.from("posts").delete().eq("id", postId);
  return { error: error?.message };
}
