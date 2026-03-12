import type { MetadataRoute } from "next";
import { getAllContent, getAllTags } from "@/lib/content";
import { site } from "@/lib/site";

const typeToPath: Record<string, string> = {
  guide: "/guides",
  concept: "/concepts",
  toolkit: "/toolkit",
  book: "/books",
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getAllContent();

  const staticPages: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/guides`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.95 },
    { url: `${site.url}/concepts`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/toolkit`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/books`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/domains`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${site.url}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${site.url}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/cookies`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/disclaimer`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/assessments`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const contentUrls: MetadataRoute.Sitemap = content.map((c) => {
    const path = typeToPath[c.type];
    const changeFrequency: "weekly" | "monthly" =
      c.type === "book" ? "monthly" : "weekly";
    return {
      url: `${site.url}${path}/${encodeURIComponent(c.slug)}`,
      lastModified: new Date(),
      changeFrequency,
      priority: c.type === "guide" ? 0.85 : 0.8,
    };
  });

  const tags = await getAllTags();
  const tagUrls: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${site.url}/t/${encodeURIComponent(tag)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...contentUrls, ...tagUrls];
}
