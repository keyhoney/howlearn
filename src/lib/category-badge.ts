/** frontmatter `category` / `categories`에 쓰는 5개 학문 분야 */
export const SCIENCE_CATEGORIES = [
  '인지심리학',
  '신경과학',
  '교육심리학',
  '발달심리학',
  '동기 및 정서심리학',
] as const;

export type ScienceCategory = (typeof SCIENCE_CATEGORIES)[number];

const CATEGORY_BADGE_CLASS: Record<ScienceCategory, string> = {
  인지심리학: 'app-badge-cat-cognitive',
  신경과학: 'app-badge-cat-neuroscience',
  교육심리학: 'app-badge-cat-educational',
  발달심리학: 'app-badge-cat-developmental',
  '동기 및 정서심리학': 'app-badge-cat-motivation-emotion',
};

export function getCategoryBadgeClass(category: string): string {
  const trimmed = category.trim();
  if (trimmed in CATEGORY_BADGE_CLASS) {
    return CATEGORY_BADGE_CLASS[trimmed as ScienceCategory];
  }
  return 'app-badge-neutral';
}
