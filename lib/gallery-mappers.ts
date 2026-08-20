import type { Database } from "@/types/database";
import type { GalleryItem } from "@/types/gallery";
import { REGION_LABELS } from "@/lib/labels";

type Recipe = Database["public"]["Tables"]["recipes"]["Row"];
type Place = Database["public"]["Tables"]["places"]["Row"];
type Post = Database["public"]["Tables"]["posts"]["Row"];

export function postToGalleryItem(
  post: Pick<Post, "id" | "title" | "body" | "region">,
  username: string | undefined,
  imageUrl: string | null,
): GalleryItem {
  return {
    id: post.id,
    imageUrl,
    title: post.title,
    badge: REGION_LABELS[post.region],
    excerpt: post.body,
    description: post.body,
    credit: username ? `Photo de ${username}` : null,
    href: `/blog/${post.id}`,
    hrefLabel: "Voir la publication",
  };
}

export function recipeToGalleryItem(recipe: Recipe, imageUrl: string | null): GalleryItem {
  return {
    id: recipe.id,
    imageUrl,
    title: recipe.title,
    badge: REGION_LABELS[recipe.region],
    excerpt: recipe.ingredients,
    description: `Ingrédients\n${recipe.ingredients}\n\nÉtapes\n${recipe.steps}`,
    credit: recipe.image_credit,
  };
}

export function placeToGalleryItem(place: Place, imageUrl: string | null): GalleryItem {
  return {
    id: place.id,
    imageUrl,
    title: place.name,
    badge: place.category ?? REGION_LABELS[place.region],
    excerpt: place.description,
    description: place.description,
    credit: place.image_credit,
  };
}
