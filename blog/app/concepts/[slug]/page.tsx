import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getContentBySlug,
  getRelatedContent,
  getContentReferringToConcept,
  getAllContent,
  getFaqFromFrontmatter,
} from "@/lib/content";
import type { FaqItem } from "@/lib/types";
import { getMdxBySlug, getMdxSlugs } from "@/lib/content-files";
import { ContentDetail } from "@/components/shared/ContentDetail";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { extractHeadings } from "@/lib/headings";
import { getMdxComponents } from "@/lib/mdx-components";
import { sharedMdxOptions } from "@/lib/mdx-options";
import { constructMetadata } from "@/lib/seo";
import { generateJsonLd } from "@/lib/schema";

/** 미작성 개념 슬러그는 404로 처리(스텁 페이지 없음) */
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

  const [relatedContent, referringContent] = await Promise.all([
    getRelatedContent(content),
    getContentReferringToConcept(content.slug, content.title),
  ]);
  const jsonLd = generateJsonLd(content);
  const mdxFile = getMdxBySlug("concept", slug);
  const tocHeadings = extractHeadings(mdxFile?.content ?? content.body ?? "");
  const references = content.references;
  const faqFromFrontmatter = getFaqFromFrontmatter(mdxFile?.frontmatter);
  const faqItems: FaqItem[] =
    faqFromFrontmatter.length > 0
      ? faqFromFrontmatter
      : (content.type === "concept" ? content.faq ?? [] : []);
  const publishedConceptSlugs = getMdxSlugs("concept");
  const components = getMdxComponents(publishedConceptSlugs, slug);

  const bodyContent = mdxFile ? (
    <MDXRemote source={mdxFile.content} components={components} options={sharedMdxOptions} />
  ) : (
    <MarkdownRenderer content={content.body ?? ""} />
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
