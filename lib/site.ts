/**
 * 사이트·저자 정보 (JSON-LD, 메타데이터, 링크에 사용)
 */
export const site = {
  name: "학습과학 지식 브랜드",
  description: "학습 과학을 대주제로, 인지심리학·신경과학·교육심리학·발달심리학·동기·정서심리학을 다루는 학부모·교육자용 사이트. 가이드, 개념 사전, 툴킷, 블로그, 전자책.",
  get url() {
    return process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  },
};

export const author = {
  name: "블로그 저자",
  get url() {
    return `${site.url}/about`;
  },
};
