import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getPhotoUrl } from "@/lib/storage";
import { getRegionLabels, getStatusLabels } from "@/lib/labels";
import { postToGalleryItem } from "@/lib/gallery-mappers";
import { PhotoGallery } from "@/components/PhotoGallery";
import { MyPostsGallery } from "@/components/MyPostsGallery";
import type { Database, ReactionType } from "@/types/database";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "myPosts" });
  return { title: t("title") };
}

type OwnPost = Database["public"]["Tables"]["posts"]["Row"] & {
  post_photos: { storage_path: string; position: number }[];
};

type ReactedPost = {
  reaction: ReactionType;
  post:
    | (Database["public"]["Tables"]["posts"]["Row"] & {
        author: { username: string } | null;
        post_photos: { storage_path: string; position: number }[];
      })
    | null;
};

export default async function MesPublicationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const profile = await getCurrentProfile();
  if (!profile) return redirect({ href: "/connexion", locale });

  const t = await getTranslations("myPosts");
  const tReaction = await getTranslations("likeDislike");
  const regionLabels = getRegionLabels(locale);
  const statusLabels = getStatusLabels(locale);

  const supabase = await createClient();
  const getCoverUrl = (photos: { storage_path: string; position: number }[]) => {
    const cover = [...photos].sort((a, b) => a.position - b.position)[0];
    return getPhotoUrl(supabase, cover?.storage_path);
  };

  const [{ data: ownPosts }, { data: reactedPosts }] = await Promise.all([
    supabase
      .from("posts")
      .select("id, type, region, title, body, status, created_at, author_id, details, post_photos(storage_path, position)")
      .eq("author_id", profile.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("post_reactions")
      .select(
        "reaction, post:posts(id, type, region, title, body, status, created_at, author_id, details, author:profiles(username), post_photos(storage_path, position))",
      )
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false }),
  ]);

  const ownItems = await Promise.all(
    ((ownPosts ?? []) as OwnPost[]).map(async (post) => {
      const item = postToGalleryItem(post, profile.username, await getCoverUrl(post.post_photos), locale);
      const isApproved = post.status === "approuvee";
      return {
        ...item,
        badge: `${regionLabels[post.region]} · ${statusLabels[post.status]}`,
        href: isApproved ? item.href : undefined,
        hrefLabel: isApproved ? item.hrefLabel : undefined,
      };
    }),
  );

  const reactionLabels = { like: tReaction("like"), dislike: tReaction("dislike") };
  const reactionItems = await Promise.all(
    ((reactedPosts ?? []) as ReactedPost[])
      .filter((entry) => entry.post && entry.post.status === "approuvee")
      .map(async (entry) => {
        const post = entry.post!;
        const item = postToGalleryItem(
          post,
          post.author?.username,
          await getCoverUrl(post.post_photos),
          locale,
        );
        return { ...item, badge: reactionLabels[entry.reaction] ?? item.badge };
      }),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-nuit">{t("title")}</h1>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-nuit">{t("myPostsSection")}</h2>
        <MyPostsGallery
          items={ownItems}
          emptyMessage={t("emptyPosts")}
          deleteLabel={t("delete")}
          confirmMessage={t("deleteConfirm")}
        />
      </section>

      <section className="mt-16 border-t border-nuit/10 pt-10">
        <h2 className="font-display text-2xl text-nuit">{t("myReactionsSection")}</h2>
        <PhotoGallery items={reactionItems} emptyMessage={t("emptyReactions")} columns="1-2-3" />
      </section>
    </div>
  );
}
