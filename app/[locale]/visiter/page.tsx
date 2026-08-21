import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getContentPhotoUrl, getPhotoUrl } from "@/lib/storage";
import * as visiterFr from "@/lib/content/visiter";
import * as visiterEn from "@/lib/content/visiter.en";
import { placeToGalleryItem } from "@/lib/gallery-mappers";
import { pickRandom } from "@/lib/random";
import { PhotoGallery } from "@/components/PhotoGallery";
import type { Database, Region } from "@/types/database";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("visit") };
}

const PREVIEW_COUNT = 3;

type Place = Database["public"]["Tables"]["places"]["Row"];
type Festival = Database["public"]["Tables"]["festivals"]["Row"];

export default async function VisiterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { chapo, musique, regions } = locale === "en" ? visiterEn : visiterFr;
  const t = await getTranslations("visit");

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
      <h1 className="font-display text-3xl text-nuit">{t("title")}</h1>
      <p className="mt-3 max-w-prose text-encre/85">{chapo}</p>

      <div className="mt-12 flex flex-col gap-16">
        {regions.map(({ region, titre, texte }) => {
          const regionPlaces = (places ?? []).filter((p) => p.region === region);
          const regionFestivals = (festivals ?? []).filter((f) => f.region === region);

          return (
            <section key={region}>
              <h2 className="font-display text-2xl text-nuit">{titre}</h2>
              <p className="mt-3 max-w-prose text-encre/85">{texte}</p>

              <PlacesGroup
                places={regionPlaces}
                region={region}
                locale={locale}
                getImageUrl={getImageUrl}
                t={t}
              />
              <FestivalsGroup festivals={regionFestivals} t={t} />
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

type T = (key: string, values?: Record<string, string | number>) => string;

async function PlacesGroup({
  places,
  region,
  locale,
  getImageUrl,
  t,
}: {
  places: Place[];
  region: Region;
  locale: string;
  getImageUrl: (place: Place) => Promise<string | null> | string | null;
  t: T;
}) {
  const preview = pickRandom(places, PREVIEW_COUNT);
  const items = await Promise.all(
    preview.map(async (place) => placeToGalleryItem(place, await getImageUrl(place), locale)),
  );

  return (
    <div className="mt-6">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-utility text-sm uppercase tracking-wide text-zellige">
          {t("places")}
        </h3>
        {places.length > PREVIEW_COUNT && (
          <Link
            href={{ pathname: "/visiter/[region]", params: { region } }}
            className="font-utility text-xs uppercase tracking-wide text-argile hover:text-nuit"
          >
            {t("viewAll", { count: places.length })}
          </Link>
        )}
      </div>
      <PhotoGallery items={items} emptyMessage={t("emptyPlaces")} />
    </div>
  );
}

function FestivalsGroup({ festivals, t }: { festivals: Festival[]; t: T }) {
  return (
    <div className="mt-6">
      <h3 className="font-utility text-sm uppercase tracking-wide text-zellige">
        {t("festivals")}
      </h3>
      {festivals.length === 0 ? (
        <p className="mt-2 text-sm text-encre/60">{t("emptyFestivals")}</p>
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
