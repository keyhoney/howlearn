/**
 * 쿠키 동의 상태 (CMP)
 * - 정책 문서와 실제 동의 배너·설정 페이지가 일치하도록 분석/광고를 구분합니다.
 * - AdSense 도입 시 EEA·영국·스위스 이용자 맞춤형 광고에는 Google 인증 CMP 또는 동의 모드 연동 시 이 값을 사용할 수 있습니다.
 */

export const CONSENT_COOKIE_NAME = "cookie_consent";
const CONSENT_EXPIRY_DAYS = 365;

export type ConsentState = {
  analytics: boolean;
  advertising: boolean;
};

function getExpires(): Date {
  const d = new Date();
  d.setDate(d.getDate() + CONSENT_EXPIRY_DAYS);
  return d;
}

/** 쿠키에 저장할 문자열: a=분석, v=광고(advertising), 1/0 */
function encode(state: ConsentState): string {
  return `${state.analytics ? "1" : "0"}${state.advertising ? "1" : "0"}`;
}

function decode(value: string): ConsentState | null {
  if (!value || value.length < 2) return null;
  const a = value[0] === "1";
  const v = value[1] === "1";
  return { analytics: a, advertising: v };
}

/** 이전 단일 값 쿠키(1/0) 호환: "1" → 전체 동의, "0" → 필수만 */
function decodeLegacy(value: string): ConsentState {
  if (value === "1") return { analytics: true, advertising: true };
  return { analytics: false, advertising: false };
}

/**
 * 클라이언트에서만 호출. 현재 저장된 동의 상태를 반환합니다.
 * 쿠키가 없으면 null(아직 선택 안 함).
 */
export function getConsent(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CONSENT_COOKIE_NAME}=([^;]*)`)
  );
  const raw = match ? decodeURIComponent(match[1]).trim() : null;
  if (!raw) return null;
  const decoded = decode(raw);
  if (decoded) return decoded;
  return decodeLegacy(raw);
}

/**
 * 동의 상태를 쿠키에 저장합니다.
 */
export function setConsent(state: ConsentState): void {
  if (typeof document === "undefined") return;
  const value = encode(state);
  const expires = getExpires().toUTCString();
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; path=/; expires=${expires}; SameSite=Lax`;
}

/** 분석(GA 등) 로드 가능 여부 */
export function hasAnalyticsConsent(): boolean {
  const c = getConsent();
  return c?.analytics ?? false;
}

/** 광고(맞춤형, AdSense 등) 로드 가능 여부 — 추후 AdSense·CMP 연동 시 사용 */
export function hasAdvertisingConsent(): boolean {
  const c = getConsent();
  return c?.advertising ?? false;
}
