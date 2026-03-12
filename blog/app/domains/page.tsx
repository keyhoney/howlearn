import { DomainGrid } from "@/components/shared/DomainGrid";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "학문별 탐색",
  description: "학습과학을 구성하는 5가지 주요 학문 분야를 중심으로 지식을 탐색하세요.",
  path: "/domains",
});

export default function DomainsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">학문별 탐색</h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl">
          학습과학을 구성하는 5가지 주요 학문 분야를 중심으로 지식을 탐색하세요. 
          각 학문별로 관련된 가이드와 개념 문서를 모아볼 수 있습니다.
        </p>
      </div>
      <DomainGrid />
    </div>
  );
}
