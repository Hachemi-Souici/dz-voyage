import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = { title: "Devenir guide bénévole" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-nuit">Devenir guide bénévole</h1>
      <p className="mt-3 text-encre/85">
        Vous connaissez votre région et aimez la faire découvrir ? Devenez
        guide bénévole pour accompagner les visiteurs qui traversent
        l&apos;Algérie. Laissez vos coordonnées et la région où vous pouvez
        accueillir des voyageurs — nous vous recontactons.
      </p>

      <div className="mt-10">
        <ContactForm />
      </div>
    </div>
  );
}
