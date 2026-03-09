import { getContentByType } from "@/lib/content";
import { site } from "@/lib/site";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RSS 내 모든 링크에 사용할 기준 URL. 요청 Host 기준으로 하면 배포 도메인이 항상 맞음. */
function getBaseUrl(request: Request): string {
  try {
    const origin = new URL(request.url).origin;
    if (origin && origin !== "http://localhost:3000" && origin !== "http://127.0.0.1:3000") {
      return origin;
    }
  } catch {
    // ignore
  }
  return site.url;
}

/** 요청 시점의 블로그 목록으로 생성되므로, 새 게시물은 별도 빌드 없이 RSS에 반영됩니다. */
export async function GET(request: Request) {
  const baseUrl = getBaseUrl(request);
  const posts = await getContentByType("blog");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <description>${escapeXml(site.description)}</description>
    <link>${escapeXml(baseUrl)}</link>
    <atom:link href="${escapeXml(baseUrl)}/rss.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map((p) => {
        const title = p.title || p.slug;
        const description = p.summary || "";
        const date = p.publishedAt || "";
        const url = `${baseUrl}/blog/${encodeURIComponent(p.slug)}`;
        return `    <item>
      <title>${escapeXml(title)}</title>
      <description>${escapeXml(description)}</description>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      ${date ? `<pubDate>${new Date(date).toUTCString()}</pubDate>` : ""}
    </item>`;
      })
      .join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
