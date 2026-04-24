import { STORAGE_KEYS } from './storage-keys';
import type { FocusSessionStateV1 } from '../types/state';

const FALLBACK: FocusSessionStateV1 = {
  v: 1,
  status: 'idle',
  elapsedMs: 0,
  startedAt: null,
  targetMs: null,
};

function nowMs(): number {
  return Date.now();
}

export function getFocusState(): FocusSessionStateV1 {
  if (typeof localStorage === 'undefined') return FALLBACK;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FOCUS_STATE);
    if (!raw) return { ...FALLBACK };
    const parsed = JSON.parse(raw) as FocusSessionStateV1;
    return { ...FALLBACK, ...parsed, v: 1 };
  } catch {
    return { ...FALLBACK };
  }
}

export function saveFocusState(state: FocusSessionStateV1): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.FOCUS_STATE, JSON.stringify({ ...state, v: 1 }));
}

export function startFocus(targetMinutes?: number): FocusSessionStateV1 {
  const next: FocusSessionStateV1 = {
    v: 1,
    status: 'running',
    elapsedMs: 0,
    startedAt: nowMs(),
    targetMs:
      typeof targetMinutes === 'number' && Number.isFinite(targetMinutes)
        ? Math.max(1, Math.floor(targetMinutes)) * 60_000
        : null,
  };
  saveFocusState(next);
  return next;
}

export function pauseFocus(): FocusSessionStateV1 {
  const current = getFocusState();
  if (current.status !== 'running' || current.startedAt == null) return current;
  const next: FocusSessionStateV1 = {
    ...current,
    status: 'paused',
    elapsedMs: current.elapsedMs + (nowMs() - current.startedAt),
    startedAt: null,
  };
  saveFocusState(next);
  return next;
}

export function resumeFocus(): FocusSessionStateV1 {
  const current = getFocusState();
  if (current.status !== 'paused') return current;
  const next: FocusSessionStateV1 = {
    ...current,
    status: 'running',
    startedAt: nowMs(),
  };
  saveFocusState(next);
  return next;
}

export function stopFocus(): FocusSessionStateV1 {
  const next = { ...FALLBACK, status: 'finished' as const };
  saveFocusState(next);
  return next;
}

export function getCurrentElapsedMs(): number {
  const current = getFocusState();
  if (current.status !== 'running' || current.startedAt == null) return current.elapsedMs;
  return current.elapsedMs + (nowMs() - current.startedAt);
}
