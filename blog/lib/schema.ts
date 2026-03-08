import { AnyContent } from "@/lib/types";
import { author, site } from "@/lib/site";

export function generateJsonLd(content: AnyContent) {
  const base = {
    "@context": "https://schema.org",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${site.url}/${content.type}s/${content.slug}`
    },
    "headline": content.title,
    "description": content.summary,
    "datePublished": content.publishedAt,
    "dateModified": content.updatedAt || content.publishedAt,
    "author": {
      "@type": "Organization",
      "name": author.name
    },
    "publisher": {
      "@type": "Organization",
      "name": author.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${site.url}/logo.png`
      }
    }
  };

  if (content.type === "guide" || content.type === "blog") {
    return {
      ...base,
      "@type": "Article",
    };
  }

  if (content.type === "concept") {
    return {
      ...base,
      "@type": "DefinedTerm",
      "name": content.title,
      "description": content.shortDefinition,
      "inDefinedTermSet": `${site.url}/concepts`
    };
  }

  if (content.type === "book") {
    return {
      ...base,
      "@type": "Book",
      "name": content.title,
      "description": content.summary,
      "isbn": "N/A"
    };
  }

  return {
    ...base,
    "@type": "WebPage"
  };
}
