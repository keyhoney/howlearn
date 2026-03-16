import type { AnyContent, ContentType } from "@/lib/types";
import { author, authorByline, site } from "@/lib/site";
import { toImageUrl } from "@/lib/image-url";

/** 실제 App Router 경로와 동일한 canonical 경로 접두사 */
function contentPathPrefix(type: ContentType): string {
  const map: Record<ContentType, string> = {
    guide: "guides",
    concept: "concepts",
    toolkit: "toolkit",
    book: "books",
  };
  return map[type];
}

function pageUrl(content: AnyContent): string {
  const prefix = contentPathPrefix(content.type);
  return `${site.url}/${prefix}/${content.slug}`;
}

export function generateJsonLd(content: AnyContent) {
  const pageId = pageUrl(content);
  const imageUrl =
    content.ogImage || content.coverImage
      ? toImageUrl(content.ogImage ?? content.coverImage ?? "")
      : undefined;

  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageId,
    },
    headline: content.title,
    description: content.summary,
    datePublished: content.publishedAt,
    dateModified: content.updatedAt || content.publishedAt,
    author: {
      "@type": "Person",
      name: authorByline.name,
      jobTitle: authorByline.credentials,
      url: `${site.url}/about#author`,
    },
    publisher: {
      "@type": "Organization",
      name: author.name,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/favicon.png`,
      },
    },
  };

  if (imageUrl) {
    base.image = [imageUrl];
  }

  if (content.type === "guide") {
    return {
      ...base,
      "@type": "Article",
      url: pageId,
    };
  }

  if (content.type === "concept") {
    return {
      ...base,
      "@type": "DefinedTerm",
      name: content.title,
      description: content.shortDefinition,
      inDefinedTermSet: `${site.url}/concepts`,
    };
  }

  if (content.type === "book") {
    return {
      ...base,
      "@type": "Book",
      name: content.title,
      description: content.summary,
    };
  }

  return {
    ...base,
    "@type": "WebPage",
    url: pageId,
  };
}
