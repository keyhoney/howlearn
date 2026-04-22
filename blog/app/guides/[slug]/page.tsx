import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAllContent,
  getContentBySlug,
  getRelatedContent,
  getPublishedConceptSlugs,
} from "@/lib/content";
import type { FaqItem } from "@/lib/types";
import { ContentDetail } from "@/components/shared/ContentDetail";
import { extractHeadings } from "@/lib/headings";
import { getMdxComponents } from "@/lib/mdx-components";
import { sharedMdxOptions } from "@/lib/mdx-options";
import { constructMetadata } from "@/lib/seo";
import { generateJsonLd } from "@/lib/schema";

export async function generateStaticParams() {
  const content = await getAllContent();
  return content.filter((c) => c.type === "guide").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getContentBySlug("guide", slug);
  if (!content) return {};
  return constructMetadata({
    title: content.title,
    description: content.summary,
    path: `/guides/${slug}`,
    image: content.ogImage ?? content.coverImage,
    type: "article",
    ...(content.lang && { lang: content.lang }),
  });
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getContentBySlug("guide", slug);

  if (!content || content.type !== "guide") {
    notFound();
  }

  const [relatedContent, publishedConceptSlugs] = await Promise.all([
    getRelatedContent(content),
    getPublishedConceptSlugs(),
  ]);
  const jsonLd = generateJsonLd(content);
  const source = content.body ?? "";
  const tocHeadings = extractHeadings(source);
  const references = content.references;
  const faqItems: FaqItem[] = content.type === "guide" ? content.faq ?? [] : [];
  const components = getMdxComponents(publishedConceptSlugs);

  const bodyContent = source ? (
    <MDXRemote source={source} components={components} options={sharedMdxOptions} />
  ) : (
    content.intro ? <div className="lead text-xl text-slate-600 mb-12">{content.intro}</div> : null
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContentDetail
        content={content}
        relatedContent={relatedContent}
        tocHeadings={tocHeadings}
        references={references}
        showDisclaimer
        faqItems={faqItems}
      >
        {bodyContent}
      </ContentDetail>
    </>
  );
}
