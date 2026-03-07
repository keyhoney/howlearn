import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Terms of Service",
  description: "이용약관",
});

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-8">Terms of Service</h1>
      <div className="prose prose-slate prose-lg max-w-none">
        <p>본 약관은 학습과학 기반 지식 아카이브가 제공하는 서비스의 이용조건 및 절차, 이용자와 사이트의 권리, 의무, 책임사항을 규정합니다.</p>
        <h2>1. 서비스의 제공 및 변경</h2>
        <p>사이트는 이용자에게 양질의 지식 콘텐츠를 제공하며, 필요에 따라 서비스의 내용을 변경할 수 있습니다.</p>
        <h2>2. 저작권</h2>
        <p>사이트 내 모든 콘텐츠의 저작권은 학습과학 기반 지식 아카이브에 있으며, 무단 전재 및 재배포를 금합니다.</p>
      </div>
    </div>
  );
}
