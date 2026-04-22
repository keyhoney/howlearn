import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { getAllContent, getContentByType } from "../lib/content";
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

  // Workers 런타임에서는 content/ 파일시스템 접근이 불가하므로,
  // 목록/필터 페이지에서 사용할 콘텐츠 인덱스를 빌드 시점에 스냅샷으로 생성합니다.
  const allContent = await getAllContent();
  const dataDir = join(__dirname, "..", "data");
  mkdirSync(dataDir, { recursive: true });
  const contentIndexPath = join(dataDir, "content-index.json");
  writeFileSync(contentIndexPath, JSON.stringify(allContent, null, 2), "utf8");
  console.log(`Wrote ${contentIndexPath} (${allContent.length} items)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
