import type { MetadataRoute } from "next";
import { getSlugs, getCategories, getTags } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = getCategories();
  const tags = getTags();

  const staticPages: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/guides`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.95 },
    { url: `${site.url}/concepts`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/toolkit`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/books`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/domains`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${site.url}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${site.url}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/cookies`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/disclaimer`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
  ];

  const types = ["blog", "guides", "concepts", "toolkit", "books"] as const;
  const basePaths: Record<(typeof types)[number], string> = {
    blog: "/blog",
    guides: "/guides",
    concepts: "/concepts",
    toolkit: "/toolkit",
    books: "/books",
  };

  const contentUrls: MetadataRoute.Sitemap = [];
  for (const type of types) {
    for (const slug of getSlugs(type)) {
      contentUrls.push({
        url: `${site.url}${basePaths[type]}/${encodeURIComponent(slug)}`,
        lastModified: new Date(),
        changeFrequency: type === "books" ? ("monthly" as const) : ("weekly" as const),
        priority: type === "guides" ? 0.85 : type === "concepts" ? 0.8 : 0.8,
      });
    }
  }

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${site.url}/c/${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const tagPages: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${site.url}/t/${encodeURIComponent(tag)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...contentUrls, ...categoryPages, ...tagPages];
}
