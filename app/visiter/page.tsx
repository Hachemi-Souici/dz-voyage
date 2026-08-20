import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getContentPhotoUrl, getPhotoUrl } from "@/lib/storage";
import { chapo, musique, regions } from "@/lib/content/visiter";
import { placeToGalleryItem } from "@/lib/gallery-mappers";
import { pickRandom } from "@/lib/random";
import { PhotoGallery } from "@/components/PhotoGallery";
import type { Database } from "@/types/database";

export const metadata: Metadata = { title: "À visiter" };

const PREVIEW_COUNT = 3;

type Place = Database["public"]["Tables"]["places"]["Row"];
type Festival = Database["public"]["Tables"]["festivals"]["Row"];

export default async function VisiterPage() {
  const supabase = await createClient();
  const [{ data: places }, { data: festivals }] = await Promise.all([
    supabase.from("places").select("*").order("created_at", { ascending: false }),
    supabase.from("festivals").select("*").order("created_at", { ascending: false }),
  ]);

  const getImageUrl = (place: Place) =>
    place.post_id
      ? getPhotoUrl(supabase, place.image_path)
      : getContentPhotoUrl(supabase, place.image_path);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-nuit">À visiter</h1>
      <p className="mt-3 max-w-prose text-encre/85">{chapo}</p>

      <div className="mt-12 flex flex-col gap-16">
        {regions.map(({ region, titre, texte }) => {
          const regionPlaces = (places ?? []).filter((p) => p.region === region);
          const regionFestivals = (festivals ?? []).filter((f) => f.region === region);

          return (
            <section key={region}>
              <h2 className="font-display text-2xl text-nuit">{titre}</h2>
              <p className="mt-3 max-w-prose text-encre/85">{texte}</p>

              <PlacesGroup places={regionPlaces} region={region} getImageUrl={getImageUrl} />
              <FestivalsGroup festivals={regionFestivals} />
            </section>
          );
        })}
      </div>

      <section className="mt-16 border-t border-nuit/10 pt-10">
        <h2 className="font-display text-2xl text-nuit">{musique.titre}</h2>
        <p className="mt-3 max-w-prose text-encre/85">{musique.texte}</p>
      </section>
    </div>
  );
}

async function PlacesGroup({
  places,
  region,
  getImageUrl,
}: {
  places: Place[];
  region: string;
  getImageUrl: (place: Place) => Promise<string | null> | string | null;
}) {
  const preview = pickRandom(places, PREVIEW_COUNT);
  const items = await Promise.all(
    preview.map(async (place) => placeToGalleryItem(place, await getImageUrl(place))),
  );

  return (
    <div className="mt-6">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-utility text-sm uppercase tracking-wide text-zellige">
          Lieux à visiter
        </h3>
        {places.length > PREVIEW_COUNT && (
          <Link
            href={`/visiter/${region}`}
            className="font-utility text-xs uppercase tracking-wide text-argile hover:text-nuit"
          >
            Voir tout ({places.length})
          </Link>
        )}
      </div>
      <PhotoGallery
        items={items}
        emptyMessage="Aucun lieu publié pour l'instant dans cette région."
      />
    </div>
  );
}

function FestivalsGroup({ festivals }: { festivals: Festival[] }) {
  return (
    <div className="mt-6">
      <h3 className="font-utility text-sm uppercase tracking-wide text-zellige">
        Festivals
      </h3>
      {festivals.length === 0 ? (
        <p className="mt-2 text-sm text-encre/60">
          Aucun festival référencé pour l&apos;instant dans cette région.
        </p>
      ) : (
        <ul className="mt-3 flex flex-col gap-3">
          {festivals.map((festival) => (
            <li
              key={festival.id}
              className="rounded-xl border border-nuit/10 bg-white p-4 shadow-sm"
            >
              <p className="font-display text-lg text-nuit">
                {festival.name}
                {festival.period && (
                  <span className="ml-2 font-utility text-xs uppercase tracking-wide text-dune">
                    {festival.period}
                  </span>
                )}
              </p>
              <p className="mt-1 text-sm text-encre/70">{festival.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
