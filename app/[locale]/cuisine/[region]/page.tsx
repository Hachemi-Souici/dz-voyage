import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getContentPhotoUrl, getPhotoUrl } from "@/lib/storage";
import { getRegionLabels, REGION_ACCENT, REGIONS } from "@/lib/labels";
import { recipeToGalleryItem } from "@/lib/gallery-mappers";
import { PhotoGallery } from "@/components/PhotoGallery";
import type { Database, Region } from "@/types/database";

type Recipe = Database["public"]["Tables"]["recipes"]["Row"];
type PageProps = { params: Promise<{ locale: string; region: string }> };

function isRegion(value: string): value is Region {
  return (REGIONS as string[]).includes(value);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, region } = await params;
  const t = await getTranslations({ locale, namespace: "cuisine" });
  return {
    title: isRegion(region) ? t("regionTitle", { region: getRegionLabels(locale)[region] }) : t("title"),
  };
}

export default async function CuisineRegionPage({ params }: PageProps) {
  const { locale, region } = await params;
  if (!isRegion(region)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("cuisine");
  const regionLabel = getRegionLabels(locale)[region];
  const accent = REGION_ACCENT[region];

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
    Promise.all(plats.map(async (r) => recipeToGalleryItem(r, await getImageUrl(r), locale))),
    Promise.all(gateaux.map(async (r) => recipeToGalleryItem(r, await getImageUrl(r), locale))),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Link
        href="/cuisine"
        className="font-utility text-xs uppercase tracking-wide text-zellige hover:text-argile"
      >
        {t("backToRegions")}
      </Link>
      <h1 className={`mt-2 font-display text-3xl ${accent.text}`}>
        {t("regionTitle", { region: regionLabel })}
      </h1>

      <div className="mt-8">
        <h2 className={`font-utility text-sm uppercase tracking-wide ${accent.text}`}>
          {t("dishes")}
        </h2>
        <PhotoGallery items={platsItems} emptyMessage={t("emptyDishes")} columns="1-2-3" />
      </div>

      <div className="mt-10">
        <h2 className={`font-utility text-sm uppercase tracking-wide ${accent.text}`}>
          {t("cakes")}
        </h2>
        <PhotoGallery items={gateauxItems} emptyMessage={t("emptyCakes")} columns="1-2-3" />
      </div>
    </div>
  );
}
