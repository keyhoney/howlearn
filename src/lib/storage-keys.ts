/**
 * 로컬스토리지 키 상수 모음.
 * 8단계에서 각 storage 유틸(progress.ts, wrong-note.ts, bookmark.ts, focus.ts)이
 * 이 파일을 import하여 사용한다.
 */
export const STORAGE_KEYS = {
  PROBLEM_PROGRESS: 'howlearn-problem-progress',
  WRONG_NOTE: 'howlearn-wrong-note',
  BOOKMARK: 'howlearn-bookmark',
  FOCUS_STATE: 'howlearn-focus-state',
  FOCUS_HISTORY: 'howlearn-focus-history',
  THEME: 'theme',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
