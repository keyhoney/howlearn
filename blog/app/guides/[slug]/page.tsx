import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentBySlug, getRelatedContent, getAllContent, getFaqFromFrontmatter } from "@/lib/content";
import type { FaqItem } from "@/lib/types";
import { getMdxBySlug, getMdxSlugs } from "@/lib/content-files";
import { ContentDetail } from "@/components/shared/ContentDetail";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
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

  const relatedContent = await getRelatedContent(content);
  const jsonLd = generateJsonLd(content);
  const mdxFile = getMdxBySlug("guide", slug);
  const tocHeadings = extractHeadings(
    mdxFile?.content ?? content.body ?? ""
  );
  const references = content.references;
  // FAQ: frontmatter에서 먼저 추출, 비어 있으면 이미 빌드된 content.faq 사용 (경로/파싱 차이 대비)
  const faqFromFrontmatter = getFaqFromFrontmatter(mdxFile?.frontmatter);
  const faqItems: FaqItem[] =
    faqFromFrontmatter.length > 0
      ? faqFromFrontmatter
      : (content.type === "guide" ? content.faq ?? [] : []);
  const components = getMdxComponents(getMdxSlugs("concept"));

  const bodyContent = mdxFile ? (
    <MDXRemote source={mdxFile.content} components={components} options={sharedMdxOptions} />
  ) : (
    <>
      {content.intro && (
        <div className="lead text-xl text-slate-600 mb-12">{content.intro}</div>
      )}
      <MarkdownRenderer content={content.body} />
    </>
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
