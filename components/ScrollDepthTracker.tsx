"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackScrollDepth } from "@/lib/analytics";

const BLOG_THRESHOLDS = [50, 90];
const GUIDE_THRESHOLDS = [25, 50, 75, 90];

/**
 * 페이지 스크롤 깊이 도달 시 GA4 scroll_depth 이벤트 전송.
 * 가이드 페이지는 25/50/75/90%, 그 외는 50/90%.
 */
export function ScrollDepthTracker() {
  const pathname = usePathname();
  const sent = useRef<Set<number>>(new Set());
  const thresholds = pathname?.startsWith("/guides") ? GUIDE_THRESHOLDS : BLOG_THRESHOLDS;

  useEffect(() => {
    sent.current.clear();
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const percent = Math.round((scrollTop / docHeight) * 100);

      for (const threshold of thresholds) {
        if (percent >= threshold && !sent.current.has(threshold)) {
          sent.current.add(threshold);
          trackScrollDepth(threshold);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [thresholds]);

  return null;
}
