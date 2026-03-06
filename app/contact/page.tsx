import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "연락처",
  description: "블로그 문의 및 연락처 안내.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">연락처</h1>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p>
          콘텐츠 제안, 협업, 오류 신고 등 문의가 있으시면 아래를 이용해 주세요.
        </p>
        <p className="text-zinc-600 dark:text-zinc-400">
          (실제 서비스 시 이메일·문의 폼 링크를 추가하세요.)
        </p>
      </div>
    </main>
  );
}
