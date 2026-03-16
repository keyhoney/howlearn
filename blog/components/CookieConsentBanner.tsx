"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getConsent, setConsent, type ConsentState } from "@/lib/consent";

/**
 * 쿠키 동의 배너 (CMP).
 * - 정책과 일치: 분석·광고를 구분하여 저장하며, 쿠키 설정 페이지에서 변경 가능합니다.
 * - AdSense 도입 시 EEA·영국·스위스 이용자 맞춤형 광고는 동일한 동의 값으로 Google 동의 모드 등에 연동할 수 있습니다.
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getConsent() === null) {
      queueMicrotask(() => setVisible(true));
    }
  }, []);

  const save = (state: ConsentState) => {
    setConsent(state);
    setVisible(false);
    if (typeof window !== "undefined" && state.analytics) {
      window.dispatchEvent(new CustomEvent("consent-update", { detail: { analytics: true } }));
    }
  };

  const acceptAll = () => save({ analytics: true, advertising: true });
  const declineNonEssential = () => save({ analytics: false, advertising: false });

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.3)] sm:px-6 sm:py-4 transition-colors"
      role="dialog"
      aria-label="쿠키 동의"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          이 사이트는 필수 쿠키와 함께, 분석(Google Analytics) 및 광고(맞춤형 광고, 추후 적용 시)용 쿠키를 사용할 수 있습니다.{" "}
          <Link
            href="/privacy"
            className="font-medium text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            개인정보처리방침
          </Link>
          ,{" "}
          <Link
            href="/cookies#settings"
            className="font-medium text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            쿠키 설정
          </Link>
          에서 선택을 변경할 수 있습니다.
        </p>
        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            type="button"
            onClick={declineNonEssential}
            className="min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-600 sm:min-h-0"
          >
            필수만
          </button>
          <Link
            href="/cookies#settings"
            className="min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-600 sm:min-h-0 inline-flex items-center justify-center"
          >
            선택 설정
          </Link>
          <button
            type="button"
            onClick={acceptAll}
            className="min-h-[44px] rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 sm:min-h-0"
          >
            전체 동의
          </button>
        </div>
      </div>
    </div>
  );
}
