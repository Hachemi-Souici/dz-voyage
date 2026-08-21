import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Point de passage de modération anti-nudité, appelé juste après la
 * création d'un post depuis UploadForm.
 *
 * Décision produit actée : aucune API externe de détection automatique.
 * Toute image passe par une validation humaine manuelle (voir
 * /admin/moderation). Cette route ne peut techniquement PAS approuver
 * un post : elle se contente de confirmer que le statut reste
 * `en_attente` (imposé de toute façon par la policy RLS d'insertion et
 * par la valeur par défaut de la colonne). Elle existe comme point
 * d'extension explicite si un fournisseur de modération est branché un
 * jour — dans ce cas, ne jamais auto-approuver si le fournisseur
 * n'est pas configuré ou ne répond pas.
 */
export async function POST(request: Request) {
  const { postId } = (await request.json()) as { postId?: string };

  if (!postId) {
    return NextResponse.json({ error: "postId manquant" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { data: post, error } = await supabase
    .from("posts")
    .select("id, status, author_id")
    .eq("id", postId)
    .single();

  if (error || !post || post.author_id !== user.id) {
    return NextResponse.json({ error: "Post introuvable" }, { status: 404 });
  }

  // Notifie chaque admin qu'une publication attend une modération
  // manuelle (client service_role : les notifications n'ont pas de
  // policy insert côté client, voir migration 0008).
  const admin = createAdminClient();
  const { data: admins } = await admin.from("profiles").select("id").eq("is_admin", true);
  if (admins && admins.length > 0) {
    await admin.from("notifications").insert(
      admins.map((adminProfile) => ({
        user_id: adminProfile.id,
        post_id: post.id,
        type: "post_pending" as const,
      })),
    );
  }

  return NextResponse.json({
    postId: post.id,
    status: post.status,
    message:
      "Photo(s) en attente de validation humaine manuelle avant publication publique.",
  });
}
