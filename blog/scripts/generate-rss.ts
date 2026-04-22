import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { getContentByType } from "../lib/content";
import { buildRssXmlForGuides } from "../lib/rss-builder";
import { site, getSiteUrl } from "../lib/site";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const baseUrl = getSiteUrl();
  const posts = await getContentByType("guide");
  const xml = buildRssXmlForGuides({
    siteName: site.name,
    siteDescription: site.description,
    baseUrl,
    guides: posts.map((p) => ({
      title: p.title,
      slug: p.slug,
      summary: p.summary,
      publishedAt: p.publishedAt,
    })),
  });

  const outDir = join(__dirname, "..", "public");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "rss.xml");
  writeFileSync(outPath, xml, "utf8");
  console.log(`Wrote ${outPath} (${posts.length} guides, base ${baseUrl})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
