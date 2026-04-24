/**
 * 콘텐츠 컬렉션 조회 유틸
 *
 * 기본 규칙: status === 'published' 인 항목만 반환.
 * draft 콘텐츠는 개발 서버에서도 목록/라우트에 노출하지 않는다.
 * (Tina 에디터 내부 미리보기는 Tina 자체 UI에서 처리)
 */

import { getCollection, type CollectionEntry } from 'astro:content';

// ─── 발행 필터 ───────────────────────────────────────────────────

/** 콘텐츠 컬렉션에서 published 항목만 반환한다 */
export async function getPublishedGuides() {
  return (await getCollection('guides')).filter(
    (e) => e.data.status === 'published',
  );
}

export async function getPublishedConcepts() {
  return (await getCollection('concepts')).filter(
    (e) => e.data.status === 'published',
  );
}

export async function getPublishedBooks() {
  return (await getCollection('books')).filter(
    (e) => e.data.status === 'published',
  );
}

export async function getPublishedColumns() {
  return (await getCollection('columns')).filter(
    (e) => e.data.status === 'published',
  );
}

export async function getPublishedProblems() {
  return (await getCollection('problems'));
}

export async function getPublishedEssayProblems() {
  return (await getCollection('essay-problems'));
}

// ─── 정렬 헬퍼 ──────────────────────────────────────────────────

type WithDate = { data: { publishedAt?: Date } };

/** 최신순 정렬 */
export function sortByDate<T extends WithDate>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const da = a.data.publishedAt?.valueOf() ?? 0;
    const db = b.data.publishedAt?.valueOf() ?? 0;
    return db - da;
  });
}

// ─── 타입 별칭 (편의용) ──────────────────────────────────────────

export type GuideEntry = CollectionEntry<'guides'>;
export type ConceptEntry = CollectionEntry<'concepts'>;
export type BookEntry = CollectionEntry<'books'>;
export type ColumnEntry = CollectionEntry<'columns'>;
export type ProblemEntry = CollectionEntry<'problems'>;
export type EssayProblemEntry = CollectionEntry<'essay-problems'>;
