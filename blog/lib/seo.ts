import { Metadata } from "next";
import { toImageUrl } from "@/lib/image-url";
import { site, authorByline } from "@/lib/site";

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

/** article 타입일 때 메타에 넣을 저자 정보 (clear sourcing, E-E-A-T) */
const articleAuthors = [
  { name: `${authorByline.name} (${authorByline.credentials})`, url: `${site.url}/about#author` },
];

/**
 * 현재 페이지의 self-canonical을 절대 URL로 반환합니다.
 * 호스트 혼재(www/비-www) 시 Google이 다른 canonical을 고르지 않도록, 항상 site.url(www) 기준 절대 URL만 사용합니다.
 * 가이드/개념 상세는 반드시 path를 넘겨 self-canonical을 설정하세요.
 */
export function buildCanonical(path: string | undefined): string | undefined {
  if (path === undefined) return undefined;
  const base = site.url.replace(/\/$/, "");
  const p = path === "" || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  const absolute = p ? `${base}${p}` : base;
  return absolute.startsWith("http") ? absolute : undefined;
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
  const resolvedTitle = title ? `${site.name} | ${title}` : site.name;
  const resolvedDescription =
    type === "article" && description
      ? `${description} · ${authorByline.name}(${authorByline.credentials}) 집필`
      : description;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    ...(type === "article" && {
      authors: articleAuthors,
      creator: authorByline.name,
    }),
    ...(canonical && {
      alternates: { canonical },
    }),
    ...(noindex && {
      robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
    }),
    ...(lang && { other: { "content-language": lang } }),
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
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
      title: resolvedTitle,
      description: resolvedDescription,
      images: imageUrl ? [imageUrl] : undefined,
      creator: type === "article" ? authorByline.name : undefined,
    },
    metadataBase: new URL(site.url),
  };
}
