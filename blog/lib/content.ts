import { cache } from "react";
import { AnyContent, ContentType, DomainSlug, type FaqItem } from "./types";
import { domainInfo } from "./domains";
import contentIndex from "@/data/content-index.json";

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

/** frontmatter references → { title?, url }[] */
function normalizeReferences(fm: Record<string, unknown>): { title?: string; url: string }[] {
  const raw = fm.references;
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((r): r is Record<string, unknown> => typeof r === "object" && r !== null && typeof (r as { url?: string }).url === "string")
    .map((r) => ({
      title: typeof (r as { title?: string }).title === "string" ? (r as { title: string }).title : undefined,
      url: (r as { url: string }).url,
    }));
}

/** frontmatter faq → FaqItem[] (가이드 FAQ를 MDX 속성 대신 전달할 때 사용). 페이지에서 mdxFile.frontmatter로 직접 읽을 때 사용 */
export function getFaqFromFrontmatter(fm: Record<string, unknown> | null | undefined): FaqItem[] {
  if (!fm || typeof fm !== "object") return [];
  const raw = fm.faq;
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((r): r is Record<string, unknown> => typeof r === "object" && r !== null && "question" in r && "answer" in r)
    .map((r) => ({
      question: String(r.question ?? ""),
      answer: String(r.answer ?? ""),
    }))
    .filter((x) => x.question.length > 0);
}

function normalizeFaq(fm: Record<string, unknown>): FaqItem[] {
  return getFaqFromFrontmatter(fm);
}

