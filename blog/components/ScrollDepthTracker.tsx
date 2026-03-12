"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackScrollDepth } from "@/lib/analytics";

/** 가이드가 아닌 페이지용 기본 스크롤 임계값 */
const DEFAULT_THRESHOLDS = [50, 90];
const GUIDE_THRESHOLDS = [25, 50, 75, 90];

/**
 * Sends GA4 scroll_depth event when the user reaches scroll thresholds.
 * Guides: 25/50/75/90%; other pages: 50/90%.
 */
export function ScrollDepthTracker() {
  const pathname = usePathname();
  const sent = useRef<Set<number>>(new Set());
  const thresholds =
    pathname?.startsWith("/guides") ? GUIDE_THRESHOLDS : DEFAULT_THRESHOLDS;

  useEffect(() => {
    sent.current.clear();
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
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
