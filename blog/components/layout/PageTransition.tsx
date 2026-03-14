"use client";

import { usePathname } from "next/navigation";

/**
 * 레이아웃 래퍼. pathname 변경 시 key로 리마운트.
 * motion 사용 시 서버/클라이언트 인라인 스타일 차이로 수화(hydration) 오류가 나므로
 * 고정 클래스만 사용해 SSR과 첫 페인트가 동일하도록 합니다.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="flex flex-col flex-1">
      {children}
    </div>
  );
}
