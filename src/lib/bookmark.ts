import { STORAGE_KEYS } from './storage-keys';
import type { BookmarkStoreV1 } from '../types/state';

const FALLBACK: BookmarkStoreV1 = { v: 1, byId: {} };

function readStore(): BookmarkStoreV1 {
  if (typeof localStorage === 'undefined') return FALLBACK;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARK);
    if (!raw) return { ...FALLBACK };
    const parsed = JSON.parse(raw) as BookmarkStoreV1;
    return { v: 1, byId: parsed.byId ?? {} };
  } catch {
    return { ...FALLBACK };
  }
}

function writeStore(store: BookmarkStoreV1): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.BOOKMARK, JSON.stringify(store));
}

export function toggleBookmark(problemId: string): boolean {
  const store = readStore();
  if (store.byId[problemId]) {
    delete store.byId[problemId];
    writeStore(store);
    return false;
  }

  store.byId[problemId] = { ts: Date.now() };
  writeStore(store);
  return true;
}

export function isBookmarked(problemId: string): boolean {
  return Boolean(readStore().byId[problemId]);
}

export function getBookmarks(): BookmarkStoreV1 {
  return readStore();
}
