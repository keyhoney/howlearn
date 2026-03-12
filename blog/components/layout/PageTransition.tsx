"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * motion/react는 RSC/하이드레이션 mismatch·vendor 청크 이슈를 피하기 위해 레이아웃 래퍼에서는 사용하지 않습니다.
 * animate-in 유틸도 SSR 첫 페인트와 클라이언트가 어긋날 수 있어, 마운트 이후에만 페이드 클래스를 붙입니다.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 서버와 클라이언트 첫 렌더는 동일한 마크업(클래스·인라인 스타일 없음) → hydration 일치
  return (
    <div key={pathname} className="flex flex-col flex-1">
      <div
        className={
          mounted
            ? "animate-in fade-in slide-in-from-bottom-1 duration-300 ease-out fill-mode-both flex flex-col flex-1"
            : "flex flex-col flex-1"
        }
      >
        {children}
      </div>
    </div>
  );
}
