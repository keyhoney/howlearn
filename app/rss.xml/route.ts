import { getAllByType, getDatePublished } from "@/lib/content";
import { site } from "@/lib/site";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getAllByType("blog");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <description>${escapeXml(site.description)}</description>
    <link>${escapeXml(site.url)}</link>
    <atom:link href="${escapeXml(site.url)}/rss.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map((p) => {
        const title = (p.frontmatter.title as string) || p.slug;
        const description = (p.frontmatter.description as string) || "";
        const date = getDatePublished(p.frontmatter) ?? (p.frontmatter.date as string) ?? "";
        const url = `${site.url}/blog/${encodeURIComponent(p.slug)}`;
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
