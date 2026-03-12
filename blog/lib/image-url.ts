/**
 * 이미지 베이스 URL (별도 호스팅 예: Cloudflare Pages)
 * .env에 NEXT_PUBLIC_IMAGE_BASE_URL=https://learninsight.pages.dev 설정
 */
const IMG_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";

/**
 * 상대 경로(예: /guides/...)를 베이스 URL과 합쳐 절대 URL로 반환.
 * 이미 http(s)로 시작하면 그대로 반환.
 * 베이스가 없고 상대 경로면 APP_URL과 붙여서 반환(OG 등 절대 URL 필요 시).
 */
export function toImageUrl(src: string): string {
  if (!src) return src;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  const base = IMG_BASE_URL.replace(/\/$/, "");
  const path = src.startsWith("/") ? src : `/${src}`;
  if (base) return `${base}${path}`;
  const appUrl = process.env.APP_URL ?? "";
  return appUrl ? `${appUrl.replace(/\/$/, "")}${path}` : src;
}
