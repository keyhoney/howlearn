import { notFound } from "next/navigation";
import { getContentBySlug, getRelatedContent, getAllContent } from "@/lib/content";
import { ContentDetail } from "@/components/shared/ContentDetail";
import { extractHeadings } from "@/lib/headings";
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
  const tocHeadings = extractHeadings(content.body ?? "");
  const references = content.references;

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
      />
    </>
  );
}
