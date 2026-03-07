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
  return content.filter((c) => c.type === "guide").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getContentBySlug("guide", slug);
  if (!content) return {};
  return constructMetadata({
    title: content.title,
    description: content.summary,
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

  const bodyContent = mdxFile ? (
    <MDXRemote source={mdxFile.content} components={mdxComponents} />
  ) : (
    <>
      {content.intro && (
        <div className="lead text-xl text-slate-600 mb-12">{content.intro}</div>
      )}
      {content.keyTakeaways && content.keyTakeaways.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold text-indigo-900 mb-4 mt-0">핵심 요약</h2>
          <ul className="space-y-2 mb-0">
            {content.keyTakeaways.map((takeaway, i) => (
              <li key={i} className="text-indigo-800 flex items-start">
                <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
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
      >
        {bodyContent}
      </ContentDetail>
    </>
  );
}
