import type { ReactNode } from "react";

/** FAQ 한 항목 (질문 + 답변). answer는 문자열 또는 React 노드. */
export type FAQItem = {
  question: string;
  answer: ReactNode;
};
