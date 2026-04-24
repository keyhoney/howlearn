/**
 * HowLearn 핵심 도메인 타입 정의
 *
 * 콘텐츠 축(guide/concept/book/column)과 문제 축(problem/essay-problem)의
 * 공유 타입 계약. 이 파일의 타입을 기준으로 스키마, 유틸, UI 컴포넌트를 작성한다.
 */

// ─── 콘텐츠 축 ──────────────────────────────────────────────────

export type ContentType = 'guide' | 'concept' | 'book' | 'column';

export type ContentStatus = 'draft' | 'published';

export type DomainSlug =
  | 'cognitive-psychology'
  | 'neuroscience'
  | 'educational-psychology'
  | 'developmental-psychology'
  | 'motivation-emotion';

export interface Reference {
  title?: string;
  url: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PurchaseLink {
  label: string;
  href: string;
}

/** 정규화된 콘텐츠 인덱스 레코드 (cms-sync 출력, 4단계 구현) */
export interface ContentRecord {
  id: string; // `${type}-${slug}`
  type: ContentType;
  slug: string;
  title: string;
  summary: string;
  status: ContentStatus;
  domains: DomainSlug[];
  categories: string[];
  tags: string[];
  publishedAt?: string; // ISO 8601
  updatedAt?: string;
  featured: boolean;
  relatedContentIds: string[];
  references: Reference[];
  author?: string;
  lang: string;
  // guide/column 전용
  intro?: string;
  faq?: FaqItem[];
  // concept 전용
  shortDefinition?: string;
  englishName?: string;
  // book 전용
  subtitle?: string;
  purchaseLinks?: PurchaseLink[];
  // 본문(MDX/Markdown). 검색 인덱스용. 실제 렌더는 Astro Content에서 수행.
  body: string;
}

// ─── 문제 축 ────────────────────────────────────────────────────

export type ExamTypeLabel = '수능' | '모의평가' | '교육청' | '논술';

export interface ExamDate {
  year: number;
  month: number;
  type: ExamTypeLabel;
}

export interface ProblemTopic {
  subject: string;
  chapter: string;
  concept: string;
}

export type AnswerType = 'mcq' | 'short';

export interface Problem {
  id: string;
  source: string;
  examDate: ExamDate;
  topic: ProblemTopic;
  difficulty: number;
  /** 정답 타입: mcq = 객관식 1~5, short = 단답형 0~999 */
  answerType: AnswerType;
  /** 정답값. mcq: 1~5, short: 0~999 */
  answer: number;
  questionMdx: string;
  hintsMdx: string[];
  answerMdx: string;
  tags: string[];
  relatedProblemIds: string[];
}

export interface EssayProblem extends Problem {
  university: string;
  examYear?: number;
}

// ─── 로컬 상태 축 ────────────────────────────────────────────────

export type ProblemProgressStatus = 'none' | 'progress' | 'done';

export interface ProblemProgressMap {
  /** key: problem id */
  [id: string]: ProblemProgressStatus;
}

export type WrongNoteEntryType = 'mcq' | 'short';

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

export interface WrongNoteMap {
  /** key: problem id */
  [id: string]: WrongNoteBucket;
}

export interface BookmarkEntry {
  /** 저장 시각 (Unix ms) */
  ts: number;
}

export interface BookmarkMap {
  /** key: problem id */
  [id: string]: BookmarkEntry;
}

export interface FocusState {
  active: boolean;
  /** 설정 시간(초). 기본 25분 = 1500 */
  durationSec: number;
  /** 타이머 시작 시각 (Unix ms). null이면 미시작 */
  startedAt: number | null;
  /** 누적 일시정지 시간(ms) */
  pausedMs: number;
}
