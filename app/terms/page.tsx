import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관",
  description: "사이트 이용약관입니다.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">이용약관</h1>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-zinc-600 dark:text-zinc-400">
          최종 업데이트: 2025년 3월 5일
        </p>
        <h2>1. 목적</h2>
        <p>
          본 약관은 본 사이트(이하 &quot;서비스&quot;)의 이용 조건 및 절차, 이용자와
          운영자 간 권리·의무를 정합니다.
        </p>
        <h2>2. 이용</h2>
        <p>
          서비스의 콘텐츠는 교육·정보 목적으로 제공됩니다. 상업적 무단 전재·배포를
          금지합니다.
        </p>
        <h2>3. 면책</h2>
        <p>
          서비스의 글은 참고용이며, 개별 상황에 따른 결과에 대해 책임을 지지
          않습니다. 자세한 내용은 고지(disclaimer) 페이지를 참고해 주세요.
        </p>
        <h2>4. 문의</h2>
        <p>
          약관 관련 문의는 연락처 페이지를 통해 요청하실 수 있습니다.
        </p>
      </div>
    </main>
  );
}
