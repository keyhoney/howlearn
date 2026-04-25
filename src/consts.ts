export const SITE_TITLE = 'HowLearn';
export const SITE_DESCRIPTION =
  '학습 과학 기반 가이드와 수학 문제 풀이를 통합한 학습 플랫폼';
export const SITE_URL = (import.meta.env.PUBLIC_SITE_URL || 'https://howlearn.pages.dev').replace(
  /\/+$/,
  '',
);

export const NAV_LINKS = [
  { href: '/dashboard', label: '학습 대시보드' },
  { href: '/guides', label: '학부모 가이드' },
  { href: '/columns', label: '수학 학습 칼럼' },
  { href: '/concepts', label: '학습 과학 개념' },
  { href: '/books', label: '도서 추천' },
  { href: '/problems', label: '수능모평 수학 문제' },
  { href: '/essay-problems', label: '대학별 고사 수학 문제' },
] as const;
