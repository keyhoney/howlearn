import {
  getSlugs,
  getBySlug,
  getDatePublished,
  getDateModified,
  normalizeTags,
  getCanonicalFromFrontmatter,
  getAuthorFromFrontmatter,
  getLangFromFrontmatter,
  getKeywordsFromFrontmatter,
} from "@/lib/content";
import { getRelatedByTags } from "@/lib/related";
import { site, author } from "@/lib/site";
import { extractHeadings } from "@/lib/headings";
import { getReadingTimeMinutes } from "@/lib/reading-time";
import { mdxServerComponents } from "@/lib/mdx-components";
import { Disclaimer } from "@/components/Disclaimer";
import { ReferenceCard } from "@/components/ReferenceCard";
import { TableOfContents } from "@/components/TableOfContents";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getSlugs("guides").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = getBySlug("guides", slug);
    const title = (frontmatter.title as string) || "가이드";
    const description = (frontmatter.description as string) || "";
    const defaultCanonical = `${site.url}/guides/${encodeURIComponent(slug)}`;
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
      alternates: { canonical: canonicalUrl },
    };
  } catch {
    return { title: "가이드" };
  }
}

function toIsoDate(value: unknown): string | undefined {
  if (value == null) return undefined;
  const s = String(value).trim();
  return s || undefined;
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let data: { frontmatter: Record<string, unknown>; content: string };
  try {
    data = getBySlug("guides", slug);
  } catch {
    notFound();
  }

  const title = (data.frontmatter.title as string) || slug;
  const description = (data.frontmatter.description as string) || "";
  const datePublished = getDatePublished(data.frontmatter) ?? toIsoDate(data.frontmatter.date);
  const dateModified = getDateModified(data.frontmatter) ?? datePublished;
  const ogImage = data.frontmatter.ogImage as string | undefined;
  const tags = Array.isArray(data.frontmatter.tags) ? data.frontmatter.tags : [];
  const defaultCanonical = `${site.url}/guides/${encodeURIComponent(slug)}`;
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
    image: ogImage ? [ogImage.startsWith("http") ? ogImage : `${site.url}${ogImage}`] : undefined,
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
      { "@type": "ListItem", position: 2, name: "가이드", item: `${site.url}/guides` },
      { "@type": "ListItem", position: 3, name: title, item: canonicalUrl },
    ],
  };

  const headings = extractHeadings(data.content);
  const hasReferences = Array.isArray(data.frontmatter.references) && (data.frontmatter.references as unknown[]).length > 0;
  const readingTime =
    typeof data.frontmatter.readingTime === "number" && data.frontmatter.readingTime > 0
      ? data.frontmatter.readingTime
      : getReadingTimeMinutes(data.content);
  const byType: Record<string, string> = { blog: "블로그", guides: "가이드", toolkit: "툴킷", concepts: "개념", books: "전자책" };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
          <article className="min-w-0 max-w-3xl flex-1">
            <header className="mb-10">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">가이드</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
                {title}
              </h1>
              {description && (
                <p className="lead mt-4 text-[15.5px] leading-7 text-[var(--muted)] md:text-[17px] md:leading-8">
                  {description}
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {dateModified && (
                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-medium text-[var(--muted)]">
                    최종 업데이트: {dateModified}
                  </span>
                )}
                {readingTime > 0 && (
                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-medium text-[var(--muted)]">
                    {readingTime}분 읽기
                  </span>
                )}
                {hasReferences && (
                  <Link href="#references" className="rounded-full border border-[var(--brand-500)]/50 bg-[var(--brand-500)]/5 px-3 py-1.5 text-xs font-medium text-[var(--brand-500)] no-underline hover:bg-[var(--brand-500)]/10 hover:underline hover:underline-offset-2">
                    참고 문헌
                  </Link>
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
            {(() => {
              const relatedTags = normalizeTags(data.frontmatter);
              const related = getRelatedByTags(relatedTags, "guides", slug, 6);
              if (related.length === 0) return null;
              return (
                <aside className="mt-14 border-t border-[var(--border)] pt-10">
                  <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">더 읽어보기</h2>
                  <p className="mb-4 text-lg font-semibold text-foreground">관련 콘텐츠</p>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {related.map((item) => (
                      <li key={`${item.type}-${item.slug}`}>
                        <Link
                          href={item.path}
                          className="block rounded-xl border border-[var(--border)]/80 bg-[var(--surface-2)] px-4 py-3 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
                        >
                          <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                            {byType[item.type] ?? item.type}
                          </span>
                          <p className="mt-1 font-medium text-foreground">{item.title}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </aside>
              );
            })()}
            <Disclaimer />
          </article>
          <aside className="w-56 shrink-0">
            <TableOfContents headings={headings} />
          </aside>
        </div>
      </div>
    </>
  );
}
