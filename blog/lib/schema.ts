import { AnyContent } from "@/lib/types";

export function generateJsonLd(content: AnyContent) {
  const base = {
    "@context": "https://schema.org",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.APP_URL || "http://localhost:3000"}/${content.type}s/${content.slug}`
    },
    "headline": content.title,
    "description": content.summary,
    "datePublished": content.publishedAt,
    "dateModified": content.updatedAt || content.publishedAt,
    "author": {
      "@type": "Organization",
      "name": "Learning Science Archive"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Learning Science Archive",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.APP_URL || "http://localhost:3000"}/logo.png`
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
      "inDefinedTermSet": `${process.env.APP_URL || "http://localhost:3000"}/concepts`
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
