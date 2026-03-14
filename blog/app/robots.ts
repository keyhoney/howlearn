import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Next.js가 /robots.txt 응답을 생성합니다.
 * sitemap을 넣으면 Google이 안내하는 대로 "Sitemap: {url}" 줄이 robots.txt에 포함됩니다.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
