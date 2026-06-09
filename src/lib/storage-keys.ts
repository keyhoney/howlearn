/** 로컬스토리지 키 상수 (콘텐츠 허브 읽기 추적·테마) */
export const STORAGE_KEYS = {
  READING_RECENT: 'howlearn-reading-recent',
  CONCEPT_VISITED: 'howlearn-concept-visited',
  ARTICLE_CONCEPT_QUEUE: 'howlearn-article-concepts-pending',
  THEME: 'theme',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
