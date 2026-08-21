import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPhotoUrl } from "@/lib/storage";
import { REGIONS, REGION_ACCENT, getRegionLabels } from "@/lib/labels";
import { postToGalleryItem } from "@/lib/gallery-mappers";
import { PhotoGallery } from "@/components/PhotoGallery";
import type { Database, Region } from "@/types/database";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("blog") };
}

type PostRow = Database["public"]["Tables"]["posts"]["Row"] & {
  author: { username: string } | null;
  post_photos: { storage_path: string; position: number }[];
};

type T = (key: string, values?: Record<string, string | number>) => string;

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blog");

  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select(
      "id, type, region, title, body, created_at, author:profiles(username), post_photos(storage_path, position)",
    )
    .eq("status", "approuvee")
    .order("created_at", { ascending: false });

  const getCoverUrl = (post: PostRow) => {
    const cover = [...post.post_photos].sort((a, b) => a.position - b.position)[0];
    return getPhotoUrl(supabase, cover?.storage_path);
  };

  const allPosts = (posts ?? []) as PostRow[];
  const culinaire = allPosts.filter((p) => p.type === "recette");
  const endroit = allPosts.filter((p) => p.type === "lieu");
  const nature = allPosts.filter((p) => p.type === "nature");

  const natureItems = await Promise.all(
    nature.map(async (post) =>
      postToGalleryItem(post, post.author?.username, await getCoverUrl(post), locale),
    ),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-nuit">{t("title")}</h1>
      <p className="mt-2 max-w-prose text-encre/80">{t("subtitle")}</p>

      {allPosts.length === 0 ? (
        <p className="mt-10 text-encre/70">
          {t("empty")}{" "}
          <Link href="/blog/publier" className="text-zellige hover:text-argile">
            {t("emptyCta")}
          </Link>
        </p>
      ) : (
        <div className="mt-12 flex flex-col gap-16">
          <CategorySection
            titre={t("culinary")}
            emptyLabel={t("emptyCategory", { category: t("culinary").toLowerCase() })}
            posts={culinaire}
            getCoverUrl={getCoverUrl}
            locale={locale}
            t={t}
          />
          <CategorySection
            titre={t("place")}
            emptyLabel={t("emptyCategory", { category: t("place").toLowerCase() })}
            posts={endroit}
            getCoverUrl={getCoverUrl}
            locale={locale}
            t={t}
          />

          {nature.length > 0 && (
            <section>
              <h2 className="font-display text-2xl text-nuit">{t("nature")}</h2>
              <PhotoGallery items={natureItems} emptyMessage={t("emptyNature")} columns="1-2-3" />
            </section>
          )}
        </div>
      )}
    </div>
  );
}

async function CategorySection({
  titre,
  emptyLabel,
  posts,
  getCoverUrl,
  locale,
  t,
}: {
  titre: string;
  emptyLabel: string;
  posts: PostRow[];
  getCoverUrl: (post: PostRow) => Promise<string | null>;
  locale: string;
  t: T;
}) {
  const regionsWithPosts = REGIONS.filter((region) =>
    posts.some((post) => post.region === region),
  );

  return (
    <section>
      <h2 className="font-display text-2xl text-nuit">{titre}</h2>

      {regionsWithPosts.length === 0 ? (
        <p className="mt-3 text-sm text-encre/60">{emptyLabel}</p>
      ) : (
        <div className="mt-6 flex flex-col gap-10">
          {regionsWithPosts.map((region) => (
            <RegionSubsection
              key={region}
              region={region}
              posts={posts.filter((post) => post.region === region)}
              getCoverUrl={getCoverUrl}
              locale={locale}
              t={t}
            />
          ))}
        </div>
      )}
    </section>
  );
}

async function RegionSubsection({
  region,
  posts,
  getCoverUrl,
  locale,
  t,
}: {
  region: Region;
  posts: PostRow[];
  getCoverUrl: (post: PostRow) => Promise<string | null>;
  locale: string;
  t: T;
}) {
  const items = await Promise.all(
    posts.map(async (post) =>
      postToGalleryItem(post, post.author?.username, await getCoverUrl(post), locale),
    ),
  );

  return (
    <div>
      <h3
        className={`font-utility text-sm uppercase tracking-wide ${REGION_ACCENT[region].text}`}
      >
        {getRegionLabels(locale)[region]}
      </h3>
      <PhotoGallery items={items} emptyMessage={t("emptyRegion")} columns="1-2-3" />
    </div>
  );
}
