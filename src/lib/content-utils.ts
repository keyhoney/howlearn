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
  const all = await getAllContent();
  const tokenizedSource = tokenizeText(`${item.data.title} ${item.data.summary}`);
  const sourceDomains = new Set(item.data.domains ?? []);
  const sourceTags = new Set(item.data.tags ?? []);
  const sourceCategories = new Set(item.data.categories ?? []);

  return all
    .filter((candidate) => !(candidate.collection === item.collection && candidate.id === item.id))
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
    .slice(0, limit)
    .map((v) => v.candidate);
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

/** 과목 → 단원 → 소단원 → [개념…] (선택 UI·필터용, 값은 콘텐츠와 동일한 전체 문자열) */
export type ProblemSubjectChapterTree = Record<string, Record<string, Record<string, string[]>>>;

type WithSubjectChapterConcept = {
  data: { subject: string; chapter: string; subChapter: string; concept: string };
};

/** 기출/논술 문제 컬렉션에서 과목·단원·개념 계층 트리를 만든다. */
export function buildProblemSubjectChapterTree(
  problems: WithSubjectChapterConcept[],
): ProblemSubjectChapterTree {
  const bySubject = new Map<string, Map<string, Map<string, Set<string>>>>();
  for (const p of problems) {
    const { subject, chapter, subChapter, concept } = p.data;
    if (!bySubject.has(subject)) bySubject.set(subject, new Map());
    const byChapter = bySubject.get(subject)!;
    if (!byChapter.has(chapter)) byChapter.set(chapter, new Map());
    const bySubChapter = byChapter.get(chapter)!;
    if (!bySubChapter.has(subChapter)) bySubChapter.set(subChapter, new Set());
    bySubChapter.get(subChapter)!.add(concept);
  }
  const out: ProblemSubjectChapterTree = {};
  const sortedSubjects = Array.from(bySubject.keys()).sort((a, b) => a.localeCompare(b, 'ko'));
  for (const subj of sortedSubjects) {
    const chMap = bySubject.get(subj)!;
    const chapters = Array.from(chMap.keys()).sort((a, b) => a.localeCompare(b, 'ko'));
    out[subj] = {};
    for (const ch of chapters) {
      out[subj][ch] = {};
      const subMap = chMap.get(ch)!;
      const subChapters = Array.from(subMap.keys()).sort((a, b) => a.localeCompare(b, 'ko'));
      for (const subCh of subChapters) {
        out[subj][ch][subCh] = Array.from(subMap.get(subCh)!).sort((a, b) => a.localeCompare(b, 'ko'));
      }
    }
  }
  return out;
}

/** URL의 과목·단원·개념 값을 트리에 맞게 정리한다. */
export function normalizeSubjectChapterConceptParams(
  tree: ProblemSubjectChapterTree,
  subject: string,
  chapter: string,
  subChapter: string,
  concept: string,
): { subject: string; chapter: string; subChapter: string; concept: string } {
  const s = subject.trim();
  let ch = chapter.trim();
  let sub = subChapter.trim();
  let co = concept.trim();
  if (!s || !tree[s]) {
    return { subject: '', chapter: '', subChapter: '', concept: '' };
  }
  const chapters = Object.keys(tree[s]);
  if (!ch || !chapters.includes(ch)) {
    return { subject: s, chapter: '', subChapter: '', concept: '' };
  }
  const subChapters = Object.keys(tree[s][ch] ?? {});
  if (!sub || !subChapters.includes(sub)) {
    return { subject: s, chapter: ch, subChapter: '', concept: '' };
  }
  const concepts = tree[s][ch][sub] ?? [];
  if (!co || !concepts.includes(co)) {
    return { subject: s, chapter: ch, subChapter: sub, concept: '' };
  }
  return { subject: s, chapter: ch, subChapter: sub, concept: co };
}

export async function getPublishedProblems() {
  return (await getCollection('problems'));
}

export async function getPublishedEssayProblems() {
  return (await getCollection('essay-problems'));
}

