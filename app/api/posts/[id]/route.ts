import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { deletePostAndPhotos } from "@/lib/delete-post";

/**
 * Suppression d'une publication — reservee a son auteur ou a un admin
 * (pour n'importe quelle publication).
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

  const { error } = await deletePostAndPhotos(admin, postId);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
