/**
 * 로컬(브라우저) 상태 타입 계약
 * - 모든 값은 `localStorage`에 JSON으로 저장된다.
 * - 저장 포맷 버전을 `v`로 명시해 향후 마이그레이션이 가능하도록 한다.
 *
 * 기준: 요청 사항.md §5, math_howlearn/lib/*.ts
 */

// ────────────────────────────────────────────────────────────────────────────
// 진행 상태 (progress)
// ────────────────────────────────────────────────────────────────────────────

export type ProblemProgressStatus = 'none' | 'progress' | 'done';

export const PROBLEM_PROGRESS_STORAGE_KEY = 'howlearn:problem-progress' as const;

export interface ProblemProgressStoreV1 {
  v: 1;
  byId: Record<string, ProblemProgressStatus | ProblemProgressDetailV2>;
}

export interface ProblemProgressDetailV2 {
  status: ProblemProgressStatus;
  hintRevealedCount: number;
  solutionRevealed: boolean;
  lastAnswer: string;
  attemptCount: number;
  lastSeenAt: number;
}

// ────────────────────────────────────────────────────────────────────────────
// 오답 노트 (wrongNote)
// ────────────────────────────────────────────────────────────────────────────

export const WRONG_NOTE_STORAGE_KEY = 'howlearn:wrong-note' as const;

/** 문제당 보관하는 최대 기록 수 (로컬 용량 과다 방지) */
export const WRONG_NOTE_MAX_PER_PROBLEM = 40;

export interface WrongNoteMcqEntry {
  t: 'mcq';
  choice: number;
  ts: number;
}
export interface WrongNoteShortEntry {
  t: 'short';
  value: string;
  ts: number;
}
export type WrongNoteEntry = WrongNoteMcqEntry | WrongNoteShortEntry;

export interface WrongNoteBucket {
  entries: WrongNoteEntry[];
}

export interface WrongNoteStoreV1 {
  v: 1;
  byId: Record<string, WrongNoteBucket>;
}

// ────────────────────────────────────────────────────────────────────────────
// 북마크 (bookmark)
// ────────────────────────────────────────────────────────────────────────────

export const BOOKMARK_STORAGE_KEY = 'howlearn:bookmark' as const;

export interface BookmarkEntry {
  ts: number;
}

export interface BookmarkStoreV1 {
  v: 1;
  byId: Record<string, BookmarkEntry>;
}

// ────────────────────────────────────────────────────────────────────────────
// 집중 모드 (focus)
// ────────────────────────────────────────────────────────────────────────────

export const FOCUS_STORAGE_KEY = 'howlearn:focus' as const;

export type FocusModeStatus = 'idle' | 'running' | 'paused' | 'finished';

export interface FocusSessionStateV1 {
  v: 1;
  status: FocusModeStatus;
  /** ms 단위 누적 경과 시간 */
  elapsedMs: number;
  /** 마지막 시작/재개 시각(ms). status==='running'일 때만 유효 */
  startedAt: number | null;
  /** 사용자가 설정한 목표 시간(ms). 없으면 무제한 */
  targetMs: number | null;
}
