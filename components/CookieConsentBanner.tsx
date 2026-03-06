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
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * 쿠키 동의 배너 (CMP).
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getConsentCookie() === null) {
      setVisible(true);
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
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--background)] px-4 py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] sm:px-6 sm:py-4"
      role="dialog"
      aria-label="쿠키 동의"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          이 사이트는 방문 통계 및 맞춤 광고를 위해 쿠키를 사용합니다. 계속 이용하시면
          쿠키 사용에 동의하는 것으로 간주됩니다.{" "}
          <Link
            href="/privacy"
            className="font-medium text-[var(--brand-500)] underline underline-offset-2 hover:text-[var(--brand-600)]"
          >
            개인정보 처리방침
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={decline}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-[var(--muted-bg)]"
          >
            필수만
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-xl bg-[var(--brand-500)] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[var(--brand-600)]"
          >
            모두 허용
          </button>
        </div>
      </div>
    </div>
  );
}
