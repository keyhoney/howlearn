import type { DomainSlug } from "./types";

/** 카테고리(도메인) 표시 순서: 카테고리_태그_분류.md 기준 5대 영역 순 */
export const DOMAIN_ORDER: DomainSlug[] = [
  "cognitive-psychology",
  "neuroscience",
  "educational-psychology",
  "developmental-psychology",
  "motivation-emotion",
];

export const domainInfo: Record<
  DomainSlug,
  { name: string; description: string; color: string }
> = {
  "cognitive-psychology": {
    name: "인지심리학",
    description:
      "기억, 주의, 지각, 문제해결 등 인간의 마음이 정보를 처리하는 방식을 탐구합니다.",
    color:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700",
  },
  "neuroscience": {
    name: "신경과학",
    description:
      "뇌의 구조와 기능, 신경망의 변화를 통해 학습과 발달의 생물학적 기반을 이해합니다.",
    color:
      "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700",
  },
  "educational-psychology": {
    name: "교육심리학",
    description:
      "교수-학습 과정, 교육 환경, 평가 등 실제 교육 현장에서 일어나는 심리적 현상을 다룹니다.",
    color:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700",
  },
  "developmental-psychology": {
    name: "발달심리학",
    description:
      "유아기부터 청소년기까지 연령에 따른 인지적, 정서적, 사회적 변화 과정을 연구합니다.",
    color:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700",
  },
  "motivation-emotion": {
    name: "동기 및 정서심리학",
    description:
      "학습을 이끄는 내적 동력과 감정이 인지 과정에 미치는 영향을 분석합니다.",
    color:
      "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-700",
  },
};
