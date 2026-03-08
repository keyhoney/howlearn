/** 페이지당 항목 수 옵션 (클라이언트/서버 공용, fs 미사용) */
export const PER_PAGE_OPTIONS = [12, 24, 48] as const;
export type PerPageOption = (typeof PER_PAGE_OPTIONS)[number];

export function isAllowedPerPage(n: number): n is PerPageOption {
  return (PER_PAGE_OPTIONS as readonly number[]).includes(n);
}
