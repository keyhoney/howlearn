export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export type OgContentType = 'guides' | 'columns' | 'concepts' | 'books';

export function getAutoOgImagePath(type: OgContentType, slug: string): string {
  return `/og/auto/${type}/${slug}.png`;
}

export function resolveOgImageUrl(params: {
  type: OgContentType;
  slug: string;
  coverImage?: string | null;
  ogImage?: string | null;
}): string {
  const manual = params.coverImage?.trim() || params.ogImage?.trim();
  if (manual) return manual;
  return getAutoOgImagePath(params.type, params.slug);
}

export function toAbsoluteOgImageUrl(imagePath: string, siteUrl: string): string {
  return new URL(imagePath, siteUrl).toString();
}