type ProblemTaxonomy = {
  data: {
    source: string;
    subject: string;
    chapter: string;
    subChapter: string;
    concept: string;
    difficulty: number;
    year: number;
    month: number;
    examType: string;
  };
};

export type ProblemOccurrenceStats = {
  totalProblems: number;
  totalExamSessions: number;
  bySubject: { count: number; ratio: number };
  byChapter: { count: number; ratio: number };
  bySubChapter: { count: number; ratio: number };
  byConcept: { count: number; ratio: number };
  byConceptSession: { count: number; ratio: number };
  conceptDifficultyHistogram: Record<1 | 2 | 3 | 4 | 5, number>;
  conceptAverageDifficulty: number;
  conceptModeDifficulty: number;
  conceptRecent3YearsCount: number;
};

/**
 * 선택한 문제의 과목/단원/중단원/개념 축에서 출제 빈도와 난이도 경향을 계산한다.
 */
export function buildProblemOccurrenceStats<T extends ProblemTaxonomy>(
  target: T,
  problems: T[],
): ProblemOccurrenceStats {
  const totalProblems = Math.max(1, problems.length);
  const bySubjectCount = problems.filter((p) => p.data.subject === target.data.subject).length;
  const byChapterCount = problems.filter(
    (p) =>
      p.data.subject === target.data.subject &&
      p.data.chapter === target.data.chapter,
  ).length;
  const bySubChapterCount = problems.filter(
    (p) =>
      p.data.subject === target.data.subject &&
      p.data.chapter === target.data.chapter &&
      p.data.subChapter === target.data.subChapter,
  ).length;
  const byConcept = problems.filter(
    (p) =>
      p.data.subject === target.data.subject &&
      p.data.chapter === target.data.chapter &&
      p.data.subChapter === target.data.subChapter &&
      p.data.concept === target.data.concept,
  );
  const byConceptCount = byConcept.length;
  const totalExamSessions = Math.max(
    1,
    new Set(problems.map((p) => toExamSessionKey(p.data))).size,
  );
  const byConceptSessionCount = new Set(byConcept.map((p) => toExamSessionKey(p.data))).size;
  const histogram: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const p of byConcept) {
    const d = Number(p.data.difficulty);
    if (d >= 1 && d <= 5) histogram[d as 1 | 2 | 3 | 4 | 5] += 1;
  }
  const safeConceptCount = Math.max(1, byConceptCount);
  const conceptAverageDifficulty =
    byConcept.reduce((acc, p) => acc + Number(p.data.difficulty || 0), 0) / safeConceptCount;
  const conceptModeDifficulty = (Object.entries(histogram) as Array<[`${1 | 2 | 3 | 4 | 5}`, number]>)
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return Number(a[0]) - Number(b[0]);
    })[0];
  const latestYear = problems.reduce((max, p) => Math.max(max, Number(p.data.year || 0)), 0);
  const minRecentYear = latestYear > 0 ? latestYear - 2 : 0;
  const conceptRecent3YearsCount = byConcept.filter((p) => Number(p.data.year || 0) >= minRecentYear).length;

  return {
    totalProblems,
    totalExamSessions,
    bySubject: { count: bySubjectCount, ratio: bySubjectCount / totalProblems },
    byChapter: { count: byChapterCount, ratio: byChapterCount / totalProblems },
    bySubChapter: { count: bySubChapterCount, ratio: bySubChapterCount / totalProblems },
    byConcept: { count: byConceptCount, ratio: byConceptCount / totalProblems },
    byConceptSession: {
      count: byConceptSessionCount,
      ratio: byConceptSessionCount / totalExamSessions,
    },
    conceptDifficultyHistogram: histogram,
    conceptAverageDifficulty,
    conceptModeDifficulty: Number(conceptModeDifficulty?.[0] ?? 3),
    conceptRecent3YearsCount,
  };
}

function toExamSessionKey(data: {
  source: string;
  year: number;
  month: number;
  examType: string;
}): string {
  const normalizedSource = String(data.source || '')
    .replace(/\s*\d+\s*번\s*$/u, '')
    .trim();
  return `${data.year}-${data.month}-${data.examType}-${normalizedSource}`;
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
