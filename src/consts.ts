export const SITE_TITLE = 'HowLearn';
export const SITE_DESCRIPTION =
  '학습 과학 기반 가이드, 개념 해설, 수학 학습 칼럼';
export const SITE_URL = (import.meta.env.PUBLIC_SITE_URL || 'https://www.howlearn.kr').replace(
  /\/+$/,
  '',
);
export const MATH_SITE_URL = (
  import.meta.env.PUBLIC_MATH_SITE_URL || 'https://math.howlearn.kr'
).replace(/\/+$/, '');
export const CONTACT_EMAIL = String(import.meta.env.PUBLIC_CONTACT_EMAIL || '').trim();

/** AdSense 승인 전까지 도서 섹션을 네비·검색·사이트맵에서 숨깁니다. 승인 후 true로 전환하세요. */
export const BOOKS_SECTION_PUBLIC = false;

export const NAV_LINKS = [
  { href: '/guides', label: '학부모 가이드' },
  { href: '/columns', label: '수학 학습 칼럼' },
  { href: '/concepts', label: '학습 과학 개념' },
] as const;

export const SECONDARY_NAV_LINKS = BOOKS_SECTION_PUBLIC
  ? ([{ href: '/books', label: '도서 추천' }] as const)
  : ([] as const);
