/**
 * 사이트 메타데이터 (RSS, sitemap, robots, canonical 등에서 사용)
 */
export const site = {
  name: "Learning Science Knowledge Archive",
  description:
    "A knowledge archive for learning science-based parenting education, featuring guides, concepts, toolkits, blogs, and books.",
  get url() {
    return (
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.APP_URL ||
      "http://localhost:3000"
    );
  },
};

export const author = {
  name: "Learning Science Archive",
  get url() {
    return `${site.url}/about`;
  },
};
