import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Privacy Policy",
  description: "개인정보처리방침",
});

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-8">Privacy Policy</h1>
      <div className="prose prose-slate prose-lg max-w-none">
        <p>본 개인정보처리방침은 학습과학 기반 지식 아카이브의 개인정보 수집 및 이용에 대한 내용을 담고 있습니다.</p>
        <h2>1. 수집하는 개인정보 항목</h2>
        <p>서비스 이용 과정에서 아래와 같은 정보들이 수집될 수 있습니다: IP 주소, 쿠키, 방문 일시, 서비스 이용 기록 등.</p>
        <h2>2. 개인정보의 수집 및 이용 목적</h2>
        <p>수집된 정보는 서비스 제공, 통계 분석, 서비스 개선을 위해서만 사용됩니다.</p>
      </div>
    </div>
  );
}
