import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentBySlug, getRelatedContent, getAllContent } from "@/lib/content";
import { getMdxBySlug } from "@/lib/content-files";
import { ContentDetail } from "@/components/shared/ContentDetail";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { extractHeadings } from "@/lib/headings";
import { mdxComponents } from "@/lib/mdx-components";
import { constructMetadata } from "@/lib/seo";
import { generateJsonLd } from "@/lib/schema";

export async function generateStaticParams() {
  const content = await getAllContent();
  return content.filter(c => c.type === "blog").map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getContentBySlug("blog", slug);
  if (!content) return {};
  return constructMetadata({
    title: content.title,
    description: content.summary,
    image: content.ogImage ?? content.coverImage,
    type: "article",
    ...(content.lang && { lang: content.lang }),
  });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getContentBySlug("blog", slug);

  if (!content || content.type !== "blog") {
    notFound();
  }

  const relatedContent = await getRelatedContent(content);
  const jsonLd = generateJsonLd(content);
  const mdxFile = getMdxBySlug("blog", slug);
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
        tocHeadings={tocHeadings}
        references={references}
        showDisclaimer
      >
        {bodyContent}
      </ContentDetail>
    </>
  );
}
