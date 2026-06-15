/**
 * 콘텐츠 컬렉션 조회 유틸
 *
 * 기본 규칙: status === 'published' 인 항목만 반환.
 * draft 콘텐츠는 개발 서버에서도 목록/라우트에 노출하지 않는다.
 * (Tina 에디터 내부 미리보기는 Tina 자체 UI에서 처리)
 */

import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import {
  buildConceptLinkRegistry,
  buildConceptMentions,
  type ConceptLinkRegistry,
  type ConceptMention,
} from './concept-links';

export type { ConceptMention };

type FaqLike = { question: string; answer: string };

/** 본문(+선택 FAQ)에서 언급된 개념 목록 */
export function getConceptsInArticle(
  body: string,
  registry: ConceptLinkRegistry,
  options?: { excludeSlug?: string; faq?: FaqLike[] },
): ConceptMention[] {
  const faqText = (options?.faq ?? []).map((item) => item.answer).join('\n');
  const source = [body, faqText].filter(Boolean).join('\n');
  return buildConceptMentions(source, registry, {
    excludeSlugs: options?.excludeSlug ? [options.excludeSlug] : undefined,
  });
}

// ─── 발행 필터 ───────────────────────────────────────────────────

/** 콘텐츠 컬렉션에서 published 항목만 반환한다 */
export async function getPublishedGuides() {
  return (await getCollection('guides')).filter(
    (e) => e.data.status === 'published',
  );
}

export async function getFeaturedGuides(limit = 5) {
  const guides = await getPublishedGuides();
  return guides
    .filter((entry) => entry.data.featured)
    .sort((a, b) => {
      const ad = a.data.publishedAt?.valueOf() ?? 0;
      const bd = b.data.publishedAt?.valueOf() ?? 0;
      return bd - ad;
    })
    .slice(0, limit);
}

export async function getPublishedConcepts() {
  return (await getCollection('concepts')).filter(
    (e) => e.data.status === 'published',
  );
}

export async function getPublishedConceptLinkRegistry(): Promise<ConceptLinkRegistry> {
  const concepts = await getPublishedConcepts();
  return buildConceptLinkRegistry(concepts);
}

export async function getPublishedBooks() {
  return (await getCollection('books')).filter(
    (e) => e.data.status === 'published',
  );
}

export async function getPublishedColumns() {
  return (await getCollection('columns')).filter(
    (e) => e.data.status === 'published',
  );
}

export type ContentDomain = 'guides' | 'concepts' | 'books' | 'columns';
export type AnyContentEntry =
  | CollectionEntry<'guides'>
  | CollectionEntry<'concepts'>
  | CollectionEntry<'books'>
  | CollectionEntry<'columns'>;

export type FilterOptions = {
  q?: string;
  domain?: ContentDomain | 'all';
  tag?: string;
};

export type PaginationResult<T> = {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
};

export async function getContentByType(domain: ContentDomain): Promise<AnyContentEntry[]> {
  switch (domain) {
    case 'guides':
      return await getPublishedGuides();
    case 'concepts':
      return await getPublishedConcepts();
    case 'books':
      return await getPublishedBooks();
    case 'columns':
      return await getPublishedColumns();
  }
}

export async function getAllContent(): Promise<AnyContentEntry[]> {
  const [guides, concepts, books, columns] = await Promise.all([
    getPublishedGuides(),
    getPublishedConcepts(),
    getPublishedBooks(),
    getPublishedColumns(),
  ]);
  return [...guides, ...concepts, ...books, ...columns];
}

export async function getContentBySlug(
  domain: ContentDomain,
  slug: string,
): Promise<AnyContentEntry | undefined> {
  const entry = await getEntry(domain, slug);
  if (!entry || entry.data.status !== 'published') return undefined;
  return entry as AnyContentEntry;
}

