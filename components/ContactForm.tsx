"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { REGION_LABELS, REGIONS } from "@/lib/labels";
import type { Region } from "@/types/database";

export function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState<Region>("centre");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.from("volunteer_requests").insert({
      full_name: fullName,
      email,
      region,
      message: message.trim() ? message : null,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage("Impossible d'envoyer votre demande. Réessayez.");
      return;
    }

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <p role="status" className="rounded border border-zellige/30 bg-zellige/10 p-4 text-zellige">
        Merci ! Votre demande a bien été envoyée, nous vous recontactons
        bientôt.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="fullName" className="font-utility text-sm uppercase tracking-wide text-nuit">
          Nom complet
        </label>
        <input
          id="fullName"
          type="text"
          required
          minLength={2}
          maxLength={120}
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="rounded border border-nuit/30 bg-white px-3 py-2 text-encre"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="font-utility text-sm uppercase tracking-wide text-nuit">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded border border-nuit/30 bg-white px-3 py-2 text-encre"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="region" className="font-utility text-sm uppercase tracking-wide text-nuit">
          Région où vous pouvez accueillir des voyageurs
        </label>
        <select
          id="region"
          value={region}
          onChange={(event) => setRegion(event.target.value as Region)}
          className="rounded border border-nuit/30 bg-white px-3 py-2 text-encre"
        >
          {REGIONS.map((value) => (
            <option key={value} value={value}>
              {REGION_LABELS[value]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="font-utility text-sm uppercase tracking-wide text-nuit">
          Message (facultatif)
        </label>
        <textarea
          id="message"
          rows={5}
          maxLength={2000}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="rounded border border-nuit/30 bg-white px-3 py-2 text-encre"
        />
      </div>

      {errorMessage && (
        <p role="alert" className="text-sm text-argile">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded bg-argile px-4 py-2 font-utility text-sm uppercase tracking-wide text-chaux hover:bg-nuit disabled:opacity-60"
      >
        {isSubmitting ? "Envoi…" : "Envoyer ma candidature"}
      </button>
    </form>
  );
}
