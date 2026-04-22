import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAllContent,
  getContentBySlug,
  getRelatedContent,
  getContentReferringToConcept,
  getPublishedConceptSlugs,
  getFaqFromFrontmatter,
} from "@/lib/content";
import type { FaqItem } from "@/lib/types";
import { getMdxBySlug } from "@/lib/content-files";
import { ContentDetail } from "@/components/shared/ContentDetail";
import { extractHeadings } from "@/lib/headings";
import { getMdxComponents } from "@/lib/mdx-components";
import { sharedMdxOptions } from "@/lib/mdx-options";
import { constructMetadata } from "@/lib/seo";
import { generateJsonLd } from "@/lib/schema";

/** 개념 상세는 generateStaticParams로 생성된 슬러그만 허용해 런타임 CPU 사용을 줄입니다. */
export const dynamicParams = false;

export async function generateStaticParams() {
  const content = await getAllContent();
  return content.filter((c) => c.type === "concept").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getContentBySlug("concept", slug);
  if (!content || content.type !== "concept") return {};
  return constructMetadata({
    title: `${content.title} 뜻과 설명`,
    description: content.shortDefinition,
    path: `/concepts/${slug}`,
    image: content.ogImage ?? content.coverImage,
    type: "article",
    ...(content.lang && { lang: content.lang }),
  });
}

export default async function ConceptDetailPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getContentBySlug("concept", slug);

  if (!content || content.type !== "concept") notFound();

  const [relatedContent, referringContent, publishedConceptSlugs] = await Promise.all([
    getRelatedContent(content),
    getContentReferringToConcept(content.slug, content.title),
    getPublishedConceptSlugs(),
  ]);
  const jsonLd = generateJsonLd(content);
  const mdxFile = getMdxBySlug("concept", slug);
  const source = mdxFile?.content ?? content.body ?? "";
  const tocHeadings = extractHeadings(source);
  const references = content.references;
  const faqFromFrontmatter = getFaqFromFrontmatter(mdxFile?.frontmatter);
  const faqItems: FaqItem[] =
    faqFromFrontmatter.length > 0
      ? faqFromFrontmatter
      : (content.type === "concept" ? content.faq ?? [] : []);
  const components = getMdxComponents(publishedConceptSlugs, slug);

  const bodyContent = source ? (
    <MDXRemote source={source} components={components} options={sharedMdxOptions} />
  ) : (
    null
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
        referringContent={referringContent}
        tocHeadings={tocHeadings}
        references={references}
        faqItems={faqItems}
      >
        {bodyContent}
      </ContentDetail>
    </>
  );
}
