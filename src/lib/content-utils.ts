/**
 * 콘텐츠 컬렉션 조회 유틸
 *
 * 기본 규칙: status === 'published' 인 항목만 반환.
 * draft 콘텐츠는 개발 서버에서도 목록/라우트에 노출하지 않는다.
 * (Tina 에디터 내부 미리보기는 Tina 자체 UI에서 처리)
 */

import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

// ─── 발행 필터 ───────────────────────────────────────────────────

/** 콘텐츠 컬렉션에서 published 항목만 반환한다 */
export async function getPublishedGuides() {
  return (await getCollection('guides')).filter(
    (e) => e.data.status === 'published',
  );
}

export async function getPublishedConcepts() {
  return (await getCollection('concepts')).filter(
    (e) => e.data.status === 'published',
  );
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
  const ids = item.data.relatedContentIds ?? [];
  if (ids.length === 0) return [];

  const all = await getAllContent();
  const byId = new Map(all.map((it) => [`${it.collection.slice(0, -1)}-${it.id}`, it]));
  const related = ids
    .map((id) => byId.get(id))
    .filter((v): v is AnyContentEntry => Boolean(v))
    .slice(0, limit);

  return related;
}

export async function getContentReferringToConcept(
  conceptSlug: string,
  limit = 12,
): Promise<AnyContentEntry[]> {
  const targetId = `concept-${conceptSlug}`;
  const all = await getAllContent();
  return all
    .filter((item) => item.collection !== 'concepts')
    .filter((item) => (item.data.relatedContentIds ?? []).includes(targetId))
    .slice(0, limit);
}

/** 과목 → 단원 → [개념…] (선택 UI·필터용, 값은 콘텐츠와 동일한 전체 문자열) */
export type ProblemSubjectChapterTree = Record<string, Record<string, string[]>>;

type WithSubjectChapterConcept = {
  data: { subject: string; chapter: string; concept: string };
};

/** 기출/논술 문제 컬렉션에서 과목·단원·개념 계층 트리를 만든다. */
export function buildProblemSubjectChapterTree(
  problems: WithSubjectChapterConcept[],
): ProblemSubjectChapterTree {
  const bySubject = new Map<string, Map<string, Set<string>>>();
  for (const p of problems) {
    const { subject, chapter, concept } = p.data;
    if (!bySubject.has(subject)) bySubject.set(subject, new Map());
    const byChapter = bySubject.get(subject)!;
    if (!byChapter.has(chapter)) byChapter.set(chapter, new Set());
    byChapter.get(chapter)!.add(concept);
  }
  const out: ProblemSubjectChapterTree = {};
  const sortedSubjects = Array.from(bySubject.keys()).sort((a, b) => a.localeCompare(b, 'ko'));
  for (const subj of sortedSubjects) {
    const chMap = bySubject.get(subj)!;
    const chapters = Array.from(chMap.keys()).sort((a, b) => a.localeCompare(b, 'ko'));
    out[subj] = {};
    for (const ch of chapters) {
      out[subj][ch] = Array.from(chMap.get(ch)!).sort((a, b) => a.localeCompare(b, 'ko'));
    }
  }
  return out;
}

/** URL의 과목·단원·개념 값을 트리에 맞게 정리한다. */
export function normalizeSubjectChapterConceptParams(
  tree: ProblemSubjectChapterTree,
  subject: string,
  chapter: string,
  concept: string,
): { subject: string; chapter: string; concept: string } {
  const s = subject.trim();
  let ch = chapter.trim();
  let co = concept.trim();
  if (!s || !tree[s]) {
    return { subject: '', chapter: '', concept: '' };
  }
  const chapters = Object.keys(tree[s]);
  if (!ch || !chapters.includes(ch)) {
    return { subject: s, chapter: '', concept: '' };
  }
  const concepts = tree[s][ch] ?? [];
  if (!co || !concepts.includes(co)) {
    return { subject: s, chapter: ch, concept: '' };
  }
  return { subject: s, chapter: ch, concept: co };
}

export async function getPublishedProblems() {
  return (await getCollection('problems'));
}

export async function getPublishedEssayProblems() {
  return (await getCollection('essay-problems'));
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
export type ProblemEntry = CollectionEntry<'problems'>;
export type EssayProblemEntry = CollectionEntry<'essay-problems'>;
