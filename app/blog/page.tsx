import { getAllByType, getBySlug, normalizeCategories, normalizeTags, getOrderedCategoriesForFilter } from "@/lib/content";
import { fullPath } from "@/lib/content-path";
import { getReadingTimeMinutes } from "@/lib/reading-time";
import { ListWithFilters } from "@/components/ListWithFilters";
import { SectionHeader } from "@/components/SectionHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "블로그",
  description: "학습과학·인지·뇌·교육·발달·동기·정서 관련 글과 에세이 목록입니다.",
};

export default function BlogListPage() {
  const raw = getAllByType("blog");
  const items = raw.map(({ slug, frontmatter }) => {
    const { content } = getBySlug("blog", slug);
    return {
      slug,
      href: fullPath("blog", slug),
      type: "blog" as const,
      title: (frontmatter.title as string) || slug,
      date: (frontmatter.datePublished ?? frontmatter.date) as string || "",
      description: (frontmatter.description as string) || "",
      categories: normalizeCategories(frontmatter),
      tags: normalizeTags(frontmatter),
      readingTimeMinutes:
        typeof frontmatter.readingTime === "number" && frontmatter.readingTime > 0
          ? frontmatter.readingTime
          : getReadingTimeMinutes(content),
      grade: (frontmatter.grade as string) || "",
    };
  });
  const allOrderedCategories = getOrderedCategoriesForFilter();
  const itemCategories = new Set(items.flatMap((i) => i.categories));
  const categories = allOrderedCategories.filter((c) => itemCategories.has(c));
  const tags = Array.from(new Set(items.flatMap((i) => i.tags))).sort();

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <SectionHeader
        eyebrow="블로그"
        title="최신 글"
        description="학습과학 관련 글·에세이입니다. 5대 영역·카테고리·태그로 필터링할 수 있습니다."
        badge="에디토리얼"
      />
      <div className="mt-10">
        <ListWithFilters type="blog" items={items} categories={categories} tags={tags} />
      </div>
    </main>
  );
}
