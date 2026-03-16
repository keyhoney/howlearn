/** 프로덕션 도메인: non-www → www로 통일해 검색·canonical·sitemap 일관성 유지 */
const CANONICAL_HOST = "www.howlearn.kr";

/**
 * 사이트 메타데이터 (RSS, sitemap, robots, SEO, canonical 등 단일 출처)
 * 브랜드·설명·도메인 정체성은 여기만 수정하면 전체에 반영됩니다.
 *
 * url: 검색엔진(sitemap, robots.txt)·canonical·OG에 사용됩니다.
 * 프로덕션에서는 NEXT_PUBLIC_SITE_URL=https://www.howlearn.kr 로 설정하는 것을 권장합니다.
 * howlearn.kr(비-www)로 설정해도 내부적으로 www로 정규화됩니다.
 */
function getSiteUrl(): string {
  let base: string;
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    base = process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  } else if (process.env.APP_URL) {
    base = process.env.APP_URL.replace(/\/$/, "");
  } else if (process.env.VERCEL_URL) {
    base = `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  } else {
    return "http://localhost:3000";
  }
  // 프로덕션 도메인 howlearn.kr(비-www) → www로 통일 (검색엔진·canonical·sitemap 일관성)
  try {
    const u = new URL(base);
    if (u.hostname === "howlearn.kr") {
      u.hostname = CANONICAL_HOST;
      u.protocol = "https:";
      return u.origin;
    }
  } catch {
    // ignore
  }
  return base;
}

export const site = {
  name: "HowLearn",
  description:
    "자녀의 학습을 과학적으로 이해하고 돕고 싶은 부모를 위한 학습 과학 기반 지식 공간입니다. 상황별 실천 가이드를 한 곳에서 탐색할 수 있습니다.",
  get url() {
    return getSiteUrl();
  },
};

/** 메타·바이라인용: 브랜드명(기존 호환) */
export const author = {
  name: "HowLearn",
  get url() {
    return `${site.url}/about`;
  },
};

/**
 * 전문성 표시 (E-E-A-T, people-first): 글마다 저자·자격·검토·About 링크에 사용합니다.
 * 실명을 쓰지 않을 경우에도 "운영자 + 자격"으로 출처를 명확히 합니다.
 */
export const authorByline = {
  /** 저자 표시명 (실명 사용 시 여기 변경) */
  name: "HowLearn 운영자",
  /** 한 줄 자격 요약 — About 페이지 학력·자격과 일치시키세요 */
  credentials: "현직 수학 교사, 중등 1급 정교사(수학)",
  /** 검토 기준 설명 — About #review-policy와 연결 */
  reviewerNote: "학습과학·수학교육 기준 정기 검토",
};
