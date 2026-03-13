"use client";

import { usePathname } from "next/navigation";

/**
 * motion/react·animate-in은 SSR/하이드레이션 mismatch와
 * react-hooks/set-state-in-effect(빌드 ESLint)를 피하기 위해
 * 레이아웃 래퍼는 고정 클래스만 사용합니다.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // SSR HTML과 클라이언트 첫 페인트가 달라지면 hydration mismatch가 난다.
  // (예: 예전 번들에 animate-in이 남아 있거나, 확장 프로그램이 class를 만지는 경우)
  // 레이아웃 래퍼는 고정 클래스만 쓰고, 필요 시 suppressHydrationWarning으로 경고만 억제한다.
  return (
    <div
      key={pathname}
      className="flex flex-col flex-1"
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}
