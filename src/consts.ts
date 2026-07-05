export const SITE_TITLE = 'HowLearn';
export const SITE_DESCRIPTION =
  '학습 과학 기반 가이드, 개념 해설, 수학 학습 칼럼과 도서 추천';
export const SITE_URL = (import.meta.env.PUBLIC_SITE_URL || 'https://www.howlearn.kr').replace(
  /\/+$/,
  '',
);
export const MATH_SITE_URL = (
  import.meta.env.PUBLIC_MATH_SITE_URL || 'https://math.howlearn.kr'
).replace(/\/+$/, '');
export const CONTACT_EMAIL = String(import.meta.env.PUBLIC_CONTACT_EMAIL || '').trim();

export const NAV_LINKS = [
  { href: '/guides', label: '학부모 가이드' },
  { href: '/columns', label: '수학 학습 칼럼' },
  { href: '/concepts', label: '학습 과학 개념' },
] as const;

/** 도서 섹션은 콘텐츠 확충 전까지 주 네비게이션에서 제외합니다. */
export const SECONDARY_NAV_LINKS = [{ href: '/books', label: '도서 추천' }] as const;
