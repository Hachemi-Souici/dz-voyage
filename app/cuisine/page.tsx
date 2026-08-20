import type { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getPhotoUrl } from "@/lib/storage";
import { chapo, gateaux, regions } from "@/lib/content/cuisine";
import type { Database } from "@/types/database";

export const metadata: Metadata = { title: "Cuisine" };

type Recipe = Database["public"]["Tables"]["recipes"]["Row"] & { imageUrl: string | null };

export default async function CuisinePage() {
  const supabase = await createClient();
  const { data: recipes } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });

  const recipesWithImage: Recipe[] = await Promise.all(
    (recipes ?? []).map(async (recipe) => ({
      ...recipe,
      imageUrl: await getPhotoUrl(supabase, recipe.image_path),
    })),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-nuit">Cuisine</h1>
      <p className="mt-3 max-w-prose text-encre/85">{chapo}</p>

      <div className="mt-12 flex flex-col gap-16">
        {regions.map(({ region, titre, texte }) => {
          const regionRecipes = recipesWithImage.filter((r) => r.region === region);
          const plats = regionRecipes.filter((r) => !r.is_dessert);
          const gateauxRegion = regionRecipes.filter((r) => r.is_dessert);

          return (
            <section key={region}>
              <h2 className="font-display text-2xl text-nuit">{titre}</h2>
              <p className="mt-3 max-w-prose text-encre/85">{texte}</p>

              <RecipeGroup titre="Plats" recipes={plats} />
              <RecipeGroup titre="Gâteaux" recipes={gateauxRegion} />
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

function RecipeGroup({ titre, recipes }: { titre: string; recipes: Recipe[] }) {
  return (
    <div className="mt-6">
      <h3 className="font-utility text-sm uppercase tracking-wide text-zellige">
        {titre}
      </h3>
      {recipes.length === 0 ? (
        <p className="mt-2 text-sm text-encre/60">
          Aucune recette publiée pour l&apos;instant dans cette catégorie.
        </p>
      ) : (
        <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <li
              key={recipe.id}
              className="overflow-hidden rounded border border-nuit/10 bg-white"
            >
              {recipe.imageUrl && (
                <div className="relative aspect-4/3">
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <p className="font-display text-lg text-nuit">{recipe.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-encre/70">
                  {recipe.ingredients}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
