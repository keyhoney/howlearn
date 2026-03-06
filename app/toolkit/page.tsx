import { getAllByType, getBySlug, normalizeCategories, normalizeTags, getOrderedCategoriesForFilter } from "@/lib/content";
import { fullPath } from "@/lib/content-path";
import { getReadingTimeMinutes } from "@/lib/reading-time";
import { ListWithFilters } from "@/components/ListWithFilters";
import { SectionHeader } from "@/components/SectionHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "툴킷",
  description: "체크리스트·루틴·학습 설계 자료입니다.",
};

export default function ToolkitListPage() {
  const raw = getAllByType("toolkit");
  const items = raw.map(({ slug, frontmatter }) => {
    const { content } = getBySlug("toolkit", slug);
    const toolkitType = frontmatter.toolkitType as "routine" | "template" | "checklist" | undefined;
    return {
      slug,
      href: fullPath("toolkit", slug),
      type: "toolkit" as const,
      title: (frontmatter.title as string) || slug,
      date: (frontmatter.datePublished ?? frontmatter.date) as string || "",
      description: (frontmatter.description as string) || "",
      categories: normalizeCategories(frontmatter),
      tags: normalizeTags(frontmatter),
      readingTimeMinutes:
        typeof frontmatter.readingTime === "number" && frontmatter.readingTime > 0
          ? frontmatter.readingTime
          : getReadingTimeMinutes(content),
      toolkitType: toolkitType && ["routine", "template", "checklist"].includes(toolkitType) ? toolkitType : undefined,
    };
  });
  const allOrderedCategories = getOrderedCategoriesForFilter();
  const itemCategories = new Set(items.flatMap((i) => i.categories));
  const categories = allOrderedCategories.filter((c) => itemCategories.has(c));
  const tags = Array.from(new Set(items.flatMap((i) => i.tags))).sort();

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <SectionHeader
        title="툴킷"
        description="부모 적용 자료"
        badge="체크리스트/템플릿"
      />
      <ListWithFilters type="toolkit" items={items} categories={categories} tags={tags} />
    </main>
  );
}
