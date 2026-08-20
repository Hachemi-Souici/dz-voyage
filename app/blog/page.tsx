import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getPhotoUrl } from "@/lib/storage";
import { REGION_LABELS, TYPE_LABELS } from "@/lib/labels";

export const metadata: Metadata = { title: "Blog" };

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select(
      "id, type, region, title, created_at, author:profiles(username), post_photos(storage_path, position)",
    )
    .eq("status", "approuvee")
    .order("created_at", { ascending: false });

  const postsWithCover = await Promise.all(
    (posts ?? []).map(async (post) => {
      const cover = [...post.post_photos].sort((a, b) => a.position - b.position)[0];
      const coverUrl = await getPhotoUrl(supabase, cover?.storage_path);
      return { ...post, coverUrl };
    }),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-nuit">Le blog des voyageurs</h1>
      <p className="mt-2 max-w-prose text-encre/80">
        Nature, recettes et lieux partagés par la communauté — chaque photo
        est validée manuellement avant publication.
      </p>

      {postsWithCover.length === 0 ? (
        <p className="mt-10 text-encre/70">
          Aucune publication pour le moment.{" "}
          <Link href="/blog/publier" className="text-zellige hover:text-argile">
            Soyez le premier à partager une découverte.
          </Link>
        </p>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {postsWithCover.map((post) => (
            <li
              key={post.id}
              className="flex flex-col overflow-hidden rounded border border-nuit/10 bg-white"
            >
              {post.coverUrl && (
                <div className="relative aspect-4/3">
                  <Image
                    src={post.coverUrl}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="font-utility text-xs uppercase tracking-wide text-zellige">
                  {TYPE_LABELS[post.type]} · {REGION_LABELS[post.region]}
                </p>
                <h2 className="font-display text-lg text-nuit">
                  <Link href={`/blog/${post.id}`} className="hover:text-argile">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-sm text-encre/70">
                  Par {post.author?.username ?? "anonyme"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
