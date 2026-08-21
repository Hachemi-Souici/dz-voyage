import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getPhotoUrl } from "@/lib/storage";
import { getRegionLabels, getTypeLabels } from "@/lib/labels";
import { LikeDislikeButtons } from "@/components/LikeDislikeButtons";
import type { ReactionType } from "@/types/database";

type PageProps = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from("posts").select("title").eq("id", id).single();
  return { title: post?.title ?? "Publication" };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blog");
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select(
      "id, type, region, title, body, created_at, author:profiles(username), post_photos(storage_path, position)",
    )
    .eq("id", id)
    .eq("status", "approuvee")
    .single();

  if (!post) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: reactions }, photoUrls] = await Promise.all([
    supabase.from("post_reactions").select("user_id, reaction").eq("post_id", id),
    Promise.all(
      [...post.post_photos]
        .sort((a, b) => a.position - b.position)
        .map((photo) => getPhotoUrl(supabase, photo.storage_path)),
    ),
  ]);

  const likes = reactions?.filter((r) => r.reaction === "like").length ?? 0;
  const dislikes = reactions?.filter((r) => r.reaction === "dislike").length ?? 0;
  const userReaction =
    (reactions?.find((r) => r.user_id === user?.id)?.reaction as ReactionType | undefined) ??
    null;

  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="font-utility text-xs uppercase tracking-wide text-zellige">
        {getTypeLabels(locale)[post.type]} · {getRegionLabels(locale)[post.region]}
      </p>
      <h1 className="mt-2 font-display text-3xl text-nuit">{post.title}</h1>
      <p className="mt-1 text-sm text-encre/70">
        {t("by", { username: post.author?.username ?? t("anonymous") })}
      </p>
      {locale === "en" && (
        <p className="mt-1 text-xs italic text-encre/50">{t("originalFrenchNotice")}</p>
      )}

      <div className="mt-8 flex flex-col gap-4">
        {photoUrls
          .filter((url): url is string => Boolean(url))
          .map((url, index) => (
            <div key={url} className="relative aspect-4/3 overflow-hidden rounded">
              <Image
                src={url}
                alt={`${post.title} — photo ${index + 1}`}
                fill
                sizes="(min-width: 640px) 42rem, 100vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
      </div>

      <p className="mt-8 whitespace-pre-line text-encre/90">{post.body}</p>

      <div className="mt-8">
        <LikeDislikeButtons
          postId={post.id}
          userId={user?.id ?? null}
          initialLikes={likes}
          initialDislikes={dislikes}
          initialReaction={userReaction}
        />
      </div>
    </article>
  );
}
