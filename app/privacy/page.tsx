import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: "사이트의 개인정보 수집·이용·보호에 관한 안내입니다.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">
        개인정보 처리방침
      </h1>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-zinc-600 dark:text-zinc-400">
          최종 업데이트: 2025년 3월 5일
        </p>
        <h2>1. 수집하는 개인정보 항목</h2>
        <p>
          본 사이트는 방문자 식별, 방문 통계, 맞춤 서비스 제공 등을 위해 쿠키 및
          Google Analytics 등을 통해 일부 정보(방문 일시, 기기 종류, 브라우저 등)를
          수집할 수 있습니다.
        </p>
        <h2>2. 개인정보의 이용 목적</h2>
        <p>
          수집된 정보는 서비스 개선, 트래픽 분석, 광고 표시(Google AdSense 등)에
          활용됩니다.
        </p>
        <h2>3. 쿠키 사용</h2>
        <p>
          본 사이트는 쿠키를 사용합니다. 유럽(EEA/영국) 등 일부 지역 방문자에게는
          동의 배너를 통해 선택적 쿠키 저장을 안내합니다.
        </p>
        <h2>4. 제3자 제공</h2>
        <p>
          Google Analytics, Google AdSense 등 제3자 서비스를 사용할 수 있으며,
          해당 서비스의 개인정보 처리방침이 적용됩니다.
        </p>
        <h2>5. 문의</h2>
        <p>
          개인정보 처리에 관한 문의는 사이트 내 연락처를 통해 요청하실 수
          있습니다.
        </p>
      </div>
    </main>
  );
}
