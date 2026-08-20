import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getPhotoUrl } from "@/lib/storage";
import { REGION_LABELS, REGIONS } from "@/lib/labels";
import { postToGalleryItem } from "@/lib/gallery-mappers";
import { PhotoGallery } from "@/components/PhotoGallery";
import type { Database, Region } from "@/types/database";

export const metadata: Metadata = { title: "Blog" };

type PostRow = Database["public"]["Tables"]["posts"]["Row"] & {
  author: { username: string } | null;
  post_photos: { storage_path: string; position: number }[];
};

export default async function BlogPage() {
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
      postToGalleryItem(post, post.author?.username, await getCoverUrl(post)),
    ),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-nuit">Le blog des voyageurs</h1>
      <p className="mt-2 max-w-prose text-encre/80">
        Nature, recettes et lieux partagés par la communauté — chaque photo
        est validée manuellement avant publication.
      </p>

      {allPosts.length === 0 ? (
        <p className="mt-10 text-encre/70">
          Aucune publication pour le moment.{" "}
          <Link href="/blog/publier" className="text-zellige hover:text-argile">
            Soyez le premier à partager une découverte.
          </Link>
        </p>
      ) : (
        <div className="mt-12 flex flex-col gap-16">
          <CategorySection titre="Culinaire" posts={culinaire} getCoverUrl={getCoverUrl} />
          <CategorySection titre="Endroit" posts={endroit} getCoverUrl={getCoverUrl} />

          {nature.length > 0 && (
            <section>
              <h2 className="font-display text-2xl text-nuit">Nature</h2>
              <PhotoGallery
                items={natureItems}
                emptyMessage="Aucune publication nature pour l'instant."
                columns="1-2-3"
              />
            </section>
          )}
        </div>
      )}
    </div>
  );
}

async function CategorySection({
  titre,
  posts,
  getCoverUrl,
}: {
  titre: string;
  posts: PostRow[];
  getCoverUrl: (post: PostRow) => Promise<string | null>;
}) {
  const regionsWithPosts = REGIONS.filter((region) =>
    posts.some((post) => post.region === region),
  );

  return (
    <section>
      <h2 className="font-display text-2xl text-nuit">{titre}</h2>

      {regionsWithPosts.length === 0 ? (
        <p className="mt-3 text-sm text-encre/60">
          Aucune publication {titre.toLowerCase()} pour l&apos;instant.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-10">
          {regionsWithPosts.map((region) => (
            <RegionSubsection
              key={region}
              region={region}
              posts={posts.filter((post) => post.region === region)}
              getCoverUrl={getCoverUrl}
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
}: {
  region: Region;
  posts: PostRow[];
  getCoverUrl: (post: PostRow) => Promise<string | null>;
}) {
  const items = await Promise.all(
    posts.map(async (post) =>
      postToGalleryItem(post, post.author?.username, await getCoverUrl(post)),
    ),
  );

  return (
    <div>
      <h3 className="font-utility text-sm uppercase tracking-wide text-zellige">
        {REGION_LABELS[region]}
      </h3>
      <PhotoGallery
        items={items}
        emptyMessage="Aucune publication pour l'instant dans cette région."
        columns="1-2-3"
      />
    </div>
  );
}
