import type { Database } from "@/types/database";
import type { GalleryItem } from "@/types/gallery";
import { getRegionLabels } from "@/lib/labels";

type Recipe = Database["public"]["Tables"]["recipes"]["Row"];
type Place = Database["public"]["Tables"]["places"]["Row"];
type Post = Database["public"]["Tables"]["posts"]["Row"];

export function postToGalleryItem(
  post: Pick<Post, "id" | "title" | "body" | "region">,
  username: string | undefined,
  imageUrl: string | null,
  locale: string,
): GalleryItem {
  const isEn = locale === "en";
  return {
    id: post.id,
    imageUrl,
    title: post.title,
    badge: getRegionLabels(locale)[post.region],
    excerpt: post.body,
    description: post.body,
    credit: username ? (isEn ? `Photo by ${username}` : `Photo de ${username}`) : null,
    href: `/${locale}/blog/${post.id}`,
    hrefLabel: isEn ? "View post" : "Voir la publication",
  };
}

export function recipeToGalleryItem(
  recipe: Recipe,
  imageUrl: string | null,
  locale: string,
): GalleryItem {
  const isEn = locale === "en";
  return {
    id: recipe.id,
    imageUrl,
    title: recipe.title,
    badge: getRegionLabels(locale)[recipe.region],
    excerpt: recipe.ingredients,
    description: isEn
      ? `Ingredients\n${recipe.ingredients}\n\nSteps\n${recipe.steps}`
      : `Ingrédients\n${recipe.ingredients}\n\nÉtapes\n${recipe.steps}`,
    credit: recipe.image_credit,
  };
}

export function placeToGalleryItem(
  place: Place,
  imageUrl: string | null,
  locale: string,
): GalleryItem {
  return {
    id: place.id,
    imageUrl,
    title: place.name,
    badge: place.category ?? getRegionLabels(locale)[place.region],
    excerpt: place.description,
    description: place.description,
    credit: place.image_credit,
  };
}
