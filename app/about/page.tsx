import { SectionHeader } from "@/components/SectionHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "저자 소개",
  description: "학습 과학 지식 브랜드와 5가지 영역(인지·뇌·교육·발달·동기·정서)을 소개합니다.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <SectionHeader
        title="저자 소개"
        description="학습과학 지식 브랜드 소개"
        badge="소개"
      />
      <div className="space-y-5 text-base leading-relaxed text-foreground md:text-lg">
        <p>
          이 사이트는 <strong>학습 과학</strong>을 대주제로, 학부모와 교육자를 위해
          인지심리학·신경과학(뇌과학)·교육심리학·발달심리학·동기·정서심리학을 바탕으로 한
          글, 가이드, 개념 사전, 툴킷을 제공합니다.
        </p>
        <p>
          연구 기반 콘텐츠를 바탕으로 가정과 현장에서 적용할 수 있는 구체적인 방법과
          마음가짐을 나누고자 합니다.
        </p>
        <p className="text-[var(--muted)]">
          문의나 제안이 있으시면 연락해 주세요.
        </p>
      </div>
    </main>
  );
}
