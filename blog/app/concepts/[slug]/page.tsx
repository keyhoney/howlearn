import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getContentBySlug,
  getRelatedContent,
  getContentReferringToConcept,
  getAllContent,
} from "@/lib/content";
import { getMdxBySlug } from "@/lib/content-files";
import { ContentDetail } from "@/components/shared/ContentDetail";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { extractHeadings } from "@/lib/headings";
import { mdxComponents } from "@/lib/mdx-components";
import { constructMetadata } from "@/lib/seo";
import { generateJsonLd } from "@/lib/schema";

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
    image: content.ogImage ?? content.coverImage,
    ...(content.lang && { lang: content.lang }),
  });
}

export default async function ConceptDetailPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getContentBySlug("concept", slug);

  if (!content || content.type !== "concept") {
    notFound();
  }

  const [relatedContent, referringContent] = await Promise.all([
    getRelatedContent(content),
    getContentReferringToConcept(content.slug, content.title),
  ]);
  const jsonLd = generateJsonLd(content);
  const mdxFile = getMdxBySlug("concept", slug);
  const tocHeadings = extractHeadings(mdxFile?.content ?? content.body ?? "");
  const references = content.references;

  const bodyContent = mdxFile ? (
    <MDXRemote source={mdxFile.content} components={mdxComponents} />
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
      >
        {bodyContent}
      </ContentDetail>
    </>
  );
}
