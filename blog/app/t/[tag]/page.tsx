import { notFound } from "next/navigation";
import { getContentByTag, getAllTags } from "@/lib/content";
import { ContentCard } from "@/components/cards/ContentCard";
import { constructMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return constructMetadata({
    title: `Tag: ${decoded}`,
    description: `Content tagged with "${decoded}".`,
    noindex: true,
  });
}

export default async function TagPage({
  params,
}: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const items = await getContentByTag(decoded);
  if (items.length === 0) notFound();

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <p className="text-sm font-medium uppercase tracking-wider text-indigo-600 mb-2">
        Tag
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-10">
        #{decoded}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <ContentCard key={item.id} content={item} />
        ))}
      </div>
    </div>
  );
}
