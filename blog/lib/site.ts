/**
 * 사이트 메타데이터 (RSS, sitemap, robots, SEO, canonical 등 단일 출처)
 * 브랜드·설명·도메인 정체성은 여기만 수정하면 전체에 반영됩니다.
 *
 * url: 검색엔진(sitemap, robots.txt)·canonical·OG에 사용됩니다.
 * 프로덕션에서는 반드시 NEXT_PUBLIC_SITE_URL을 실제 도메인으로 설정하세요.
 */
function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}

export const site = {
  name: "HowLearn",
  description:
    "자녀의 학습을 과학적으로 이해하고 돕고 싶은 부모를 위한 학습과학 기반 지식 공간입니다. '왜 그럴까?'에 대한 개념, 상황별 실천 가이드, 툴킷, 추천 도서를 한곳에서 탐색할 수 있습니다.",
  get url() {
    return getSiteUrl();
  },
};

export const author = {
  name: "HowLearn",
  get url() {
    return `${site.url}/about`;
  },
};
