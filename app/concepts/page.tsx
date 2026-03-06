import { getAllByType, normalizeCategories, normalizeTags } from "@/lib/content";
import { fullPath } from "@/lib/content-path";
import { ContentCard } from "@/components/ContentCard";
import { SectionHeader } from "@/components/SectionHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개념 사전",
  description: "학습과학 용어·이론 사전입니다.",
};

export default function ConceptsListPage() {
  const items = getAllByType("concepts").map(({ slug, frontmatter }) => ({
    slug,
    title: (frontmatter.title as string) || slug,
    description: (frontmatter.description as string) || "",
    categories: normalizeCategories(frontmatter),
    tags: normalizeTags(frontmatter),
  }));

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <SectionHeader
        title="개념 사전"
        description="학습과학 용어 사전"
        badge="정의·예시·적용"
      />
      <ul className="space-y-5">
        {items.map((item) => (
          <li key={item.slug}>
            <ContentCard
              type="concepts"
              title={item.title}
              href={fullPath("concepts", item.slug)}
              description={item.description || undefined}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
