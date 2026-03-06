import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "고지 및 면책",
  description: "본 블로그 콘텐츠의 성격과 한계에 대한 안내입니다.",
};

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">고지 및 면책</h1>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p>
          본 블로그는 <strong>교육·심리 관련 정보 제공</strong>을 목적으로 하며,
          전문적인 치료법, 진단, 의료·심리 상담을 대체하지 않습니다.
        </p>
        <p>
          자녀의 학습이나 정서에 관한 구체적인 문제가 있다면, 필요 시 교육
          전문가나 상담사와 상담하시기 바랍니다.
        </p>
        <p className="text-zinc-600 dark:text-zinc-400">
          본 사이트의 글은 참고용이며, 개별 상황에 따라 적용이 다를 수 있습니다.
        </p>
      </div>
    </main>
  );
}
