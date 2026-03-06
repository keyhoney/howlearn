import { getAllByType } from "@/lib/content";
import { pathForType } from "@/lib/content-path";
import type { ContentType } from "@/lib/content";

export type SearchIndexItem = {
  type: ContentType;
  slug: string;
  path: string;
  title: string;
  description: string;
  tags: string[];
};

export async function GET() {
  const types: ContentType[] = ["blog", "guides", "concepts", "toolkit", "books"];
  const items: SearchIndexItem[] = [];

  for (const type of types) {
    const list = getAllByType(type);
    const basePath = pathForType(type);
    for (const { slug, frontmatter } of list) {
      const title = (frontmatter.title as string) || slug;
      const description = (frontmatter.description as string) || "";
      const tags = Array.isArray(frontmatter.tags) ? (frontmatter.tags as string[]) : [];
      items.push({
        type,
        slug,
        path: `${basePath}/${encodeURIComponent(slug)}`,
        title,
        description,
        tags,
      });
    }
  }

  return Response.json(items, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
