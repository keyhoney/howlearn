import { STORAGE_KEYS } from './storage-keys';
import type {
  ProblemProgressDetailV2,
  ProblemProgressStatus,
  ProblemProgressStoreV1,
} from '../types/state';

const FALLBACK: ProblemProgressStoreV1 = { v: 1, byId: {} };

function readStore(): ProblemProgressStoreV1 {
  if (typeof localStorage === 'undefined') return FALLBACK;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROBLEM_PROGRESS);
    if (!raw) return { ...FALLBACK };
    const parsed = JSON.parse(raw) as ProblemProgressStoreV1;
    return {
      v: 1,
      byId: parsed.byId ?? {},
    };
  } catch {
    return { ...FALLBACK };
  }
}

function writeStore(store: ProblemProgressStoreV1): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PROBLEM_PROGRESS, JSON.stringify(store));
}

export function getProgressStatus(problemId: string): ProblemProgressStatus {
  const item = readStore().byId[problemId];
  if (!item) return 'none';
  return typeof item === 'string' ? item : item.status;
}

export function setProgressStatus(problemId: string, status: ProblemProgressStatus): void {
  const store = readStore();
  const prev = store.byId[problemId];
  if (prev && typeof prev !== 'string') {
    store.byId[problemId] = { ...prev, status };
  } else {
    store.byId[problemId] = status;
  }
  writeStore(store);
}

export function removeProgressStatus(problemId: string): void {
  const store = readStore();
  delete store.byId[problemId];
  writeStore(store);
}

export function getAllProgress(): ProblemProgressStoreV1 {
  return readStore();
}

export function getProgressDetail(problemId: string): ProblemProgressDetailV2 | null {
  const item = readStore().byId[problemId];
  if (!item || typeof item === 'string') return null;
  return item;
}
