"use client";

import { useRouter } from "@/i18n/navigation";
import { PhotoGallery } from "@/components/PhotoGallery";
import type { GalleryItem } from "@/types/gallery";

type Props = {
  items: GalleryItem[];
  emptyMessage: string;
  deleteLabel: string;
  confirmMessage: string;
};

/** Galerie "Mes publications" avec option de suppression (auteur). */
export function MyPostsGallery({ items, emptyMessage, deleteLabel, confirmMessage }: Props) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!window.confirm(confirmMessage)) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <PhotoGallery
      items={items}
      emptyMessage={emptyMessage}
      columns="1-2-3"
      onDelete={handleDelete}
      deleteLabel={deleteLabel}
    />
  );
}
