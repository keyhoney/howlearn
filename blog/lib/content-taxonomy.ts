/**
 * 카테고리·태그 분류 (단일 허용 목록)
 * - 원본: 개발 노트 / 카테고리_태그_분류.md
 * - 카테고리: ALLOWED_CATEGORIES(카테고리 열)만 사용
 * - 태그: ALLOWED_TAGS(학습과학_표준화_태그체계 학문별 하위 태그명)만 사용
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

/** 글에서 사용할 수 있는 태그. 학습과학_표준화_태그체계 기준 (학문별 하위 태그명). */
export const ALLOWED_TAGS = [
  "교수방법",
  "설계·평가",
  "이론·사회학습",
  "이론·지원",
  "학습관점",
  "신념·귀인",
  "정서·자기조절",
  "데이터·환경",
  "이론·행동주의",
  "동기기초",
  "목표·노력",
  "이론·동기",
  "이론·정서",
  "놀이·정체성",
  "발달기능",
  "발달기초",
  "사회발달",
  "청소년·전문성",
  "이론·발달",
  "이론·전문성",
  "가소성",
  "각성·수면",
  "감각·운동",
  "뇌구조",
  "신경작동",
  "신경화학",
  "예측·보상",
  "이론·가소성",
  "이론·공고화",
  "이론·보상",
  "회로·네트워크",
  "개념·표상",
  "난이도·착각",
  "메타인지",
  "이론·기억",
  "이론·멀티미디어",
  "이론·전이",
  "인지부하",
  "전이·자동화",
  "정보처리",
  "학습전략",
  "문제해결",
  "기억",
  "주의·통제",
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