function normalizedIncludes(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

export function filterContentByQuery(
  items: AnyContentEntry[],
  options: FilterOptions,
): AnyContentEntry[] {
  const { q, domain = 'all', tag } = options;

  return items.filter((item) => {
    if (domain !== 'all' && item.collection !== domain) return false;
    if (tag && !item.data.tags.includes(tag)) return false;
    if (!q) return true;

    const keywords = [
      item.data.title,
      item.data.summary,
      ...(item.data.tags ?? []),
      ...(item.data.domains ?? []),
      ...(item.data.categories ?? []),
    ].join(' ');

    return normalizedIncludes(keywords, q);
  });
}

export function paginateContent<T>(
  items: T[],
  page = 1,
  pageSize = 12,
): PaginationResult<T> {
  const currentPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  return {
    items: items.slice(start, end),
    currentPage: safePage,
    totalPages,
    totalItems,
    pageSize,
  };
}

export function getAvailableTagsForDomain(
  items: AnyContentEntry[],
  domain: ContentDomain | 'all',
): string[] {
  const target =
    domain === 'all' ? items : items.filter((item) => item.collection === domain);
  return Array.from(new Set(target.flatMap((item) => item.data.tags ?? []))).sort(
    (a, b) => a.localeCompare(b, 'ko'),
  );
}

export async function getRelatedContent(
  item: AnyContentEntry,
  limit = 6,
): Promise<AnyContentEntry[]> {
  const all = await getAllContent();
  const currentContentId = toContentIndexId(item);
  const manualIds = item.data.relatedContentIds ?? [];
  const byContentId = new Map(all.map((entry) => [toContentIndexId(entry), entry]));
  const manualItems = manualIds
    .map((id) => byContentId.get(id))
    .filter((entry): entry is AnyContentEntry => entry != null && toContentIndexId(entry) !== currentContentId)
    .slice(0, limit);
  const manualIdSet = new Set(manualItems.map(toContentIndexId));
  if (manualItems.length >= limit) return manualItems;

  const tokenizedSource = tokenizeText(`${item.data.title} ${item.data.summary}`);
  const sourceDomains = new Set(item.data.domains ?? []);
  const sourceTags = new Set(item.data.tags ?? []);
  const sourceCategories = new Set(item.data.categories ?? []);

  const fallbackItems = all
    .filter((candidate) => {
      const candidateId = toContentIndexId(candidate);
      if (candidateId === currentContentId) return false;
      return !manualIdSet.has(candidateId);
    })
    .map((candidate) => {
      const domainOverlap = getOverlapCount(sourceDomains, new Set(candidate.data.domains ?? []));
      const tagOverlap = getOverlapCount(sourceTags, new Set(candidate.data.tags ?? []));
      const categoryOverlap = getOverlapCount(sourceCategories, new Set(candidate.data.categories ?? []));
      const tokenOverlap = getOverlapCount(
        new Set(tokenizedSource),
        new Set(tokenizeText(`${candidate.data.title} ${candidate.data.summary}`)),
      );

      let score = 0;
      if (candidate.collection === item.collection) score += 20;
      score += domainOverlap * 12;
      score += tagOverlap * 8;
      score += categoryOverlap * 4;
      score += Math.min(20, tokenOverlap * 2);

      return { candidate, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const ad = a.candidate.data.publishedAt?.valueOf() ?? 0;
      const bd = b.candidate.data.publishedAt?.valueOf() ?? 0;
      return bd - ad;
    })
    .slice(0, Math.max(0, limit - manualItems.length))
    .map((v) => v.candidate);

  return [...manualItems, ...fallbackItems];
}

function toContentIndexId(item: AnyContentEntry): string {
  const prefix: Record<ContentDomain, string> = {
    guides: 'guide',
    concepts: 'concept',
    books: 'book',
    columns: 'column',
  };
  return `${prefix[item.collection]}-${item.id}`;
}

export async function getContentReferringToConcept(
  conceptSlug: string,
  limit = 12,
): Promise<AnyContentEntry[]> {
  const conceptEntry = await getContentBySlug('concepts', conceptSlug);
  if (!conceptEntry || conceptEntry.collection !== 'concepts') return [];
  const normalizedConceptId = conceptEntry.id.trim().toLowerCase();
  const normalizedConceptTitle = conceptEntry.data.title.trim().toLowerCase();
  const targetTags = new Set([normalizedConceptId, normalizedConceptTitle].filter(Boolean));

  const all = await getAllContent();
  return all
    .filter((item) => item.collection === 'guides' || item.collection === 'concepts')
    .filter((item) => !(item.collection === 'concepts' && item.id === conceptEntry.id))
    .filter((item) => {
      const normalizedTags = (item.data.tags ?? []).map((tag) => tag.trim().toLowerCase());
      return normalizedTags.some((tag) => targetTags.has(tag));
    })
    .sort((a, b) => {
      const ad = a.data.publishedAt?.valueOf() ?? 0;
      const bd = b.data.publishedAt?.valueOf() ?? 0;
      return bd - ad;
    })
    .slice(0, limit)
    .map((item) => item);
}

function tokenizeText(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s,./\\|:;!?()[\]{}"']+/)
    .map((v) => v.trim())
    .filter((v) => v.length >= 2);
}

function getOverlapCount<T>(left: Set<T>, right: Set<T>): number {
  let count = 0;
  left.forEach((v) => {
    if (right.has(v)) count += 1;
  });
  return count;
}

// ─── 정렬 헬퍼 ──────────────────────────────────────────────────

type WithDate = { data: { publishedAt?: Date } };

/** 최신순 정렬 */
export function sortByDate<T extends WithDate>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const da = a.data.publishedAt?.valueOf() ?? 0;
    const db = b.data.publishedAt?.valueOf() ?? 0;
    return db - da;
  });
}

// ─── 타입 별칭 (편의용) ──────────────────────────────────────────

export type GuideEntry = CollectionEntry<'guides'>;
export type ConceptEntry = CollectionEntry<'concepts'>;
export type BookEntry = CollectionEntry<'books'>;
export type ColumnEntry = CollectionEntry<'columns'>;
