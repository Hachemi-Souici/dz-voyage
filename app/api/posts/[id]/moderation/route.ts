import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { deletePostAndPhotos } from "@/lib/delete-post";
import type {
  LieuPostDetails,
  RecettePostDetails,
} from "@/types/database";

type ModerationAction = "approuver" | "rejeter" | "revision_manuelle";

const ACTION_TO_STATUS: Record<ModerationAction, string> = {
  approuver: "approuvee",
  rejeter: "rejetee",
  revision_manuelle: "revision_manuelle",
};

/**
 * Décision de modération sur un post — réservée aux admins. Bascule le
 * statut via le service role (aucune policy RLS client ne permet de
 * modifier `posts.status`) et, en cas d'approbation d'un post
 * `recette`/`lieu`, matérialise les champs conditionnels vers les
 * tables publiques `recipes`/`places` consommées par les pages
 * cuisine/visiter.
 *
 * Décision produit : un post rejeté ne garde pas sa photo en base —
 * il est supprimé directement (voir lib/delete-post) plutôt que
 * simplement marqué `rejetee`.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: postId } = await params;
  const { action } = (await request.json()) as { action?: ModerationAction };

  if (!action || !(action in ACTION_TO_STATUS)) {
    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const admin = createAdminClient();

  const { data: post, error: postError } = await admin
    .from("posts")
    .select("id, author_id, type, region, title, body, details")
    .eq("id", postId)
    .single();

  if (postError || !post) {
    return NextResponse.json({ error: "Post introuvable" }, { status: 404 });
  }

  if (action === "rejeter") {
    const { error } = await deletePostAndPhotos(admin, postId);
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    return NextResponse.json({ postId, status: "rejetee", deleted: true });
  }

  const { error: updateError } = await admin
    .from("posts")
    .update({ status: ACTION_TO_STATUS[action] as never })
    .eq("id", postId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  if (action === "approuver") {
    await admin
      .from("notifications")
      .insert({ user_id: post.author_id, post_id: post.id, type: "post_approved" });
  }

  if (action === "approuver" && (post.type === "recette" || post.type === "lieu")) {
    const { data: firstPhoto } = await admin
      .from("post_photos")
      .select("storage_path")
      .eq("post_id", postId)
      .order("position", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (post.type === "recette") {
      const details = post.details as RecettePostDetails;
      await admin.from("recipes").insert({
        post_id: post.id,
        region: post.region,
        title: post.title,
        is_dessert: details.isDessert ?? false,
        ingredients: details.ingredients ?? "",
        steps: details.steps ?? "",
        image_path: firstPhoto?.storage_path ?? null,
      });
    } else {
      const details = post.details as LieuPostDetails;
      await admin.from("places").insert({
        post_id: post.id,
        region: post.region,
        name: details.name || post.title,
        description: post.body,
        category: details.category ?? null,
        image_path: firstPhoto?.storage_path ?? null,
      });
    }
  }

  return NextResponse.json({ postId, status: ACTION_TO_STATUS[action] });
}
