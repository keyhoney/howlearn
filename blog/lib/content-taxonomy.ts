/**
 * 카테고리·태그 분류 (단일 허용 목록)
 * - 원본: math_blog 개발 노트 / 카테고리_태그_분류.md
 * - 카테고리: ALLOWED_CATEGORIES(카테고리 열)만 사용
 * - 태그: ALLOWED_TAGS(상위 태그 열)만 사용 (세부 태그 미사용)
 */

/** 글에서 사용할 수 있는 카테고리 (학습과학 5대 영역). 도메인 한글명과 동일. */
export const ALLOWED_CATEGORIES = [
  "인지심리학",
  "신경과학",
  "교육심리학",
  "발달심리학",
  "동기·정서심리학",
] as const;

export type AllowedCategory = (typeof ALLOWED_CATEGORIES)[number];

/** 글에서 사용할 수 있는 태그 (상위 태그만). 세부 태그는 사용하지 않음. */
export const ALLOWED_TAGS = [
  "주의집중",
  "기억과 복습",
  "작업기억",
  "메타인지",
  "인지부하",
  "이해와 전이",
  "문제해결",
  "수면",
  "스트레스",
  "실행기능",
  "뇌가소성",
  "자기효능감",
  "자기조절학습",
  "피드백",
  "평가",
  "목표설정",
  "부모개입",
  "인지발달",
  "자율성발달",
  "사춘기",
  "또래관계",
  "학년전환기",
  "학습동기",
  "자기결정성",
  "시험불안",
  "회복탄력성",
  "자존감",
  "무기력",
  "완벽주의",
] as const;

export type AllowedTag = (typeof ALLOWED_TAGS)[number];

/** 카테고리 값이 허용 목록에 있는지 */
export function isAllowedCategory(value: string): value is AllowedCategory {
  return (ALLOWED_CATEGORIES as readonly string[]).includes(value);
}

/** 태그 값이 허용 목록(상위 태그)에 있는지 */
export function isAllowedTag(value: string): value is AllowedTag {
  return (ALLOWED_TAGS as readonly string[]).includes(value);
}
