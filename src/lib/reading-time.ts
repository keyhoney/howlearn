/** 한국어 교육 콘텐츠 기준 분당 글자 수 (공백 제외) */
export const KOREAN_READING_CHARS_PER_MINUTE = 500;

/** MDX/Markdown 본문에서 읽기 시간 계산용 순수 텍스트 추출 */
export function stripContentForReadingCount(source: string): string {
  return source
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/<[A-Za-z][^>]*\/>/g, ' ')
    .replace(/<[A-Za-z][^>]*>[\s\S]*?<\/[A-Za-z][^>]*>/g, ' ')
    .replace(/\{[^"'`{}]*\}/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/[*_~|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 공백을 제외한 읽기 대상 글자 수 */
export function countReadingCharacters(source: string): number {
  return stripContentForReadingCount(source).replace(/\s/g, '').length;
}

/** 본문 글자 수 기반 예상 읽기 시간(분). 최소 1분 */
export function estimateReadingMinutes(
  source: string,
  charsPerMinute = KOREAN_READING_CHARS_PER_MINUTE,
): number {
  if (!source.trim()) return 1;
  const chars = countReadingCharacters(source);
  if (chars === 0) return 1;
  return Math.max(1, Math.ceil(chars / charsPerMinute));
}

export function formatReadingTime(minutes: number): string {
  return `약 ${minutes}분`;
}

export function formatReadingTimeLabel(minutes: number, suffix = ''): string {
  const base = formatReadingTime(minutes);
  return suffix ? `${base} ${suffix}` : base;
}
