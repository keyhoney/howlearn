import type { CollectionEntry } from 'astro:content';
import type {
  CONTENT_DOMAINS,
  CONTENT_STATUSES,
} from '../content.config';

/**
 * HowLearn 콘텐츠 도메인 타입
 * - 콘텐츠 축(guide/concept/book/column)을 단일 리터럴 유니온으로 표현
 * - `toolkit`은 이후 확장을 위한 예약 타입 (Phase 5에서 컬렉션 추가 예정)
 */
export type ContentType =
  | 'guide'
  | 'concept'
  | 'book'
  | 'column'
  | 'toolkit';

export type ContentDomain = (typeof CONTENT_DOMAINS)[number];
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export type GuideEntry = CollectionEntry<'guides'>;
export type ConceptEntry = CollectionEntry<'concepts'>;
export type BookEntry = CollectionEntry<'books'>;
export type ColumnEntry = CollectionEntry<'columns'>;

/** 4개 콘텐츠 축 공통 엔트리 유니온 */
export type AnyContentEntry =
  | GuideEntry
  | ConceptEntry
  | BookEntry
  | ColumnEntry;

/**
 * 엔트리 타입 식별자를 리터럴로 반환
 * (Astro CollectionEntry의 `collection` 필드를 ContentType에 매핑)
 */
export function entryContentType(entry: AnyContentEntry): ContentType {
  switch (entry.collection) {
    case 'guides':
      return 'guide';
    case 'concepts':
      return 'concept';
    case 'books':
      return 'book';
    case 'columns':
      return 'column';
  }
}

/**
 * 콘텐츠 인덱스 ID 규약: `${type}-${slug}`
 * relatedContentIds 참조 무결성 검증 및 정규화에 사용
 */
export function makeContentId(type: ContentType, slug: string): string {
  return `${type}-${slug}`;
}
