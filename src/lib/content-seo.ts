export type ContentPageType = 'guides' | 'concepts' | 'columns' | 'books';

export type ContentSeoInput = {
  type: ContentPageType;
  title: string;
  summary?: string;
  seoTitle?: string;
  seoDescription?: string;
  shortDefinition?: string;
  tags?: string[];
  categories?: string[];
};

const typeLabel: Record<ContentPageType, string> = {
  guides: '학부모 가이드',
  concepts: '학습 과학 개념 사전',
  columns: '수학 학습 칼럼',
  books: '도서 추천',
};

const descriptionSuffix: Record<ContentPageType, string> = {
  guides: 'HowLearn 학부모 가이드에서 원리와 집에서 바로 적용할 방법을 확인하세요.',
  concepts: '학습 과학 개념을 쉬운 설명과 관련 가이드로 함께 확인하세요.',
  columns: '수학 학습 칼럼에서 실천 가능한 공부 전략을 확인하세요.',
  books: '학습 과학 관점의 도서 소개와 실천 포인트를 확인하세요.',
};

function compact(value: string | undefined): string {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function stripAudiencePrefix(title: string): string {
  return compact(title).replace(/^\[[^\]]+\]\s*/, '');
}

function truncate(value: string, maxLength: number): string {
  const text = compact(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

function primaryKeyword(input: ContentSeoInput): string {
  return input.tags?.[0] ?? input.categories?.[0] ?? '';
}

export function buildContentPageTitle(input: ContentSeoInput): string {
  const explicitTitle = compact(input.seoTitle);
  const baseTitle = explicitTitle || truncate(stripAudiencePrefix(input.title), 52);
  const keyword = primaryKeyword(input);

  if (input.type === 'guides') {
    return keyword ? `${baseTitle} | ${typeLabel[input.type]} · ${keyword}` : `${baseTitle} | ${typeLabel[input.type]}`;
  }

  return `${baseTitle} | ${typeLabel[input.type]}`;
}

export function buildContentPageDescription(input: ContentSeoInput): string {
  const base = compact(input.seoDescription) || compact(input.summary) || compact(input.shortDefinition) || compact(input.title);
  const prefix = truncate(base, 105);
  const suffix = descriptionSuffix[input.type];
  if (!prefix) return suffix;
  return `${prefix} ${suffix}`;
}
