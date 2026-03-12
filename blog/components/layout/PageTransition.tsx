"use client";

import { usePathname } from "next/navigation";

/**
 * motion/react·animate-in은 SSR/하이드레이션 mismatch와
 * react-hooks/set-state-in-effect(빌드 ESLint)를 피하기 위해
 * 레이아웃 래퍼는 고정 클래스만 사용합니다.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="flex flex-col flex-1">
      {children}
    </div>
  );
}
