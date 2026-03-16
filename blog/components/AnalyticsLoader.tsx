"use client";

import { useEffect, useRef } from "react";
import { hasAnalyticsConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const FALLBACK_MS = 5000;

const CONSENT_UPDATE_EVENT = "consent-update";

/**
 * Loads gtag.js only when the user has consented to analytics, and after first interaction (or FALLBACK_MS).
 * 동의 배너·쿠키 설정과 일치: 분석 동의가 있을 때만 GA를 로드합니다.
 */
export function AnalyticsLoader() {
  const loaded = useRef(false);

  useEffect(() => {
    if (!GA_ID || typeof window === "undefined") return;

    const loadGtag = () => {
      if (loaded.current) return;
      if (!hasAnalyticsConsent()) return;
      loaded.current = true;

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      script.onload = () => {
        if (typeof window.gtag === "function") {
          (window.gtag as (c: string, ...args: unknown[]) => void)("js", new Date());
          (window.gtag as (c: string, ...args: unknown[]) => void)("config", GA_ID);
        }
      };
      document.head.appendChild(script);
    };

    const onInteraction = () => {
      loadGtag();
      removeListeners();
    };

    const removeListeners = () => {
      window.removeEventListener("scroll", onInteraction, { capture: true });
      window.removeEventListener("click", onInteraction, { capture: true });
      window.removeEventListener("keydown", onInteraction, { capture: true });
    };

    // 동의가 이미 있으면 상호작용 후 로드
    if (hasAnalyticsConsent()) {
      window.addEventListener("scroll", onInteraction, { capture: true, once: true });
      window.addEventListener("click", onInteraction, { capture: true, once: true });
      window.addEventListener("keydown", onInteraction, { capture: true, once: true });
      const timeout = window.setTimeout(loadGtag, FALLBACK_MS);
      return () => {
        removeListeners();
        window.clearTimeout(timeout);
      };
    }

    // 동의가 없을 때: 배너에서 "전체 동의" 후 즉시 로드할 수 있도록 이벤트 구독
    const onConsentUpdate = (e: CustomEvent<{ analytics?: boolean }>) => {
      if (e.detail?.analytics) loadGtag();
    };
    window.addEventListener(CONSENT_UPDATE_EVENT, onConsentUpdate as EventListener);
    return () => window.removeEventListener(CONSENT_UPDATE_EVENT, onConsentUpdate as EventListener);
  }, []);

  return null;
}
