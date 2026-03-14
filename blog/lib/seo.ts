import { Metadata } from "next";
import { toImageUrl } from "@/lib/image-url";
import { site } from "@/lib/site";

/** 기본 OG 이미지 절대 URL (소셜 미리보기용) */
const DEFAULT_OG_IMAGE_URL = "http://learninsight.pages.dev/ogprofile/opimage.png";

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  /** 현재 페이지 경로 (예: "/", "/guides", "/guides/slug"). canonical URL에 사용됩니다. */
  path?: string;
  url?: string;
  type?: "website" | "article" | "book";
  lang?: string;
  /** 검색 랜딩으로 노출하지 않을 때 true (robots noindex, follow) */
  noindex?: boolean;
}

function buildCanonical(path: string | undefined): string | undefined {
  if (path === undefined) return undefined;
  const base = site.url.replace(/\/$/, "");
  const p = path === "" || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return p ? `${base}${p}` : base;
}

export function constructMetadata({
  title,
  description = site.description,
  image,
  path,
  url,
  type = "website",
  lang,
  noindex = false,
}: SeoProps = {}): Metadata {
  const imageUrl = image ? toImageUrl(image) : DEFAULT_OG_IMAGE_URL;
  const canonical = buildCanonical(path);
  const resolvedUrl = url ?? canonical ?? site.url;
  return {
    title: title ? `${title} | ${site.name}` : site.name,
    description,
    ...(canonical && {
      alternates: { canonical },
    }),
    ...(noindex && {
      robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
    }),
    ...(lang && { other: { "content-language": lang } }),
    openGraph: {
      title: title ? `${title} | ${site.name}` : site.name,
      description,
      type,
      url: resolvedUrl,
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
    metadataBase: new URL(site.url),
  };
}
