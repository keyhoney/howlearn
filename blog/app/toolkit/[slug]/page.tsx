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
  return content.filter(c => c.type === "toolkit").map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getContentBySlug("toolkit", slug);
  if (!content) return {};
  return constructMetadata({
    title: content.title,
    description: content.summary,
    image: content.ogImage ?? content.coverImage,
    ...(content.lang && { lang: content.lang }),
  });
}

export default async function ToolkitDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getContentBySlug("toolkit", slug);

  if (!content || content.type !== "toolkit") {
    notFound();
  }

  const relatedContent = await getRelatedContent(content);
  const jsonLd = generateJsonLd(content);
  const mdxFile = getMdxBySlug("toolkit", slug);
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
      >
        <div className="flex flex-wrap gap-4 mb-12">
          {content.format && (
            <div className="bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-700 text-cyan-800 dark:text-cyan-200 px-4 py-2 rounded-lg text-sm font-medium">
              포맷: {content.format}
            </div>
          )}
          {content.estimatedTime && (
            <div className="bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-medium">
              예상 소요 시간: {content.estimatedTime}
            </div>
          )}
        </div>
        {bodyContent}
      </ContentDetail>
    </>
  );
}
