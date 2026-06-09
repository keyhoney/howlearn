/** 가이드·칼럼·개념 등 콘텐츠 도메인 라벨·배지 색 (`global.css` `.app-badge-type-*`) */

export const CONTENT_DOMAIN_LABELS: Record<string, string> = {
  guides: '가이드',
  columns: '칼럼',
  concepts: '개념',
  books: '도서',
};

export const CONTENT_DOMAIN_BADGE_CLASS: Record<string, string> = {
  guides: 'app-badge-type-guide',
  columns: 'app-badge-type-column',
  concepts: 'app-badge-type-concept',
  books: 'app-badge-type-book',
};

export function getContentDomainLabel(domain: string): string {
  return CONTENT_DOMAIN_LABELS[domain] ?? '글';
}

export function getContentDomainBadgeClass(domain: string): string {
  return CONTENT_DOMAIN_BADGE_CLASS[domain] ?? 'app-badge-neutral';
}

export function inferContentDomainFromUrl(url: string): string {
  if (url.startsWith('/guides/')) return 'guides';
  if (url.startsWith('/concepts/')) return 'concepts';
  if (url.startsWith('/books/')) return 'books';
  if (url.startsWith('/columns/')) return 'columns';
  return 'other';
}
