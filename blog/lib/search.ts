import type { AnyContent, ContentType, DomainSlug } from "@/lib/types";

/**
 * 검색(Fuse) + 카드 목록에 필요한 최소 필드만 담아 클라이언트 페이로드를 줄입니다.
 * body·references·relatedContentIds 등 목록/검색에 불필요한 필드는 제외합니다.
 */
export type SearchableContent = {
  id: string;
  type: ContentType;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  domains: DomainSlug[];
  publishedAt?: string;
  /** concept */
  englishName?: string;
  shortDefinition?: string;
};

export function toSearchableContent(c: AnyContent): SearchableContent {
  const base: SearchableContent = {
    id: c.id,
    type: c.type,
    slug: c.slug,
    title: c.title,
    summary: c.summary,
    tags: c.tags,
    domains: c.domains,
    ...(c.publishedAt && { publishedAt: c.publishedAt }),
  };
  if (c.type === "concept" && "englishName" in c) {
    if (c.englishName) base.englishName = c.englishName;
    if ("shortDefinition" in c && c.shortDefinition)
      base.shortDefinition = c.shortDefinition;
  }
  return base;
}

export function toSearchableContentList(all: AnyContent[]): SearchableContent[] {
  return all.map(toSearchableContent);
}
