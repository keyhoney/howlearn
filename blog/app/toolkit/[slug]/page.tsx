import { notFound } from "next/navigation";
import { getContentBySlug, getRelatedContent, getAllContent } from "@/lib/content";
import { ContentDetail } from "@/components/shared/ContentDetail";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContentDetail content={content} relatedContent={relatedContent}>
        <div className="flex flex-wrap gap-4 mb-12">
          {content.format && (
            <div className="bg-cyan-50 border border-cyan-200 text-cyan-800 px-4 py-2 rounded-lg text-sm font-medium">
              포맷: {content.format}
            </div>
          )}
          {content.estimatedTime && (
            <div className="bg-slate-100 border border-slate-200 text-slate-800 px-4 py-2 rounded-lg text-sm font-medium">
              예상 소요 시간: {content.estimatedTime}
            </div>
          )}
        </div>
        <MarkdownRenderer content={content.body} />
      </ContentDetail>
    </>
  );
}
