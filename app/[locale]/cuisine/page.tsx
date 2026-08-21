import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getContentPhotoUrl, getPhotoUrl } from "@/lib/storage";
import * as cuisineFr from "@/lib/content/cuisine";
import * as cuisineEn from "@/lib/content/cuisine.en";
import { recipeToGalleryItem } from "@/lib/gallery-mappers";
import { REGION_ACCENT } from "@/lib/labels";
import { pickRandom } from "@/lib/random";
import { PhotoGallery } from "@/components/PhotoGallery";
import type { Database, Region } from "@/types/database";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("cuisine") };
}

const PREVIEW_COUNT = 3;

type Recipe = Database["public"]["Tables"]["recipes"]["Row"];

export default async function CuisinePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { chapo, gateaux, regions } = locale === "en" ? cuisineEn : cuisineFr;
  const t = await getTranslations("cuisine");

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
      <h1 className="font-display text-3xl text-nuit">{t("title")}</h1>
      <p className="mt-3 max-w-prose text-encre/85">{chapo}</p>

      <div className="mt-12 flex flex-col gap-16">
        {regions.map(({ region, titre, texte }) => {
          const regionRecipes = (recipes ?? []).filter((r) => r.region === region);
          const plats = regionRecipes.filter((r) => !r.is_dessert);
          const gateauxRegion = regionRecipes.filter((r) => r.is_dessert);

          const accent = REGION_ACCENT[region];

          return (
            <section key={region} className={`border-l-4 ${accent.border} pl-6`}>
              <h2 className={`font-display text-2xl ${accent.text}`}>{titre}</h2>
              <p className="mt-3 max-w-prose text-encre/85">{texte}</p>

              <RecipeGroup
                titre={t("dishes")}
                emptyMessage={t("emptyDishes")}
                viewAllLabel={(count) => t("viewAll", { count })}
                recipes={plats}
                region={region}
                locale={locale}
                getImageUrl={getRecipeImageUrl}
              />
              <RecipeGroup
                titre={t("cakes")}
                emptyMessage={t("emptyCakes")}
                viewAllLabel={(count) => t("viewAll", { count })}
                recipes={gateauxRegion}
                region={region}
                locale={locale}
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
  emptyMessage,
  viewAllLabel,
  recipes,
  region,
  locale,
  getImageUrl,
}: {
  titre: string;
  emptyMessage: string;
  viewAllLabel: (count: number) => string;
  recipes: Recipe[];
  region: Region;
  locale: string;
  getImageUrl: (recipe: Recipe) => Promise<string | null> | string | null;
}) {
  const preview = pickRandom(recipes, PREVIEW_COUNT);
  const items = await Promise.all(
    preview.map(async (recipe) => recipeToGalleryItem(recipe, await getImageUrl(recipe), locale)),
  );

  return (
    <div className="mt-6">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-utility text-sm uppercase tracking-wide text-zellige">
          {titre}
        </h3>
        {recipes.length > PREVIEW_COUNT && (
          <Link
            href={{ pathname: "/cuisine/[region]", params: { region } }}
            className="font-utility text-xs uppercase tracking-wide text-argile hover:text-nuit"
          >
            {viewAllLabel(recipes.length)}
          </Link>
        )}
      </div>
      <PhotoGallery items={items} emptyMessage={emptyMessage} />
    </div>
  );
}
