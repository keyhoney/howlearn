import { AnyContent, ContentType, DomainSlug } from "./types";
import { domainInfo } from "./domains";
import { getMdxSlugs, getMdxBySlug } from "./content-files";

/** 카테고리(한글) → 도메인 슬러그. MDX frontmatter category를 domains로 변환할 때 사용 */
const CATEGORY_TO_DOMAIN: Record<string, DomainSlug> = Object.fromEntries(
  (Object.entries(domainInfo) as [DomainSlug, { name: string }][]).map(
    ([slug, { name }]) => [name, slug]
  )
);

function normalizeCategories(fm: Record<string, unknown>): string[] {
  const c = fm.category;
  if (!c) return [];
  if (Array.isArray(c)) return c.filter((x): x is string => typeof x === "string");
  return typeof c === "string" ? [c] : [];
}

function normalizeTags(fm: Record<string, unknown>): string[] {
  const t = fm.tags;
  if (!Array.isArray(t)) return [];
  return t.filter((x): x is string => typeof x === "string");
}

function categoriesToDomains(categories: string[]): DomainSlug[] {
  const out: DomainSlug[] = [];
  for (const cat of categories) {
    const slug = CATEGORY_TO_DOMAIN[cat];
    if (slug && !out.includes(slug)) out.push(slug);
  }
  return out;
}

function getStatus(fm: Record<string, unknown>): "draft" | "published" {
  const s = fm.status;
  return s === "draft" ? "draft" : "published";
}

function getDate(fm: Record<string, unknown>, key: string): string | undefined {
  const v = fm[key];
  if (v == null) return undefined;
  const s = String(v).trim();
  return s || undefined;
}

/** frontmatter related / relatedContentIds → "type-slug" 배열 (예: guide:math-anxiety → guide-math-anxiety) */
function normalizeRelatedIds(fm: Record<string, unknown>): string[] {
  const raw = fm.relatedContentIds ?? fm.related;
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is string => typeof x === "string")
    .map((s) => s.trim().replace(/^([^:-]+)[:]/, "$1-")) // guide:slug → guide-slug
    .filter(Boolean);
}

/** MDX frontmatter → AnyContent (목록/메타용). body는 상세에서 MDX 파일로 채움. */
function buildContentFromMdx(
  type: ContentType,
  slug: string,
  fm: Record<string, unknown>
): AnyContent {
  const id = `${type}-${slug}`;
  const title = (fm.title as string) || slug;
  const description = (fm.description as string) || (fm.summary as string) || "";
  const summary = description || title;
  const status = getStatus(fm);
  const categories = normalizeCategories(fm);
  const tags = normalizeTags(fm);
  const domains = categoriesToDomains(categories);
  const publishedAt = getDate(fm, "datePublished") ?? getDate(fm, "date");
  const coverImage = (fm.coverImage as string) || undefined;
  const ogImage = (fm.ogImage as string) || coverImage;
  const relatedIds = normalizeRelatedIds(fm);
  const featured = fm.featured === true;
  const base = {
    id,
    type,
    slug,
    title,
    summary,
    publishedAt,
    status,
    domains: domains.length ? domains : (["educational-psychology"] as DomainSlug[]),
    categories,
    tags,
    body: "",
    ...(coverImage && { coverImage }),
    ...(ogImage && { ogImage }),
    ...(relatedIds.length > 0 && { relatedContentIds: relatedIds }),
    ...(featured && { featured: true }),
  };

  if (type === "guide") {
    return {
      ...base,
      type: "guide" as const,
      intro: (fm.intro as string) || "",
      keyTakeaways: Array.isArray(fm.keyTakeaways) ? (fm.keyTakeaways as string[]) : [],
    };
  }
  if (type === "concept") {
    const shortDefinition = (fm.shortDefinition as string) || description || summary;
    return {
      ...base,
      type: "concept" as const,
      englishName: fm.englishName as string | undefined,
      shortDefinition,
    };
  }
  if (type === "toolkit") {
    return {
      ...base,
      type: "toolkit" as const,
      format: (fm.format as "checklist" | "template" | "worksheet") || undefined,
      estimatedTime: (fm.estimatedTime as string) || undefined,
    };
  }
  if (type === "book") {
    return {
      ...base,
      type: "book" as const,
      subtitle: fm.subtitle as string | undefined,
      purchaseLinks: Array.isArray(fm.purchaseLinks)
        ? (fm.purchaseLinks as { label: string; href: string }[])
        : undefined,
    };
  }
  return { ...base, type: "blog" as const };
}

/** content/*.mdx 파일만 읽어서 AnyContent[] 생성. draft 제외. */
function getContentFromMdx(): AnyContent[] {
  const types: ContentType[] = ["guide", "blog", "concept", "toolkit", "book"];
  const out: AnyContent[] = [];
  for (const type of types) {
    const slugs = getMdxSlugs(type);
    for (const slug of slugs) {
      const file = getMdxBySlug(type, slug);
      if (!file) continue;
      const status = getStatus(file.frontmatter);
      if (status === "draft") continue;
      out.push(buildContentFromMdx(type, slug, file.frontmatter));
    }
  }
  return out;
}

/** content/*.mdx에서만 목록 로드. published만 반환. */
export async function getAllContent(): Promise<AnyContent[]> {
  return getContentFromMdx().filter((c) => c.status === "published");
}

