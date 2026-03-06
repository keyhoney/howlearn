/**
 * 학습과학 5대 영역 정의.
 * label은 frontmatter category 값 및 /c/[category] URL과 동일하게 사용.
 */
export const LEARNING_SCIENCE_DOMAINS = [
  {
    id: "cognitive",
    label: "인지심리학",
    description: "주의, 기억, 인지부하 등 학습과 직접 연결되는 인지 과정을 다룹니다.",
  },
  {
    id: "neuroscience",
    label: "신경과학(뇌과학)",
    description: "뇌 구조·기능과 학습, 발달의 관계를 신경과학 연구로 설명합니다.",
  },
  {
    id: "educational",
    label: "교육심리학",
    description: "교수·학습 설계, 평가, 동기화 등 교육 현장에 적용되는 심리학입니다.",
  },
  {
    id: "developmental",
    label: "발달심리학",
    description: "연령별 인지·정서·사회성 발달과 학습 시기에 맞는 접근을 다룹니다.",
  },
  {
    id: "motivation-emotion",
    label: "동기·정서심리학",
    description: "학습 동기, 불안, 흥미, 자기조절 등 동기와 정서가 학습에 미치는 영향을 다룹니다.",
  },
] as const;

export type LearningScienceDomainId = (typeof LEARNING_SCIENCE_DOMAINS)[number]["id"];
export type LearningScienceDomainLabel = (typeof LEARNING_SCIENCE_DOMAINS)[number]["label"];

/** 5대 영역 label 배열 (필터·아카이브 순서 고정) */
export const DOMAIN_LABELS = LEARNING_SCIENCE_DOMAINS.map((d) => d.label);

/** label로 영역 정보 조회 */
export function getDomainByLabel(label: string) {
  return LEARNING_SCIENCE_DOMAINS.find((d) => d.label === label);
}
