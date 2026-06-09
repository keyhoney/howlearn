import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { STORAGE_KEYS } from '../storage-keys';
import {
  enqueueConceptsFromArticle,
  pruneConceptQueue,
  recordConceptVisit,
  recordRecentRead,
} from './reading-history';

function withMockStorage(run: () => void): void {
  const storage = new Map<string, string>();
  const original = globalThis.localStorage;
  const mockStorage = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
    clear: () => storage.clear(),
    key: () => null,
    length: 0,
  };
  Object.defineProperty(globalThis, 'localStorage', { value: mockStorage, configurable: true });
  try {
    run();
  } finally {
    Object.defineProperty(globalThis, 'localStorage', { value: original, configurable: true });
  }
}

function readRecentTitles(): string[] {
  const raw = localStorage.getItem(STORAGE_KEYS.READING_RECENT);
  if (!raw) return [];
  const parsed = JSON.parse(raw) as { items: { title: string }[] };
  return parsed.items.map((item) => item.title);
}

function readUnreadSlugs(allowed?: string[]): string[] {
  const visitedRaw = localStorage.getItem(STORAGE_KEYS.CONCEPT_VISITED);
  const queueRaw = localStorage.getItem(STORAGE_KEYS.ARTICLE_CONCEPT_QUEUE);
  const visited = visitedRaw ? (JSON.parse(visitedRaw) as { bySlug: Record<string, number> }).bySlug : {};
  const queue = queueRaw ? (JSON.parse(queueRaw) as { items: { slug: string }[] }).items : [];
  const allowedSet = allowed ? new Set(allowed) : null;
  return queue
    .filter((item) => !visited[item.slug])
    .filter((item) => !allowedSet || allowedSet.has(item.slug))
    .map((item) => item.slug);
}

describe('reading-history', () => {
  it('records and dedupes recent reads', () => {
    withMockStorage(() => {
      recordRecentRead({ url: '/guides/a', title: 'A', domain: 'guides' });
      recordRecentRead({ url: '/guides/b', title: 'B', domain: 'guides' });
      recordRecentRead({ url: '/guides/a', title: 'A updated', domain: 'guides' });
      const titles = readRecentTitles();
      assert.equal(titles.length, 2);
      assert.equal(titles[0], 'A updated');
    });
  });

  it('tracks unread concepts from articles', () => {
    withMockStorage(() => {
      const allowed = ['working-memory', 'spacing'];
      enqueueConceptsFromArticle(
        [
          { slug: 'working-memory', title: '작업 기억' },
          { slug: 'spacing', title: '간격 반복' },
          { slug: 'draft-only', title: '미발행' },
        ],
        allowed,
      );
      recordConceptVisit('working-memory');
      const unread = readUnreadSlugs(allowed);
      assert.equal(unread.length, 1);
      assert.equal(unread[0], 'spacing');
    });
  });

  it('prunes invalid slugs from queue', () => {
    withMockStorage(() => {
      enqueueConceptsFromArticle([{ slug: 'ghost', title: '없음' }]);
      pruneConceptQueue(['published-one']);
      const unread = readUnreadSlugs(['published-one']);
      assert.equal(unread.length, 0);
    });
  });
});
