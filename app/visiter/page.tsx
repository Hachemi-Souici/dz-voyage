import type { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getPhotoUrl } from "@/lib/storage";
import { chapo, musique, regions } from "@/lib/content/visiter";
import type { Database } from "@/types/database";

export const metadata: Metadata = { title: "À visiter" };

type Place = Database["public"]["Tables"]["places"]["Row"] & { imageUrl: string | null };
type Festival = Database["public"]["Tables"]["festivals"]["Row"];

export default async function VisiterPage() {
  const supabase = await createClient();
  const [{ data: places }, { data: festivals }] = await Promise.all([
    supabase.from("places").select("*").order("created_at", { ascending: false }),
    supabase.from("festivals").select("*").order("created_at", { ascending: false }),
  ]);

  const placesWithImage: Place[] = await Promise.all(
    (places ?? []).map(async (place) => ({
      ...place,
      imageUrl: await getPhotoUrl(supabase, place.image_path),
    })),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-nuit">À visiter</h1>
      <p className="mt-3 max-w-prose text-encre/85">{chapo}</p>

      <div className="mt-12 flex flex-col gap-16">
        {regions.map(({ region, titre, texte }) => {
          const regionPlaces = placesWithImage.filter((p) => p.region === region);
          const regionFestivals = (festivals ?? []).filter((f) => f.region === region);

          return (
            <section key={region}>
              <h2 className="font-display text-2xl text-nuit">{titre}</h2>
              <p className="mt-3 max-w-prose text-encre/85">{texte}</p>

              <PlacesGroup places={regionPlaces} />
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

function PlacesGroup({ places }: { places: Place[] }) {
  return (
    <div className="mt-6">
      <h3 className="font-utility text-sm uppercase tracking-wide text-zellige">
        Lieux à visiter
      </h3>
      {places.length === 0 ? (
        <p className="mt-2 text-sm text-encre/60">
          Aucun lieu publié pour l&apos;instant dans cette région.
        </p>
      ) : (
        <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <li
              key={place.id}
              className="overflow-hidden rounded border border-nuit/10 bg-white"
            >
              {place.imageUrl && (
                <div className="relative aspect-4/3">
                  <Image
                    src={place.imageUrl}
                    alt={place.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                {place.category && (
                  <p className="font-utility text-xs uppercase tracking-wide text-dune">
                    {place.category}
                  </p>
                )}
                <p className="mt-1 font-display text-lg text-nuit">{place.name}</p>
                <p className="mt-1 line-clamp-3 text-sm text-encre/70">
                  {place.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
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
            <li key={festival.id} className="rounded border border-nuit/10 bg-white p-4">
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
