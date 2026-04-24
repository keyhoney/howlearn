import type { CollectionEntry } from 'astro:content';
import type { ANSWER_TYPES, EXAM_TYPES } from '../content.config';

export type ExamType = (typeof EXAM_TYPES)[number];
export type AnswerType = (typeof ANSWER_TYPES)[number];

export interface ExamDate {
  year: number;
  month: number;
  type: ExamType;
}

export interface ProblemTopic {
  subject: string;
  chapter: string;
  concept: string;
}

export type ProblemEntry = CollectionEntry<'problems'>;
export type EssayProblemEntry = CollectionEntry<'essay-problems'>;
export type AnyProblemEntry = ProblemEntry | EssayProblemEntry;

/**
 * 문제 축에서 런타임/빌드타임 공통으로 쓰는 Problem 인터페이스
 * - Astro Content Collections의 frontmatter(`data`)를 1급으로 사용
 * - MDX 본문은 `<Question>`, `<Hint>`, `<Answer>` 태그 기반으로 렌더
 */
export interface Problem {
  id: string;
  source: string;
  examDate: ExamDate;
  topic: ProblemTopic;
  difficulty: number;
  answerType: AnswerType;
  answer: number | string;
  tags: string[];
  relatedProblemIds: string[];
}