/** MDX frontmatter + body → AnyContent */
function buildContentFromMdx(
  type: ContentType,
  slug: string,
  fm: Record<string, unknown>,
  body: string
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
  const updatedAt = getDate(fm, "dateModified");
  const reviewedAt = getDate(fm, "dateReviewed") ?? updatedAt;
  const coverImage = (fm.coverImage as string) || undefined;
  const ogImage = (fm.ogImage as string) || coverImage;
  const relatedIds = normalizeRelatedIds(fm);
  const refs = normalizeReferences(fm);
  const featured = fm.featured === true;
  const author = typeof fm.author === "string" ? fm.author : undefined;
  const lang = typeof fm.lang === "string" ? fm.lang : undefined;
  const safeDomains = Array.isArray(domains) ? domains : (["educational-psychology"] as DomainSlug[]);
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeTags = Array.isArray(tags) ? tags : [];
  const base = {
    id,
    type,
    slug,
    title,
    summary,
    publishedAt,
    status,
    domains: safeDomains.length ? safeDomains : (["educational-psychology"] as DomainSlug[]),
    categories: safeCategories,
    tags: safeTags,
    body,
    ...(coverImage && { coverImage }),
    ...(ogImage && { ogImage }),
    ...(relatedIds.length > 0 && { relatedContentIds: relatedIds }),
    ...(featured && { featured: true }),
    ...(updatedAt && { updatedAt }),
    ...(reviewedAt && { reviewedAt }),
    ...(refs.length > 0 && { references: refs }),
    ...(author && { author }),
    ...(lang && { lang }),
  };

  if (type === "guide") {
    const faq = normalizeFaq(fm);
    return {
      ...base,
      type: "guide" as const,
      intro: (fm.intro as string) || "",
      ...(faq.length > 0 && { faq }),
    };
  }
  if (type === "concept") {
    const shortDefinition = (fm.shortDefinition as string) || description || summary;
    const faq = normalizeFaq(fm);
    return {
      ...base,
      type: "concept" as const,
      englishName: fm.englishName as string | undefined,
      shortDefinition,
      ...(faq.length > 0 && { faq }),
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
  // 알 수 없는 타입 (content 타입 목록과 frontmatter 불일치 시)
  throw new Error(`buildContentFromMdx: unsupported type ${type} for slug ${slug}`);
}

type ContentIndexes = {
  all: AnyContent[];
  byTypeSlug: Map<string, AnyContent>;
  conceptSlugs: string[];
};

const getContentIndexesCached = cache((): ContentIndexes => {
  // Cloudflare Workers 런타임 호환성을 위해 런타임 fs 스캔 대신
  // 빌드 산출물(data/content-index.json)만 단일 소스로 사용합니다.
  const all = (contentIndex as AnyContent[]).filter((c) => c.status === "published");
  const byTypeSlug = new Map<string, AnyContent>();
  const conceptSlugs: string[] = [];
  for (const item of all) {
    byTypeSlug.set(`${item.type}:${item.slug}`, item);
    if (item.type === "concept") conceptSlugs.push(item.slug);
  }
  return { all, byTypeSlug, conceptSlugs };
});

/** content/*.mdx에서만 목록 로드. published만 반환. */
export async function getAllContent(): Promise<AnyContent[]> {
  return getContentIndexesCached().all;
}

/** 발행된 개념 슬러그 목록(링크 가드/MDX 컴포넌트용) */
export async function getPublishedConceptSlugs(): Promise<string[]> {
  return getContentIndexesCached().conceptSlugs;
}

export async function getContentByType(type: ContentType): Promise<AnyContent[]> {
  const content = await getAllContent();
  return content.filter(c => c.type === type).sort((a, b) => {
    return new Date(b.publishedAt || "").getTime() - new Date(a.publishedAt || "").getTime();
  });
}

/** 서버/클라이언트 공용: 검색어 q에 항목이 매칭되는지 (ContentHubFilters와 동일 로직) */
export function matchesSearchForFilter(item: AnyContent, q: string): boolean {
  const lower = q.trim().toLowerCase();
  if (!lower) return true;
  if (item.title.toLowerCase().includes(lower)) return true;
  if (item.summary?.toLowerCase().includes(lower)) return true;
  if (Array.isArray(item.tags) && item.tags.some((t) => String(t).toLowerCase().includes(lower))) return true;
  if (Array.isArray(item.categories) && item.categories.some((c) => String(c).toLowerCase().includes(lower))) return true;
  if (item.type === "concept" && "shortDefinition" in item && String(item.shortDefinition).toLowerCase().includes(lower))
    return true;
  return false;
}

export interface FilterContentOptions {
  q?: string;
  domain?: string;
  tag?: string;
}

/** 서버 필터: q, domain, tag 적용 (정렬 순서 유지) */
export function filterContentByQuery(content: AnyContent[], opts: FilterContentOptions): AnyContent[] {
  let list = content;
  if (opts.q?.trim()) {
    list = list.filter((c) => matchesSearchForFilter(c, opts.q!));
  }
  if (opts.domain) {
    list = list.filter((c) => Array.isArray(c.domains) && c.domains.includes(opts.domain as DomainSlug));
  }
  if (opts.tag) {
    const tag = opts.tag;
    list = list.filter((c) => Array.isArray(c.tags) && c.tags.includes(tag));
  }
  return list;
}

export { isAllowedPerPage, type PerPageOption } from "./pagination";

/** 1-based page, perPage로 슬라이스. totalPages 포함. */
export function paginateContent<T>(items: T[], page: number, perPage: number): { items: T[]; totalCount: number; totalPages: number } {
  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const start = (safePage - 1) * perPage;
  const itemsSlice = items.slice(start, start + perPage);
  return { items: itemsSlice, totalCount, totalPages };
}

/** 도메인 선택 시 드롭다운에 쓸 태그 목록 (해당 도메인 콘텐츠에 실제로 쓰인 태그만, 개념명 등 자유 태그 허용) */
export function getAvailableTagsForDomain(content: AnyContent[], domain?: string): string[] {
  let list = content;
  if (domain) list = list.filter((c) => c.domains.includes(domain as DomainSlug));
  const tagSet = new Set<string>();
  list.forEach((c) => c.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

export async function getContentByDomain(domain: DomainSlug): Promise<AnyContent[]> {
  const content = await getAllContent();
  return content.filter(c => c.domains.includes(domain)).sort((a, b) => {
    return new Date(b.publishedAt || "").getTime() - new Date(a.publishedAt || "").getTime();
  });
}

export async function getContentBySlug(type: ContentType, slug: string): Promise<AnyContent | null> {
  const { byTypeSlug } = getContentIndexesCached();
  return byTypeSlug.get(`${type}:${slug}`) ?? null;
}

/** "type:slug" 또는 "type-slug" 문자열로 콘텐츠 목록 조회 (프로그램matic 연결용) */
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
  const validTypes: ContentType[] = ["guide", "concept", "toolkit", "book"];
  if (!validTypes.includes(type) || parts.length < 2) return null;
  return { type, slug: parts.slice(1).join("-") };
}

/** 관련 콘텐츠: MDX frontmatter related(수동) 있으면 우선 사용, 부족분은 태그·도메인 자동 보강 */
export async function getRelatedContent(content: AnyContent, limit = 6): Promise<AnyContent[]> {
  const { all, byTypeSlug } = getContentIndexesCached();
  const related: AnyContent[] = [];
  const seen = new Set<string>([content.id]);

  // 0) frontmatter에 related / relatedContentIds 있으면 수동 지정 먼저
  const ids = content.relatedContentIds ?? [];
  for (const id of ids) {
    if (related.length >= limit) break;
    const parsed = parseContentId(id);
    if (!parsed) continue;
    const item = byTypeSlug.get(`${parsed.type}:${parsed.slug}`) ?? null;
    if (item && !seen.has(item.id)) {
      related.push(item);
      seen.add(item.id);
    }
  }

  const contentTags = Array.isArray(content.tags) ? content.tags : [];
  const contentDomains = Array.isArray(content.domains) ? content.domains : [];

  // 1) 부족하면 태그 일치로 보강
  if (related.length < limit && contentTags.length > 0) {
    const byTag = all.filter(
      (c) => !seen.has(c.id) && Array.isArray(c.tags) && c.tags.some((t) => contentTags.includes(t))
    );
    for (const c of byTag) {
      if (related.length >= limit) break;
      related.push(c);
      seen.add(c.id);
    }
  }

  // 2) 그래도 부족하면 도메인 일치로 보강
  if (related.length < limit && contentDomains.length > 0) {
    const byDomain = all.filter(
      (c) =>
        !seen.has(c.id) &&
        Array.isArray(c.domains) &&
        c.domains.some((d) => contentDomains.includes(d))
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
    const tags = Array.isArray(c.tags) ? c.tags : [];
    for (const t of tags) set.add(String(t));
  }
  return Array.from(set);
}

/** Content that has the given tag (any type) */
export async function getContentByTag(tag: string): Promise<AnyContent[]> {
  const content = await getAllContent();
  return content
    .filter((c) => Array.isArray(c.tags) && c.tags.includes(tag))
    .sort((a, b) => new Date(b.publishedAt || "").getTime() - new Date(a.publishedAt || "").getTime());
}

/** Content (guides, toolkit; not concepts) that references this concept by slug or title in tags */
export async function getContentReferringToConcept(
  conceptSlug: string,
  conceptTitle: string,
  limit = 8
): Promise<{ type: ContentType; slug: string; title: string; path: string }[]> {
  const all = await getAllContent();
  const typeToPath: Record<ContentType, string> = {
    guide: "/guides",
    concept: "/concepts",
    toolkit: "/toolkit",
    book: "/books",
  };
  const normalizedSlug = conceptSlug.toLowerCase().trim();
  const normalizedTitle = conceptTitle.toLowerCase().trim();
  const out: { type: ContentType; slug: string; title: string; path: string }[] = [];
  for (const c of all) {
    if (c.type === "concept") continue;
    const tags = Array.isArray(c.tags) ? c.tags : [];
    const tagMatch = tags.some((t) => {
      const n = String(t).toLowerCase().trim();
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
