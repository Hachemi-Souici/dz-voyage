import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getContentPhotoUrl, getPhotoUrl } from "@/lib/storage";
import { REGION_LABELS, REGIONS } from "@/lib/labels";
import { placeToGalleryItem } from "@/lib/gallery-mappers";
import { PhotoGallery } from "@/components/PhotoGallery";
import type { Database, Region } from "@/types/database";

type Place = Database["public"]["Tables"]["places"]["Row"];
type PageProps = { params: Promise<{ region: string }> };

function isRegion(value: string): value is Region {
  return (REGIONS as string[]).includes(value);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region } = await params;
  return { title: isRegion(region) ? `À visiter — ${REGION_LABELS[region]}` : "À visiter" };
}

export default async function VisiterRegionPage({ params }: PageProps) {
  const { region } = await params;
  if (!isRegion(region)) notFound();

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
    (places ?? []).map(async (place) => placeToGalleryItem(place, await getImageUrl(place))),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Link href="/visiter" className="font-utility text-xs uppercase tracking-wide text-zellige hover:text-argile">
        ← Toutes les régions
      </Link>
      <h1 className="mt-2 font-display text-3xl text-nuit">
        À visiter — {REGION_LABELS[region]}
      </h1>

      <div className="mt-8">
        <PhotoGallery
          items={items}
          emptyMessage="Aucun lieu publié pour l'instant dans cette région."
          columns="1-2-3"
        />
      </div>
    </div>
  );
}
