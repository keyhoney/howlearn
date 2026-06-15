import { STORAGE_KEYS } from '../storage-keys';

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export type RecentRead = {
  url: string;
  title: string;
  domain: 'guides' | 'columns' | 'concepts' | 'books' | string;
  ts: number;
};

export type PendingConcept = {
  slug: string;
  title: string;
};

const MAX_RECENT = 8;
const MAX_QUEUE = 24;

function readRecentStore(): { v: number; items: RecentRead[] } {
  if (typeof localStorage === 'undefined') return { v: 1, items: [] };
  return parseJson(localStorage.getItem(STORAGE_KEYS.READING_RECENT), { v: 1, items: [] });
}

function writeRecentStore(items: RecentRead[]): void {
  localStorage.setItem(STORAGE_KEYS.READING_RECENT, JSON.stringify({ v: 1, items }));
}

function readVisitedStore(): { v: number; bySlug: Record<string, number> } {
  if (typeof localStorage === 'undefined') return { v: 1, bySlug: {} };
  return parseJson(localStorage.getItem(STORAGE_KEYS.CONCEPT_VISITED), { v: 1, bySlug: {} });
}

function readConceptQueueStore(): { v: number; items: PendingConcept[] } {
  if (typeof localStorage === 'undefined') return { v: 1, items: [] };
  return parseJson(localStorage.getItem(STORAGE_KEYS.ARTICLE_CONCEPT_QUEUE), { v: 1, items: [] });
}

function writeConceptQueueStore(items: PendingConcept[]): void {
  localStorage.setItem(STORAGE_KEYS.ARTICLE_CONCEPT_QUEUE, JSON.stringify({ v: 1, items }));
}

export function recordRecentRead(input: Omit<RecentRead, 'ts'> & { ts?: number }): void {
  if (typeof localStorage === 'undefined') return;
  const ts = input.ts ?? Date.now();
  const store = readRecentStore();
  const items = store.items.filter((item) => item.url !== input.url);
  items.unshift({ url: input.url, title: input.title, domain: input.domain, ts });
  writeRecentStore(items.slice(0, MAX_RECENT));
}

export function getRecentReads(limit = 5): RecentRead[] {
  const store = readRecentStore();
  return store.items.slice(0, limit);
}

export function recordConceptVisit(slug: string): void {
  if (typeof localStorage === 'undefined' || !slug.trim()) return;
  const key = slug.trim();
  const store = readVisitedStore();
  store.bySlug[key] = Date.now();
  localStorage.setItem(STORAGE_KEYS.CONCEPT_VISITED, JSON.stringify({ v: 1, bySlug: store.bySlug }));

  const queue = readConceptQueueStore();
  const next = queue.items.filter((item) => item.slug !== key);
  if (next.length !== queue.items.length) writeConceptQueueStore(next);
}

function toAllowedSlugSet(allowedConceptSlugs?: Iterable<string>): Set<string> | null {
  if (!allowedConceptSlugs) return null;
  return new Set(allowedConceptSlugs);
}

export function enqueueConceptsFromArticle(
  concepts: PendingConcept[],
  allowedConceptSlugs?: Iterable<string>,
): void {
  if (typeof localStorage === 'undefined' || !concepts.length) return;
  const allowed = toAllowedSlugSet(allowedConceptSlugs);
  const visited = readVisitedStore().bySlug;
  const store = readConceptQueueStore();
  const seen = new Set(store.items.map((item) => item.slug));
  const merged = [...store.items];

  for (const concept of concepts) {
    const slug = concept.slug?.trim();
    if (!slug || visited[slug] || seen.has(slug)) continue;
    if (allowed && !allowed.has(slug)) continue;
    seen.add(slug);
    merged.push({ slug, title: concept.title?.trim() || slug });
  }

  writeConceptQueueStore(merged.slice(0, MAX_QUEUE));
}

/** 대시보드·빌드 시점 published slug 목록으로 큐에서 404 대상 제거 */
export function pruneConceptQueue(allowedConceptSlugs: Iterable<string>): void {
  if (typeof localStorage === 'undefined') return;
  const allowed = toAllowedSlugSet(allowedConceptSlugs);
  if (!allowed) return;
  const store = readConceptQueueStore();
  const next = store.items.filter((item) => allowed.has(item.slug));
  if (next.length !== store.items.length) writeConceptQueueStore(next);
}

