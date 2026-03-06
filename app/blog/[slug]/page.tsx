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
  const slugs = getSlugs("blog");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = getBySlug("blog", slug);
    const title = (frontmatter.title as string) || "글";
    const description = (frontmatter.description as string) || "";
    const defaultCanonical = `${site.url}/blog/${encodeURIComponent(slug)}`;
    const canonicalUrl = getCanonicalFromFrontmatter(frontmatter) || defaultCanonical;
    const ogImage = frontmatter.ogImage as string | undefined;
    const ogImageAlt = frontmatter.ogImageAlt as string | undefined;
    const ogType = ((frontmatter.ogType as string) || "article") as "article" | "website" | "book";
    const twitterCard = frontmatter.twitterCard as "summary" | "summary_large_image" | undefined;
    const lang = getLangFromFrontmatter(frontmatter);
    const keywords = getKeywordsFromFrontmatter(frontmatter);
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
    const allKeywords = keywords.length > 0 ? keywords : tags;
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
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch {
    return { title: "글" };
  }
}

function toIsoDate(value: unknown): string | undefined {
  if (value == null) return undefined;
  const s = String(value).trim();
  return s ? s : undefined;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post: { frontmatter: Record<string, unknown>; content: string };
  try {
    post = getBySlug("blog", slug);
  } catch {
    notFound();
  }

  const title = (post.frontmatter.title as string) || slug;
  const description = (post.frontmatter.description as string) || "";
  const datePublished = getDatePublished(post.frontmatter) ?? toIsoDate(post.frontmatter.date);
  const dateModified = getDateModified(post.frontmatter) ?? datePublished;
  const ogImage = post.frontmatter.ogImage as string | undefined;
  const tags = Array.isArray(post.frontmatter.tags) ? post.frontmatter.tags : [];
  const defaultCanonical = `${site.url}/blog/${encodeURIComponent(slug)}`;
  const canonicalUrl = getCanonicalFromFrontmatter(post.frontmatter) || defaultCanonical;
  const authorName = getAuthorFromFrontmatter(post.frontmatter) || author.name;
  const lang = getLangFromFrontmatter(post.frontmatter);
  const keywords = getKeywordsFromFrontmatter(post.frontmatter);
  const jsonLdKeywords = keywords.length > 0 ? keywords.join(", ") : (tags.length ? tags.join(", ") : undefined);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    headline: title,
    description: description || undefined,
    image: ogImage ? [ogImage.startsWith("http") ? ogImage : `${site.url}${ogImage}`] : undefined,
    datePublished: datePublished || undefined,
    dateModified: dateModified || datePublished || undefined,
    author: {
      "@type": "Person",
      name: authorName,
      url: author.url,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
    },
    inLanguage: lang,
    isAccessibleForFree: true,
    keywords: jsonLdKeywords,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: site.url },
      { "@type": "ListItem", position: 2, name: "블로그", item: `${site.url}/blog` },
      { "@type": "ListItem", position: 3, name: title, item: canonicalUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-6 py-14">
        <header className="mb-10">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">블로그</p>
          <h1
            className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}
          >
            {title}
          </h1>
          {description && (
            <p className="lead mt-4 text-[15.5px] leading-7 text-[var(--muted)] md:text-[17px] md:leading-8">
              {description}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--muted)]">
            {datePublished && <time dateTime={datePublished}>{datePublished}</time>}
            {dateModified && dateModified !== datePublished && (
              <span>최종 업데이트: {dateModified}</span>
            )}
          </div>
        </header>
        <div className="prose prose-lg max-w-none">
          <MDXRemote source={post.content} components={mdxServerComponents} />
        </div>
        {Array.isArray(post.frontmatter.references) && post.frontmatter.references.length > 0 && (
          <ReferenceCard
            items={post.frontmatter.references as { title?: string; url: string }[]}
          />
        )}
        <Disclaimer />
      </article>
    </>
  );
}
