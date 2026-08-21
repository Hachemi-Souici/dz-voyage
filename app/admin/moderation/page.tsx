import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "@/i18n/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPhotoUrl } from "@/lib/storage";
import { REGION_LABELS, TYPE_LABELS } from "@/lib/labels";
import { ModerationActions } from "@/components/ModerationActions";

export const metadata: Metadata = { title: "Modération" };

export default async function ModerationPage() {
  const profile = await getCurrentProfile();

  if (!profile) return redirect({ href: "/connexion", locale: "fr" });
  if (!profile.is_admin) return redirect({ href: "/", locale: "fr" });

  // Client service_role : la policy RLS "posts_select_approved_or_own"
  // ne laisse un utilisateur voir que ses propres publications en attente
  // (+ celles approuvées de tout le monde) — un admin ne verrait donc
  // jamais les publications en attente des autres utilisateurs avec le
  // client normal. Sans danger ici : l'accès admin est deja verifie
  // ci-dessus.
  const supabase = createAdminClient();
  const { data: posts } = await supabase
    .from("posts")
    .select(
      "id, type, region, title, body, created_at, status, author:profiles(username), post_photos(storage_path, position)",
    )
    .in("status", ["en_attente", "revision_manuelle"])
    .order("created_at", { ascending: true });

  const postsWithPhotos = await Promise.all(
    (posts ?? []).map(async (post) => {
      const photoUrls = await Promise.all(
        [...post.post_photos]
          .sort((a, b) => a.position - b.position)
          .map((photo) => getPhotoUrl(supabase, photo.storage_path)),
      );
      return { ...post, photoUrls: photoUrls.filter((url): url is string => Boolean(url)) };
    }),
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-nuit">Modération</h1>
      <p className="mt-2 text-encre/80">
        Validation manuelle obligatoire de chaque photo avant publication
        publique.
      </p>

      {postsWithPhotos.length === 0 ? (
        <p className="mt-10 text-encre/70">Rien en attente pour le moment.</p>
      ) : (
        <ul className="mt-10 flex flex-col gap-8">
          {postsWithPhotos.map((post) => (
            <li key={post.id} className="rounded border border-nuit/10 bg-white p-4">
              <p className="font-utility text-xs uppercase tracking-wide text-zellige">
                {TYPE_LABELS[post.type]} · {REGION_LABELS[post.region]} · {post.status}
              </p>
              <h2 className="mt-1 font-display text-xl text-nuit">{post.title}</h2>
              <p className="text-sm text-encre/70">
                Par {post.author?.username ?? "anonyme"}
              </p>

              {post.photoUrls.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {post.photoUrls.map((url) => (
                    <div key={url} className="relative h-32 w-32 overflow-hidden rounded">
                      <Image src={url} alt="" fill sizes="8rem" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-4 whitespace-pre-line text-sm text-encre/90">{post.body}</p>

              <div className="mt-4">
                <ModerationActions postId={post.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
