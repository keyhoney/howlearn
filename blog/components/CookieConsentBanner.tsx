"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CONSENT_COOKIE_NAME = "cookie_consent";
const CONSENT_EXPIRY_DAYS = 365;

function setConsentCookie(accepted: boolean) {
  const value = accepted ? "1" : "0";
  const expires = new Date();
  expires.setDate(expires.getDate() + CONSENT_EXPIRY_DAYS);
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
}

function getConsentCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CONSENT_COOKIE_NAME}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Cookie consent banner (CMP). Uses cookies for storage.
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getConsentCookie() === null) {
      queueMicrotask(() => setVisible(true));
    }
  }, []);

  const accept = () => {
    setConsentCookie(true);
    setVisible(false);
  };

  const decline = () => {
    setConsentCookie(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.3)] sm:px-6 sm:py-4 transition-colors"
      role="dialog"
      aria-label="쿠키 동의"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          이 사이트는 분석 및 서비스 편의를 위해 쿠키를 사용할 수 있습니다.{" "}
          <Link
            href="/privacy"
            className="font-medium text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            개인정보처리방침
          </Link>
        </p>
        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            type="button"
            onClick={decline}
            className="min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-600 sm:min-h-0"
          >
            필수만
          </button>
          <button
            type="button"
            onClick={accept}
            className="min-h-[44px] rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 sm:min-h-0"
          >
            전체 동의
          </button>
        </div>
      </div>
    </div>
  );
}
