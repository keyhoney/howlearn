import { Metadata } from "next";
import { toImageUrl } from "@/lib/image-url";
import { site } from "@/lib/site";

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "book";
  lang?: string;
  /** 검색 랜딩으로 노출하지 않을 때 true (robots noindex, follow) */
  noindex?: boolean;
}

export function constructMetadata({
  title,
  description = site.description,
  image = "https://picsum.photos/seed/learning/1200/630",
  url = process.env.APP_URL || "http://localhost:3000",
  type = "website",
  lang,
  noindex = false,
}: SeoProps = {}): Metadata {
  const imageUrl = image ? toImageUrl(image) : undefined;
  return {
    title: title ? `${title} | ${site.name}` : site.name,
    description,
    ...(noindex && {
      robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
    }),
    ...(lang && { other: { "content-language": lang } }),
    openGraph: {
      title: title ? `${title} | ${site.name}` : site.name,
      description,
      type,
      url,
      ...(lang && { locale: lang }),
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: title || site.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | ${site.name}` : site.name,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
  };
}
