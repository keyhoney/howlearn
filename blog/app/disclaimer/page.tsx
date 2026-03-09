import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "면책 조항",
  description: "본 사이트 콘텐츠의 성격과 한계에 대한 안내입니다.",
  path: "/disclaimer",
  noindex: true,
});

export default function DisclaimerPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        면책 조항
      </h1>
      <div className="prose prose-slate prose-lg max-w-none dark:prose-invert">
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트는 학습과학, 인지심리, 교육이론 및 학습전략에 관한 일반적인 참고 정보를 제공하는 지식 아카이브입니다.
          제공되는 내용은 정보 제공 및 교육적 이해를 돕기 위한 것이며, 개별 상황에 대한 전문적 판단을 대신하지 않습니다.
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트의 콘텐츠는 전문가의 진단, 치료, 상담, 처방 또는 임상적 평가를 대체하지 않으며, 의료행위나 임상적 판단을 제공하지 않습니다.
          ADHD, 불안, 우울, 학습장애, 발달 특성 등 학습·행동·정서·정신건강에 관한 구체적인 우려가 있으시면 자격을 갖춘 전문가와 상담하시기 바랍니다.
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          본 사이트에서 소개하는 이론, 연구 결과, 학습 전략은 일반적인 경향이나 연구 맥락을 바탕으로 정리된 것입니다.
          학습과학은 평균적 경향이나 집단 연구를 다루는 경우가 많아, 특정 개인의 연령, 환경, 목표, 건강 상태, 질환, 발달 특성에 그대로 맞지 않을 수 있으며, 적용 가능성과 효과는 상황에 따라 달라질 수 있습니다.
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          연구 결과는 맥락, 표본, 연구 설계, 그리고 최신 후속 연구에 따라 해석이 달라질 수 있습니다.
          학습과학 및 심리학 관련 지식은 지속적으로 업데이트되므로, 본 사이트의 모든 정보가 항상 최신의 연구 합의나 완전한 사실을 반영한다고 보장하지 않으며, 게시 시점 이후 새로운 연구나 반박 근거가 나올 수 있습니다.
        </p>
        <p className="text-slate-500 dark:text-slate-400">
          본 사이트의 콘텐츠는 참고용으로 제공되며, 이를 바탕으로 한 학습법·교육적 의사결정 및 생활상의 판단과 적용에 대한 책임은 이용자에게 있습니다.
          사이트 내용을 적용한 결과에 대해서는 보장하지 않습니다.
          외부 링크나 참고 자료의 정확성, 완전성, 최신성에 대해서도 별도의 보증을 제공하지 않습니다.
        </p>
      </div>
    </main>
  );
}
