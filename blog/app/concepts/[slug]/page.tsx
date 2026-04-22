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
import { getMdxBySlug } from "@/lib/content-files";
import { ContentDetail } from "@/components/shared/ContentDetail";
import { extractHeadings } from "@/lib/headings";
import { getMdxComponents } from "@/lib/mdx-components";
import { sharedMdxOptions } from "@/lib/mdx-options";
import { constructMetadata } from "@/lib/seo";
import { generateJsonLd } from "@/lib/schema";

/** 정적 경로 외 슬러그도 런타임 해석 허용(배포 캐시/프리페치 404 완화) */
export const dynamicParams = true;

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

  const [relatedContent, referringContent, allContent] = await Promise.all([
    getRelatedContent(content),
    getContentReferringToConcept(content.slug, content.title),
    getAllContent(),
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
  const publishedConceptSlugs = allContent
    .filter((c) => c.type === "concept")
    .map((c) => c.slug);
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
