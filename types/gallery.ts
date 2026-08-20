export type GalleryItem = {
  id: string;
  imageUrl: string | null;
  title: string;
  badge?: string;
  excerpt: string;
  description: string;
  credit?: string | null;
  href?: string;
  hrefLabel?: string;
};
