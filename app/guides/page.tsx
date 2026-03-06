import { getAllByType, getBySlug, normalizeCategories, normalizeTags, getOrderedCategoriesForFilter } from "@/lib/content";
import { fullPath } from "@/lib/content-path";
import { getReadingTimeMinutes } from "@/lib/reading-time";
import { ListWithFilters } from "@/components/ListWithFilters";
import { SectionHeader } from "@/components/SectionHeader";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "가이드",
  description: "학습과학 기반 핵심 가이드(에버그린 문서)입니다.",
};

export default function GuidesListPage() {
  const raw = getAllByType("guides");
  const items = raw.map(({ slug, frontmatter }) => {
    const { content } = getBySlug("guides", slug);
    return {
      slug,
      href: fullPath("guides", slug),
      type: "guides" as const,
      title: (frontmatter.title as string) || slug,
      date: (frontmatter.datePublished ?? frontmatter.date) as string || "",
      description: (frontmatter.description as string) || "",
      categories: normalizeCategories(frontmatter),
      tags: normalizeTags(frontmatter),
      readingTimeMinutes:
        typeof frontmatter.readingTime === "number" && frontmatter.readingTime > 0
          ? frontmatter.readingTime
          : getReadingTimeMinutes(content),
    };
  });
  const allOrderedCategories = getOrderedCategoriesForFilter();
  const itemCategories = new Set(items.flatMap((i) => i.categories));
  const categories = allOrderedCategories.filter((c) => itemCategories.has(c));
  const tags = Array.from(new Set(items.flatMap((i) => i.tags))).sort();
  const featured = items[0];
  const listItems = items.length > 1 ? items.slice(1) : items;

  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-12 rounded-2xl border border-[var(--border)] bg-[var(--surface-featured)] px-6 py-8 md:px-8 md:py-10">
        <SectionHeader
          layout="twoCol"
          eyebrow="가이드"
          title="핵심 문서"
          description="연구 기반의 깊이 있는 가이드입니다. 주제별로 정리된 에버그린 문서를 읽어 보세요."
          badges={["연구 기반", "업데이트 기준"]}
          secondary={
            <div className="space-y-2 text-sm text-[var(--muted)]">
              <p><strong className="text-foreground">가이드 {items.length}개</strong></p>
              <p>주제별 · 카테고리·태그로 필터링 가능</p>
            </div>
          }
        />
      </div>
      {featured && listItems.length !== items.length && (
        <div className="mb-12">
          <Link
            href={featured.href}
            className="group block rounded-2xl border border-[var(--border)] bg-[var(--surface-featured)] p-8 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]"
            style={{ borderLeftWidth: "4px", borderLeftColor: "var(--pillar-guides)" }}
          >
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">대표 가이드</span>
            <h2 className="mt-2 text-2xl font-semibold text-foreground group-hover:text-[var(--brand-500)]" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
              {featured.title}
            </h2>
            {featured.description && (
              <p className="mt-3 max-w-2xl text-[15.5px] leading-7 text-[var(--muted)]">
                {featured.description}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--muted)]">
              {featured.date && <time dateTime={featured.date}>{featured.date}</time>}
              {featured.readingTimeMinutes != null && featured.readingTimeMinutes > 0 && (
                <span>{featured.readingTimeMinutes}분 읽기</span>
              )}
            </div>
          </Link>
        </div>
      )}
      <ListWithFilters type="guides" items={listItems} categories={categories} tags={tags} />
    </main>
  );
}
