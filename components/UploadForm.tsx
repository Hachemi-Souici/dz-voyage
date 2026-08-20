"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { compressImages } from "@/lib/image";
import { REGION_LABELS, TYPE_LABELS } from "@/lib/labels";
import type { PostDetails, PostType, Region } from "@/types/database";

export function UploadForm({ authorId }: { authorId: string }) {
  const [type, setType] = useState<PostType>("nature");
  const [region, setRegion] = useState<Region>("centre");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [isDessert, setIsDessert] = useState(false);
  const [placeName, setPlaceName] = useState("");
  const [category, setCategory] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotosChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhotos(Array.from(event.target.files ?? []));
  };

  const resetForm = () => {
    setTitle("");
    setBody("");
    setIngredients("");
    setSteps("");
    setIsDessert(false);
    setPlaceName("");
    setCategory("");
    setPhotos([]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (photos.length === 0) {
      setErrorMessage("Ajoutez au moins une photo.");
      return;
    }
    if (type === "recette" && (!ingredients.trim() || !steps.trim())) {
      setErrorMessage("Renseignez les ingrédients et les étapes de la recette.");
      return;
    }
    if (type === "lieu" && !placeName.trim()) {
      setErrorMessage("Renseignez le nom du lieu.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    const details: PostDetails =
      type === "recette"
        ? { ingredients, steps, isDessert }
        : type === "lieu"
          ? { name: placeName, category }
          : {};

    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({ author_id: authorId, type, region, title, body, details })
      .select("id")
      .single();

    if (postError || !post) {
      setErrorMessage("Impossible d'enregistrer la publication. Réessayez.");
      setIsSubmitting(false);
      return;
    }

    const compressedPhotos = await compressImages(photos);

    for (const [index, photo] of compressedPhotos.entries()) {
      const storagePath = `${authorId}/${post.id}/${index}-${photo.name}`;

      const { error: uploadError } = await supabase.storage
        .from("post-photos")
        .upload(storagePath, photo, { contentType: photo.type });

      if (uploadError) {
        setErrorMessage("Publication enregistrée mais l'envoi d'une photo a échoué.");
        setIsSubmitting(false);
        return;
      }

      await supabase
        .from("post_photos")
        .insert({ post_id: post.id, storage_path: storagePath, position: index });
    }

    await fetch("/api/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post.id }),
    });

    setIsSubmitting(false);
    setSuccessMessage(
      "Publication envoyée ! Elle sera visible après validation manuelle des photos.",
    );
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="font-utility text-sm uppercase tracking-wide text-nuit">
          Type de publication
        </legend>
        <div className="flex flex-wrap gap-4">
          {(Object.keys(TYPE_LABELS) as PostType[]).map((value) => (
            <label key={value} className="flex items-center gap-2 text-encre">
              <input
                type="radio"
                name="type"
                value={value}
                checked={type === value}
                onChange={() => setType(value)}
              />
              {TYPE_LABELS[value]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1">
        <label htmlFor="region" className="font-utility text-sm uppercase tracking-wide text-nuit">
          Région
        </label>
        <select
          id="region"
          value={region}
          onChange={(event) => setRegion(event.target.value as Region)}
          className="rounded border border-nuit/30 bg-white px-3 py-2 text-encre"
        >
          {(Object.keys(REGION_LABELS) as Region[]).map((value) => (
            <option key={value} value={value}>
              {REGION_LABELS[value]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="font-utility text-sm uppercase tracking-wide text-nuit">
          Titre
        </label>
        <input
          id="title"
          type="text"
          required
          minLength={3}
          maxLength={120}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="rounded border border-nuit/30 bg-white px-3 py-2 text-encre"
        />
      </div>

      {type === "lieu" && (
        <>
          <div className="flex flex-col gap-1">
            <label htmlFor="placeName" className="font-utility text-sm uppercase tracking-wide text-nuit">
              Nom du lieu
            </label>
            <input
              id="placeName"
              type="text"
              required
              value={placeName}
              onChange={(event) => setPlaceName(event.target.value)}
              className="rounded border border-nuit/30 bg-white px-3 py-2 text-encre"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="category" className="font-utility text-sm uppercase tracking-wide text-nuit">
              Catégorie (site antique, plage, montagne…)
            </label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded border border-nuit/30 bg-white px-3 py-2 text-encre"
            />
          </div>
        </>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="body" className="font-utility text-sm uppercase tracking-wide text-nuit">
          {type === "lieu" ? "Description" : "Récit"}
        </label>
        <textarea
          id="body"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="rounded border border-nuit/30 bg-white px-3 py-2 text-encre"
        />
      </div>

      {type === "recette" && (
        <>
          <div className="flex flex-col gap-1">
            <label htmlFor="ingredients" className="font-utility text-sm uppercase tracking-wide text-nuit">
              Ingrédients
            </label>
            <textarea
              id="ingredients"
              required
              rows={4}
              value={ingredients}
              onChange={(event) => setIngredients(event.target.value)}
              className="rounded border border-nuit/30 bg-white px-3 py-2 text-encre"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="steps" className="font-utility text-sm uppercase tracking-wide text-nuit">
              Étapes de préparation
            </label>
            <textarea
              id="steps"
              required
              rows={4}
              value={steps}
              onChange={(event) => setSteps(event.target.value)}
              className="rounded border border-nuit/30 bg-white px-3 py-2 text-encre"
            />
          </div>
          <label className="flex items-center gap-2 text-encre">
            <input
              type="checkbox"
              checked={isDessert}
              onChange={(event) => setIsDessert(event.target.checked)}
            />
            C&apos;est un gâteau / dessert
          </label>
        </>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="photos" className="font-utility text-sm uppercase tracking-wide text-nuit">
          Photos
        </label>
        <input
          id="photos"
          type="file"
          accept="image/*"
          multiple
          required
          onChange={handlePhotosChange}
          className="text-encre"
        />
        <p className="text-xs text-encre/60">
          Vos photos seront taguées avec votre pseudo et passeront par une
          validation manuelle avant publication.
        </p>
      </div>

      {errorMessage && (
        <p role="alert" className="text-sm text-argile">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p role="status" className="text-sm text-zellige">
          {successMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-argile px-4 py-2 font-utility text-sm uppercase tracking-wide text-chaux hover:bg-nuit disabled:opacity-60"
      >
        {isSubmitting ? "Envoi…" : "Publier"}
      </button>
    </form>
  );
}
