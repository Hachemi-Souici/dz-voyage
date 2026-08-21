import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Suppression d'une publication — reservee a son auteur ou a un admin
 * (pour n'importe quelle publication). Passe par le service role pour
 * nettoyer aussi les photos en storage (post_photos est supprime par
 * cascade en base, mais pas les fichiers binaires eux-memes).
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: postId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: post, error: postError } = await admin
    .from("posts")
    .select("id, author_id")
    .eq("id", postId)
    .single();

  if (postError || !post) {
    return NextResponse.json({ error: "Post introuvable" }, { status: 404 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  const isOwner = post.author_id === user.id;
  const isAdmin = profile?.is_admin === true;

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { data: photos } = await admin
    .from("post_photos")
    .select("storage_path")
    .eq("post_id", postId);

  const storagePaths = (photos ?? []).map((photo) => photo.storage_path);
  if (storagePaths.length > 0) {
    await admin.storage.from("post-photos").remove(storagePaths);
  }

  const { error: deleteError } = await admin.from("posts").delete().eq("id", postId);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
