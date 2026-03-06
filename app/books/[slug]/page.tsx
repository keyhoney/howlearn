import {
  getSlugs,
  getBySlug,
  getDateModified,
  getCanonicalFromFrontmatter,
  getAuthorFromFrontmatter,
  getLangFromFrontmatter,
  getKeywordsFromFrontmatter,
} from "@/lib/content";
import { site, author } from "@/lib/site";
import { mdxServerComponents } from "@/lib/mdx-components";
import { Disclaimer } from "@/components/Disclaimer";
import { OutboundLink } from "@/components/OutboundLink";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getSlugs("books").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = getBySlug("books", slug);
    const title = (frontmatter.title as string) || "전자책";
    const description = (frontmatter.description as string) || "";
    const defaultCanonical = `${site.url}/books/${encodeURIComponent(slug)}`;
    const canonicalUrl = getCanonicalFromFrontmatter(frontmatter) || defaultCanonical;
    const lang = getLangFromFrontmatter(frontmatter);
    const keywords = getKeywordsFromFrontmatter(frontmatter);
    const ogImage = (frontmatter.ogImage ?? frontmatter.coverImage) as string | undefined;
    const ogImageAlt = frontmatter.ogImageAlt as string | undefined;
    const ogType = ((frontmatter.ogType as string) || "book") as "article" | "website" | "book";
    const twitterCard = frontmatter.twitterCard as "summary" | "summary_large_image" | undefined;
    return {
      title,
      description,
      ...(lang && { other: { "content-language": lang } }),
      ...(keywords.length > 0 && { keywords }),
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
    return { title: "전자책" };
  }
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let data: { frontmatter: Record<string, unknown>; content: string };
  try {
    data = getBySlug("books", slug);
  } catch {
    notFound();
  }

  const title = (data.frontmatter.title as string) || slug;
  const description = (data.frontmatter.description as string) || "";
  const audience = (data.frontmatter.audience as string) || "";
  const stores = data.frontmatter.stores as Record<string, string> | undefined;
  const coverImage = (data.frontmatter.coverImage as string) || "";
  const dateModified = getDateModified(data.frontmatter);
  const defaultCanonical = `${site.url}/books/${encodeURIComponent(slug)}`;
  const canonicalUrl = getCanonicalFromFrontmatter(data.frontmatter) || defaultCanonical;
  const authorName = getAuthorFromFrontmatter(data.frontmatter) || author.name;
  const lang = getLangFromFrontmatter(data.frontmatter);
  const keywords = getKeywordsFromFrontmatter(data.frontmatter);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: title,
    description: description || undefined,
    url: canonicalUrl,
    author: { "@type": "Person", name: authorName, url: author.url },
    inLanguage: lang,
    ...(keywords.length > 0 && { keywords: keywords.join(", ") }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: site.url },
      { "@type": "ListItem", position: 2, name: "전자책", item: `${site.url}/books` },
      { "@type": "ListItem", position: 3, name: title, item: canonicalUrl },
    ],
  };

  const storeLabels: Record<string, string> = {
    ridibooks: "리디북스",
    kyobo: "교보문고",
    yes24: "예스24",
    aladin: "알라딘",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <article className="mx-auto max-w-3xl px-6 py-14">
        {coverImage && (
          <div className="mb-8 flex justify-center">
            <div className="h-56 w-40 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--muted-bg)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          {dateModified && (
            <p className="mt-2 text-sm text-[var(--muted)]">최종 업데이트: {dateModified}</p>
          )}
          {audience && (
            <p className="mt-1 text-sm text-[var(--muted)]">{audience}</p>
          )}
          {description && (
            <p className="mt-2 leading-relaxed text-[var(--muted)]">{description}</p>
          )}
        </header>
        <div className="prose prose-lg max-w-none">
          <MDXRemote source={data.content} components={mdxServerComponents} />
        </div>
        {stores && Object.keys(stores).length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {Object.entries(stores).map(([key, url]) =>
              url ? (
                <OutboundLink
                  key={key}
                  href={url}
                  label={storeLabels[key] || key}
                  className="rounded-xl bg-[var(--brand-500)] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[var(--brand-600)]"
                >
                  서점에서 보기 · {storeLabels[key] || key}
                </OutboundLink>
              ) : null
            )}
          </div>
        )}
        <Disclaimer />
      </article>
    </>
  );
}