export async function getContentByType(type: ContentType): Promise<AnyContent[]> {
  const content = await getAllContent();
  return content.filter(c => c.type === type).sort((a, b) => {
    return new Date(b.publishedAt || "").getTime() - new Date(a.publishedAt || "").getTime();
  });
}

export async function getContentByDomain(domain: DomainSlug): Promise<AnyContent[]> {
  const content = await getAllContent();
  return content.filter(c => c.domains.includes(domain)).sort((a, b) => {
    return new Date(b.publishedAt || "").getTime() - new Date(a.publishedAt || "").getTime();
  });
}

export async function getContentBySlug(type: ContentType, slug: string): Promise<AnyContent | null> {
  const content = await getAllContent();
  return content.find(c => c.type === type && c.slug === slug) || null;
}

/** "type:slug" 또는 "type-slug" 문자열로 콘텐츠 목록 조회 (MDX 본문 RelatedCards 등에서 사용) */
export async function getContentByRefs(refs: string[]): Promise<AnyContent[]> {
  const out: AnyContent[] = [];
  for (const ref of refs) {
    const parsed = parseContentId(ref.trim().replace(/^([^:-]+):/, "$1-"));
    if (!parsed) continue;
    const item = await getContentBySlug(parsed.type, parsed.slug);
    if (item) out.push(item);
  }
  return out;
}

/** id 문자열 "type-slug"에서 type과 slug 분리 (slug에 하이픈 가능) */
function parseContentId(id: string): { type: ContentType; slug: string } | null {
  const parts = id.split("-");
  const type = parts[0] as ContentType;
  const validTypes: ContentType[] = ["guide", "blog", "concept", "toolkit", "book"];
  if (!validTypes.includes(type) || parts.length < 2) return null;
  return { type, slug: parts.slice(1).join("-") };
}

/** 관련 콘텐츠: MDX frontmatter related(수동) 있으면 우선 사용, 부족분은 태그·도메인 자동 보강 */
export async function getRelatedContent(content: AnyContent, limit = 6): Promise<AnyContent[]> {
  const all = await getAllContent();
  const related: AnyContent[] = [];
  const seen = new Set<string>([content.id]);

  // 0) frontmatter에 related / relatedContentIds 있으면 수동 지정 먼저
  const ids = content.relatedContentIds ?? [];
  for (const id of ids) {
    if (related.length >= limit) break;
    const parsed = parseContentId(id);
    if (!parsed) continue;
    const item = await getContentBySlug(parsed.type, parsed.slug);
    if (item && !seen.has(item.id)) {
      related.push(item);
      seen.add(item.id);
    }
  }

  // 1) 부족하면 태그 일치로 보강
  if (related.length < limit && content.tags.length > 0) {
    const byTag = all.filter(
      (c) => !seen.has(c.id) && c.tags.some((t) => content.tags.includes(t))
    );
    for (const c of byTag) {
      if (related.length >= limit) break;
      related.push(c);
      seen.add(c.id);
    }
  }

  // 2) 그래도 부족하면 도메인 일치로 보강
  if (related.length < limit && content.domains.length > 0) {
    const byDomain = all.filter(
      (c) =>
        !seen.has(c.id) &&
        c.domains.some((d) => content.domains.includes(d))
    );
    for (const c of byDomain) {
      if (related.length >= limit) break;
      related.push(c);
      seen.add(c.id);
    }
  }

  return related.slice(0, limit);
}

export async function getFeaturedContent(): Promise<AnyContent[]> {
  const content = await getAllContent();
  return content.filter(c => c.featured);
}

export async function getLatestContent(limit = 5): Promise<AnyContent[]> {
  const content = await getAllContent();
  return content.sort((a, b) => {
    return new Date(b.publishedAt || "").getTime() - new Date(a.publishedAt || "").getTime();
  }).slice(0, limit);
}

/** All unique tags across published content */
export async function getAllTags(): Promise<string[]> {
  const content = await getAllContent();
  const set = new Set<string>();
  for (const c of content) {
    for (const t of c.tags) set.add(t);
  }
  return Array.from(set);
}

/** Content that has the given tag (any type) */
export async function getContentByTag(tag: string): Promise<AnyContent[]> {
  const content = await getAllContent();
  return content
    .filter((c) => c.tags.includes(tag))
    .sort((a, b) => new Date(b.publishedAt || "").getTime() - new Date(a.publishedAt || "").getTime());
}

/** Content (guides, blog, toolkit; not concepts) that references this concept by slug or title in tags */
export async function getContentReferringToConcept(
  conceptSlug: string,
  conceptTitle: string,
  limit = 8
): Promise<{ type: ContentType; slug: string; title: string; path: string }[]> {
  const all = await getAllContent();
  const typeToPath: Record<ContentType, string> = {
    guide: "/guides",
    blog: "/blog",
    concept: "/concepts",
    toolkit: "/toolkit",
    book: "/books",
  };
  const normalizedSlug = conceptSlug.toLowerCase().trim();
  const normalizedTitle = conceptTitle.toLowerCase().trim();
  const out: { type: ContentType; slug: string; title: string; path: string }[] = [];
  for (const c of all) {
    if (c.type === "concept") continue;
    const tagMatch = c.tags.some((t) => {
      const n = t.toLowerCase().trim();
      return n === normalizedSlug || n === normalizedTitle;
    });
    if (tagMatch) {
      out.push({
        type: c.type,
        slug: c.slug,
        title: c.title,
        path: `${typeToPath[c.type]}/${c.slug}`,
      });
    }
  }
  return out.slice(0, limit);
}
