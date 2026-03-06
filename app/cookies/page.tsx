import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "쿠키 정책",
  description: "사이트의 쿠키 사용 및 CMP(동의 관리) 안내입니다.",
};

export default function CookiesPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">쿠키 정책</h1>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-zinc-600 dark:text-zinc-400">
          최종 업데이트: 2025년 3월 5일
        </p>
        <h2>1. 쿠키 사용 목적</h2>
        <p>
          본 사이트는 방문 통계(Google Analytics), 맞춤 광고(Google AdSense), 서비스
          이용 편의를 위해 쿠키를 사용할 수 있습니다.
        </p>
        <h2>2. 동의 관리(CMP)</h2>
        <p>
          유럽(EEA/영국) 등 일부 지역에서는 개인화 광고를 위해 동의 관리 플랫폼(CMP)을
          통해 쿠키 동의를 받을 수 있습니다. 동의 배너에서 필수/선택 쿠키를 구분해
          설정할 수 있습니다.
        </p>
        <h2>3. 쿠키 설정</h2>
        <p>
          브라우저 설정에서 쿠키를 비활성화할 수 있으나, 일부 기능이 제한될 수
          있습니다.
        </p>
        <h2>4. 문의</h2>
        <p>
          쿠키 정책 관련 문의는 연락처 페이지를 이용해 주세요.
        </p>
      </div>
    </main>
  );
}
