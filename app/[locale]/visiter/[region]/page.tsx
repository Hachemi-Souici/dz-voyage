import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getContentPhotoUrl, getPhotoUrl } from "@/lib/storage";
import { getRegionLabels, REGION_ACCENT, REGIONS } from "@/lib/labels";
import { placeToGalleryItem } from "@/lib/gallery-mappers";
import { PhotoGallery } from "@/components/PhotoGallery";
import type { Database, Region } from "@/types/database";

type Place = Database["public"]["Tables"]["places"]["Row"];
type PageProps = { params: Promise<{ locale: string; region: string }> };

function isRegion(value: string): value is Region {
  return (REGIONS as string[]).includes(value);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, region } = await params;
  const t = await getTranslations({ locale, namespace: "visit" });
  return {
    title: isRegion(region) ? t("regionTitle", { region: getRegionLabels(locale)[region] }) : t("title"),
  };
}

export default async function VisiterRegionPage({ params }: PageProps) {
  const { locale, region } = await params;
  if (!isRegion(region)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("visit");
  const regionLabel = getRegionLabels(locale)[region];
  const accent = REGION_ACCENT[region];

  const supabase = await createClient();
  const { data: places } = await supabase
    .from("places")
    .select("*")
    .eq("region", region)
    .order("created_at", { ascending: false });

  const getImageUrl = (place: Place) =>
    place.post_id
      ? getPhotoUrl(supabase, place.image_path)
      : getContentPhotoUrl(supabase, place.image_path);

  const items = await Promise.all(
    (places ?? []).map(async (place) => placeToGalleryItem(place, await getImageUrl(place), locale)),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className={`rounded-r-xl border-l-4 ${accent.border} ${accent.gradient} py-6 pr-6 pl-6`}>
        <Link
          href="/visiter"
          className="font-utility text-xs uppercase tracking-wide text-zellige hover:text-argile"
        >
          {t("backToRegions")}
        </Link>
        <h1 className={`mt-2 font-display text-3xl ${accent.text}`}>
          {t("regionTitle", { region: regionLabel })}
        </h1>
      </div>

      <div className="mt-8">
        <PhotoGallery items={items} emptyMessage={t("emptyPlaces")} columns="1-2-3" />
      </div>
    </div>
  );
}
