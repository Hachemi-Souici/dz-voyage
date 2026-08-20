import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getContentPhotoUrl, getPhotoUrl } from "@/lib/storage";
import { chapo, gateaux, regions } from "@/lib/content/cuisine";
import { recipeToGalleryItem } from "@/lib/gallery-mappers";
import { pickRandom } from "@/lib/random";
import { PhotoGallery } from "@/components/PhotoGallery";
import type { Database } from "@/types/database";

export const metadata: Metadata = { title: "Cuisine" };

const PREVIEW_COUNT = 3;

type Recipe = Database["public"]["Tables"]["recipes"]["Row"];

export default async function CuisinePage() {
  const supabase = await createClient();
  const { data: recipes } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });

  const getRecipeImageUrl = (recipe: Recipe) =>
    recipe.post_id
      ? getPhotoUrl(supabase, recipe.image_path)
      : getContentPhotoUrl(supabase, recipe.image_path);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-nuit">Cuisine</h1>
      <p className="mt-3 max-w-prose text-encre/85">{chapo}</p>

      <div className="mt-12 flex flex-col gap-16">
        {regions.map(({ region, titre, texte }) => {
          const regionRecipes = (recipes ?? []).filter((r) => r.region === region);
          const plats = regionRecipes.filter((r) => !r.is_dessert);
          const gateauxRegion = regionRecipes.filter((r) => r.is_dessert);

          return (
            <section key={region}>
              <h2 className="font-display text-2xl text-nuit">{titre}</h2>
              <p className="mt-3 max-w-prose text-encre/85">{texte}</p>

              <RecipeGroup
                titre="Plats"
                recipes={plats}
                region={region}
                getImageUrl={getRecipeImageUrl}
              />
              <RecipeGroup
                titre="Gâteaux"
                recipes={gateauxRegion}
                region={region}
                getImageUrl={getRecipeImageUrl}
              />
            </section>
          );
        })}
      </div>

      <section className="mt-16 border-t border-nuit/10 pt-10">
        <h2 className="font-display text-2xl text-nuit">{gateaux.titre}</h2>
        <p className="mt-3 max-w-prose text-encre/85">{gateaux.texte}</p>
      </section>
    </div>
  );
}

async function RecipeGroup({
  titre,
  recipes,
  region,
  getImageUrl,
}: {
  titre: string;
  recipes: Recipe[];
  region: string;
  getImageUrl: (recipe: Recipe) => Promise<string | null> | string | null;
}) {
  const preview = pickRandom(recipes, PREVIEW_COUNT);
  const items = await Promise.all(
    preview.map(async (recipe) => recipeToGalleryItem(recipe, await getImageUrl(recipe))),
  );

  return (
    <div className="mt-6">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-utility text-sm uppercase tracking-wide text-zellige">
          {titre}
        </h3>
        {recipes.length > PREVIEW_COUNT && (
          <Link
            href={`/cuisine/${region}`}
            className="font-utility text-xs uppercase tracking-wide text-argile hover:text-nuit"
          >
            Voir tout ({recipes.length})
          </Link>
        )}
      </div>
      <PhotoGallery
        items={items}
        emptyMessage="Aucune recette publiée pour l'instant dans cette catégorie."
      />
    </div>
  );
}
