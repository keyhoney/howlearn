import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 호스트 통일: howlearn.kr(비-www) → https://www.howlearn.kr 301 리다이렉트
 * 검색엔진·Search Console·canonical과 동일한 호스트로 수렴시키기 위함.
 */
export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname;
  if (hostname === "howlearn.kr") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = "www.howlearn.kr";
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 다음을 제외한 모든 경로에서 실행 (정적 파일·API·_next 제외)
     * - _next/static
     * - _next/image
     * - favicon.ico 등
     */
    "/((?!_next/static|_next/image|favicon\\.ico|favicon\\.png|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff2?)$).*)",
  ],
};
