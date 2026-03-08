/**
 * 사이트 메타데이터 (RSS, sitemap, robots, SEO, canonical 등 단일 출처)
 * 브랜드·설명·도메인 정체성은 여기만 수정하면 전체에 반영됩니다.
 */
export const site = {
  name: "Mathesis",
  description:
    "학습과학 기반 부모 교육을 위한 지식 아카이브입니다. 가이드, 개념, 툴킷, 블로그, 도서를 제공합니다.",
  get url() {
    return (
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.APP_URL ||
      "http://localhost:3000"
    );
  },
};

export const author = {
  name: "Mathesis",
  get url() {
    return `${site.url}/about`;
  },
};
