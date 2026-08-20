import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getContentPhotoUrl, getPhotoUrl } from "@/lib/storage";
import { REGION_LABELS, REGIONS } from "@/lib/labels";
import { recipeToGalleryItem } from "@/lib/gallery-mappers";
import { PhotoGallery } from "@/components/PhotoGallery";
import type { Database, Region } from "@/types/database";

type Recipe = Database["public"]["Tables"]["recipes"]["Row"];
type PageProps = { params: Promise<{ region: string }> };

function isRegion(value: string): value is Region {
  return (REGIONS as string[]).includes(value);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region } = await params;
  return { title: isRegion(region) ? `Cuisine — ${REGION_LABELS[region]}` : "Cuisine" };
}

export default async function CuisineRegionPage({ params }: PageProps) {
  const { region } = await params;
  if (!isRegion(region)) notFound();

  const supabase = await createClient();
  const { data: recipes } = await supabase
    .from("recipes")
    .select("*")
    .eq("region", region)
    .order("created_at", { ascending: false });

  const getImageUrl = (recipe: Recipe) =>
    recipe.post_id
      ? getPhotoUrl(supabase, recipe.image_path)
      : getContentPhotoUrl(supabase, recipe.image_path);

  const plats = (recipes ?? []).filter((r) => !r.is_dessert);
  const gateaux = (recipes ?? []).filter((r) => r.is_dessert);

  const [platsItems, gateauxItems] = await Promise.all([
    Promise.all(plats.map(async (r) => recipeToGalleryItem(r, await getImageUrl(r)))),
    Promise.all(gateaux.map(async (r) => recipeToGalleryItem(r, await getImageUrl(r)))),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Link href="/cuisine" className="font-utility text-xs uppercase tracking-wide text-zellige hover:text-argile">
        ← Toutes les régions
      </Link>
      <h1 className="mt-2 font-display text-3xl text-nuit">
        Cuisine — {REGION_LABELS[region]}
      </h1>

      <div className="mt-8">
        <h2 className="font-utility text-sm uppercase tracking-wide text-zellige">Plats</h2>
        <PhotoGallery
          items={platsItems}
          emptyMessage="Aucun plat publié pour l'instant dans cette région."
          columns="1-2-3"
        />
      </div>

      <div className="mt-10">
        <h2 className="font-utility text-sm uppercase tracking-wide text-zellige">Gâteaux</h2>
        <PhotoGallery
          items={gateauxItems}
          emptyMessage="Aucun gâteau publié pour l'instant dans cette région."
          columns="1-2-3"
        />
      </div>
    </div>
  );
}
