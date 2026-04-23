import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getContentBySlug,
  getRelatedContent,
  getAllContent,
  getPublishedConceptSlugs,
} from "@/lib/content";
import { ContentDetail } from "@/components/shared/ContentDetail";
import { extractHeadings } from "@/lib/headings";
import { getMdxComponents } from "@/lib/mdx-components";
import { sharedMdxOptions } from "@/lib/mdx-options";
import { constructMetadata } from "@/lib/seo";
import { generateJsonLd } from "@/lib/schema";

export async function generateStaticParams() {
  const content = await getAllContent();
  return content.filter(c => c.type === "book").map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getContentBySlug("book", slug);
  if (!content) return {};
  return constructMetadata({
    title: content.title,
    description: content.summary,
    path: `/books/${slug}`,
    image: content.ogImage ?? content.coverImage,
    type: "book",
    ...(content.lang && { lang: content.lang }),
  });
}

export default async function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getContentBySlug("book", slug);

  if (!content || content.type !== "book") {
    notFound();
  }

  const [relatedContent, publishedConceptSlugs] = await Promise.all([
    getRelatedContent(content),
    getPublishedConceptSlugs(),
  ]);
  const jsonLd = generateJsonLd(content);
  const source = content.body ?? "";
  const tocHeadings = extractHeadings(source);
  const components = getMdxComponents(publishedConceptSlugs);

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
      <ContentDetail content={content} relatedContent={relatedContent} tocHeadings={tocHeadings}>
        {content.subtitle && (
          <h2 className="text-2xl font-medium text-slate-600 mb-8 mt-0 border-b border-slate-200 pb-4">
            {content.subtitle}
          </h2>
        )}
        
        {content.purchaseLinks && content.purchaseLinks.length > 0 && (
          <div className="mb-12 flex gap-4">
            {content.purchaseLinks.map((link, i) => (
              <a 
                key={i} 
                href={link.href} 
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {bodyContent}
      </ContentDetail>
    </>
  );
}
