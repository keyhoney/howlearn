import { getCategories, getArchiveByCategory } from "@/lib/content";
import { fullPath } from "@/lib/content-path";
import type { ContentType } from "@/lib/content";
import { getDomainByLabel } from "@/lib/learning-science-domains";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const domain = getDomainByLabel(decoded);
  return {
    title: domain ? `학습과학 - ${decoded}` : `카테고리: ${decoded}`,
    description: domain
      ? `학습과학 ${decoded} 관련 글 목록. ${domain.description}`
      : `"${decoded}" 카테고리 글 목록입니다.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const items = getArchiveByCategory(decoded);
  if (items.length === 0) notFound();

  const typeLabel: Record<ContentType, string> = {
    blog: "블로그",
    guides: "가이드",
    concepts: "개념",
    toolkit: "툴킷",
    books: "책",
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <p className="mb-2 text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
        카테고리
      </p>
      <h1 className="mb-10 text-3xl font-bold tracking-tight text-foreground">
        {decoded}
      </h1>
      <ul className="space-y-6">
        {items.map((item) => (
          <li key={`${item.type}-${item.slug}`}>
            <Link
              href={fullPath(item.type, item.slug)}
              className="group block rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm transition hover:border-[var(--brand-500)]/30 hover:shadow-md"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                {typeLabel[item.type]}
              </span>
              <h2 className="mt-1 text-xl font-semibold text-foreground group-hover:text-[var(--brand-500)]">
                {(item.frontmatter.title as string) || item.slug}
              </h2>
              {item.frontmatter.datePublished != null && (
                <time className="mt-2 block text-sm text-[var(--muted)]">
                  {String(item.frontmatter.datePublished)}
                </time>
              )}
              {item.frontmatter.description != null && item.frontmatter.description !== "" && (
                <p className="mt-3 leading-relaxed text-[var(--muted)]">
                  {String(item.frontmatter.description)}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
