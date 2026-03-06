import {
  getSlugs,
  getBySlug,
  getDateModified,
  getCanonicalFromFrontmatter,
  getLangFromFrontmatter,
  getKeywordsFromFrontmatter,
} from "@/lib/content";
import { getContentReferringToConcept } from "@/lib/related";
import { site } from "@/lib/site";
import { mdxServerComponents } from "@/lib/mdx-components";
import { Disclaimer } from "@/components/Disclaimer";
import { ReferenceCard } from "@/components/ReferenceCard";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getSlugs("concepts").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = getBySlug("concepts", slug);
    const title = (frontmatter.title as string) || "개념";
    const description = (frontmatter.description as string) || "";
    const defaultCanonical = `${site.url}/concepts/${encodeURIComponent(slug)}`;
    const canonicalUrl = getCanonicalFromFrontmatter(frontmatter) || defaultCanonical;
    const lang = getLangFromFrontmatter(frontmatter);
    const keywords = getKeywordsFromFrontmatter(frontmatter);
    const ogImage = frontmatter.ogImage as string | undefined;
    const ogImageAlt = frontmatter.ogImageAlt as string | undefined;
    const ogType = ((frontmatter.ogType as string) || "article") as "article" | "website" | "book";
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
    return { title: "개념" };
  }
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let data: { frontmatter: Record<string, unknown>; content: string };
  try {
    data = getBySlug("concepts", slug);
  } catch {
    notFound();
  }

  const title = (data.frontmatter.title as string) || slug;
  const description = (data.frontmatter.description as string) || "";
  const dateModified = getDateModified(data.frontmatter);
  const defaultCanonical = `${site.url}/concepts/${encodeURIComponent(slug)}`;
  const canonicalUrl = getCanonicalFromFrontmatter(data.frontmatter) || defaultCanonical;
  const lang = getLangFromFrontmatter(data.frontmatter);
  const keywords = getKeywordsFromFrontmatter(data.frontmatter);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: title,
    description: description || undefined,
    url: canonicalUrl,
    inLanguage: lang,
    ...(keywords.length > 0 && { keywords: keywords.join(", ") }),
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: `${site.name} 개념 사전`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: site.url },
      { "@type": "ListItem", position: 2, name: "개념 사전", item: `${site.url}/concepts` },
      { "@type": "ListItem", position: 3, name: title, item: canonicalUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <article className="mx-auto max-w-3xl px-6 py-14">
        <header className="mb-10">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">개념 사전</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
            {title}
          </h1>
          {description && (
            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">정의</p>
              <p className="mt-2 text-[15.5px] leading-7 text-foreground md:text-[17px] md:leading-8">{description}</p>
            </div>
          )}
          {dateModified && (
            <p className="mt-4 text-sm text-[var(--muted)]">최종 업데이트: {dateModified}</p>
          )}
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
          const referring = getContentReferringToConcept(slug, title, 8);
          if (referring.length === 0) return null;
          const typeLabel: Record<string, string> = { blog: "블로그", guides: "가이드", toolkit: "툴킷", concepts: "개념", books: "전자책" };
          return (
            <aside className="mt-14 border-t-2 border-[var(--border)] pt-10">
              <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">관련 글</h2>
              <p className="mb-4 text-lg font-semibold text-foreground">이 개념이 포함된 글</p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {referring.map((item) => (
                  <li key={`${item.type}-${item.slug}`}>
                    <Link
                      href={item.path}
                      className="block rounded-xl border border-[var(--border)]/80 bg-[var(--surface-2)] px-4 py-3 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
                    >
                      <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                        {typeLabel[item.type] ?? item.type}
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
    </>
  );
}
