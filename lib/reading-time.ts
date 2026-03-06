/** 한글 기준 분당 약 500자로 읽는 시간(분) 계산 */
const CHARS_PER_MINUTE = 500;

export function getReadingTimeMinutes(content: string): number {
  if (!content || typeof content !== "string") return 0;
  const stripped = content.replace(/^---[\s\S]*?---/, "").replace(/[#*_`\[\]()]/g, "").trim();
  const chars = stripped.length;
  const minutes = Math.max(1, Math.ceil(chars / CHARS_PER_MINUTE));
  return minutes;
}
