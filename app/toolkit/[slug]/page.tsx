import {
  getSlugs,
  getBySlug,
  getDatePublished,
  getDateModified,
  getCanonicalFromFrontmatter,
  getAuthorFromFrontmatter,
  getLangFromFrontmatter,
  getKeywordsFromFrontmatter,
} from "@/lib/content";
import { site, author } from "@/lib/site";
import { mdxServerComponents } from "@/lib/mdx-components";
import { Disclaimer } from "@/components/Disclaimer";
import { ReferenceCard } from "@/components/ReferenceCard";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getSlugs("toolkit").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = getBySlug("toolkit", slug);
    const title = (frontmatter.title as string) || "툴킷";
    const description = (frontmatter.description as string) || "";
    const defaultCanonical = `${site.url}/toolkit/${encodeURIComponent(slug)}`;
    const canonicalUrl = getCanonicalFromFrontmatter(frontmatter) || defaultCanonical;
    const lang = getLangFromFrontmatter(frontmatter);
    const keywords = getKeywordsFromFrontmatter(frontmatter);
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
    const allKeywords = keywords.length > 0 ? keywords : tags;
    const ogImage = frontmatter.ogImage as string | undefined;
    const ogImageAlt = frontmatter.ogImageAlt as string | undefined;
    const ogType = ((frontmatter.ogType as string) || "article") as "article" | "website" | "book";
    const twitterCard = frontmatter.twitterCard as "summary" | "summary_large_image" | undefined;
    return {
      title,
      description,
      ...(lang && { other: { "content-language": lang } }),
      ...(allKeywords.length > 0 && { keywords: allKeywords }),
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: ogType,
        locale: lang,
        ...(ogImage && {
          images: [
            {
              url: ogImage.startsWith("http") ? ogImage : `${site.url}${ogImage}`,
              ...(ogImageAlt && { alt: ogImageAlt }),
            },
          ],
        }),
      },
      twitter: twitterCard ? { card: twitterCard } : undefined,
      alternates: { canonical: canonicalUrl },
    };
  } catch {
    return { title: "툴킷" };
  }
}

function toIsoDate(value: unknown): string | undefined {
  if (value == null) return undefined;
  const s = String(value).trim();
  return s || undefined;
}

export default async function ToolkitItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let data: { frontmatter: Record<string, unknown>; content: string };
  try {
    data = getBySlug("toolkit", slug);
  } catch {
    notFound();
  }

  const title = (data.frontmatter.title as string) || slug;
  const description = (data.frontmatter.description as string) || "";
  const datePublished = getDatePublished(data.frontmatter) ?? toIsoDate(data.frontmatter.date);
  const dateModified = getDateModified(data.frontmatter) ?? datePublished;
  const tags = Array.isArray(data.frontmatter.tags) ? data.frontmatter.tags : [];
  const defaultCanonical = `${site.url}/toolkit/${encodeURIComponent(slug)}`;
  const canonicalUrl = getCanonicalFromFrontmatter(data.frontmatter) || defaultCanonical;
  const authorName = getAuthorFromFrontmatter(data.frontmatter) || author.name;
  const lang = getLangFromFrontmatter(data.frontmatter);
  const keywords = getKeywordsFromFrontmatter(data.frontmatter);
  const jsonLdKeywords = keywords.length > 0 ? keywords.join(", ") : (tags.length ? tags.join(", ") : undefined);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    headline: title,
    description: description || undefined,
    datePublished: datePublished || undefined,
    dateModified: dateModified || datePublished || undefined,
    author: { "@type": "Person", name: authorName, url: author.url },
    publisher: { "@type": "Organization", name: site.name },
    inLanguage: lang,
    isAccessibleForFree: true,
    keywords: jsonLdKeywords,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: site.url },
      { "@type": "ListItem", position: 2, name: "툴킷", item: `${site.url}/toolkit` },
      { "@type": "ListItem", position: 3, name: title, item: canonicalUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <article className="mx-auto max-w-3xl px-6 py-14">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--muted)]">
            {datePublished && (
              <time dateTime={datePublished}>{datePublished}</time>
            )}
            {dateModified && (
              <span>최종 업데이트: {dateModified}</span>
            )}
          </div>
        </header>
        <div className="prose prose-lg max-w-none">
          <MDXRemote source={data.content} components={mdxServerComponents} />
        </div>
        {Array.isArray(data.frontmatter.references) && data.frontmatter.references.length > 0 && (
          <ReferenceCard
            items={data.frontmatter.references as { title?: string; url: string }[]}
          />
        )}
        <Disclaimer />
      </article>
    </>
  );
}
