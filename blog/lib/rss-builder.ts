/**
 * RSS 2.0 XML 생성 (순수 함수). 런타임 fs 없이 문자열만 반환 — 빌드 스크립트·테스트에서 재사용.
 */

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export type RssGuideEntry = {
  title: string;
  slug: string;
  summary: string;
  publishedAt?: string;
};

export function buildRssXmlForGuides(opts: {
  siteName: string;
  siteDescription: string;
  baseUrl: string;
  guides: RssGuideEntry[];
}): string {
  const base = opts.baseUrl.replace(/\/$/, "");
  const items = opts.guides
    .map((p) => {
      const title = p.title || p.slug;
      const description = p.summary || "";
      const date = p.publishedAt || "";
      const url = `${base}/guides/${encodeURIComponent(p.slug)}`;
      return `    <item>
      <title>${escapeXml(title)}</title>
      <description>${escapeXml(description)}</description>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      ${date ? `<pubDate>${new Date(date).toUTCString()}</pubDate>` : ""}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(opts.siteName)}</title>
    <description>${escapeXml(opts.siteDescription)}</description>
    <link>${escapeXml(base)}</link>
    <atom:link href="${escapeXml(base)}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}
