import Image from "next/image";
import { chapo, frise, langues, religion } from "@/lib/content/accueil";

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-nuit/10 bg-nuit text-chaux">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <p className="font-utility text-sm uppercase tracking-wide text-dune">
            {chapo.kicker}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
            {chapo.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-chaux/85">{chapo.body}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl text-nuit">
          Trois mille ans d&apos;histoire
        </h2>

        <ol className="mt-8 border-l-2 border-dune/60 pl-6">
          {frise.map((entry) => (
            <li key={entry.titre} className="relative pb-10 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-argile"
              />
              <p className="font-utility text-xs uppercase tracking-wide text-zellige">
                {entry.periode}
              </p>
              <h3 className="mt-1 font-display text-xl text-nuit">
                {entry.titre}
              </h3>
              {entry.image && (
                <figure className="mt-3">
                  <div className="relative aspect-video overflow-hidden rounded">
                    <Image
                      src={entry.image.src}
                      alt={entry.image.alt}
                      fill
                      sizes="(min-width: 640px) 42rem, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-1 font-utility text-xs text-encre/50">
                    {entry.image.credit}
                  </figcaption>
                </figure>
              )}
              <p className="mt-2 text-encre/85">{entry.texte}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-nuit/10 bg-white">
        <div className="mx-auto grid max-w-5xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl text-nuit">{langues.titre}</h2>
            <p className="mt-3 text-encre/85">{langues.intro}</p>
            <ul className="mt-4 flex flex-col gap-4">
              {langues.items.map((item) => (
                <li key={item.nom}>
                  <p className="font-medium text-nuit">{item.nom}</p>
                  <p className="text-encre/80">{item.texte}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-nuit">{religion.titre}</h2>
            <p className="mt-3 text-encre/85">{religion.texte}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
