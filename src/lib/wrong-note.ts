import { STORAGE_KEYS } from './storage-keys';
import type { WrongNoteEntry, WrongNoteStoreV1 } from '../types/state';

const MAX_PER_PROBLEM = 40;
const FALLBACK: WrongNoteStoreV1 = { v: 1, byId: {} };

function readStore(): WrongNoteStoreV1 {
  if (typeof localStorage === 'undefined') return FALLBACK;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WRONG_NOTE);
    if (!raw) return { ...FALLBACK };
    const parsed = JSON.parse(raw) as WrongNoteStoreV1;
    return { v: 1, byId: parsed.byId ?? {} };
  } catch {
    return { ...FALLBACK };
  }
}

function writeStore(store: WrongNoteStoreV1): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.WRONG_NOTE, JSON.stringify(store));
}

export function appendWrongNote(problemId: string, entry: WrongNoteEntry): void {
  const store = readStore();
  const bucket = store.byId[problemId] ?? { entries: [] };
  bucket.entries.unshift(entry);
  bucket.entries = bucket.entries.slice(0, MAX_PER_PROBLEM);
  store.byId[problemId] = bucket;
  writeStore(store);
}

export function getWrongNotes(): WrongNoteStoreV1 {
  return readStore();
}

export function clearWrongNotes(problemId?: string): void {
  const store = readStore();
  if (problemId) {
    delete store.byId[problemId];
  } else {
    store.byId = {};
  }
  writeStore(store);
}
