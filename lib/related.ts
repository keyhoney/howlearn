import {
  getAllForArchive,
  getAllByType,
  normalizeTags,
  type ContentType,
} from "./content";
import { fullPath } from "./content-path";

export function getRelatedByTags(
  tags: string[],
  excludeType: ContentType,
  excludeSlug: string,
  limit: number = 6
): { type: ContentType; slug: string; title: string; path: string }[] {
  if (tags.length === 0) return [];
  const set = new Set(tags.map((t) => t.toLowerCase()));
  const items = getAllForArchive()
    .filter(
      (item) =>
        (item.type !== excludeType || item.slug !== excludeSlug) &&
        normalizeTags(item.frontmatter).some((t) => set.has(t.toLowerCase()))
    )
    .slice(0, limit)
    .map((item) => ({
      type: item.type,
      slug: item.slug,
      title: (item.frontmatter.title as string) || item.slug,
      path: fullPath(item.type, item.slug),
    }));
  return items;
}

export function getContentReferringToConcept(
  conceptSlug: string,
  conceptTitle: string,
  limit: number = 8
): { type: ContentType; slug: string; title: string; path: string }[] {
  const archive = getAllForArchive();
  const slugLower = conceptSlug.toLowerCase();
  const titleLower = conceptTitle.toLowerCase();
  return archive
    .filter((item) => {
      const tags = normalizeTags(item.frontmatter);
      return tags.some(
        (t) => t.toLowerCase() === slugLower || t.toLowerCase() === titleLower
      );
    })
    .slice(0, limit)
    .map((item) => ({
      type: item.type,
      slug: item.slug,
      title: (item.frontmatter.title as string) || item.slug,
      path: fullPath(item.type, item.slug),
    }));
}

export function getConceptsBySlugs(slugs: string[]): { slug: string; title: string; path: string }[] {
  const list = getAllByType("concepts");
  const set = new Set(slugs.map((s) => s.toLowerCase()));
  return list
    .filter((item) => set.has(item.slug.toLowerCase()))
    .map((item) => ({
      slug: item.slug,
      title: (item.frontmatter.title as string) || item.slug,
      path: fullPath("concepts", item.slug),
    }));
}
