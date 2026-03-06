import { getAllByType, normalizeCategories, normalizeTags } from "@/lib/content";
import { fullPath } from "@/lib/content-path";
import { getContentReferringToConcept } from "@/lib/related";
import { ContentCard } from "@/components/ContentCard";
import { SectionHeader } from "@/components/SectionHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개념 사전",
  description: "학습과학 용어·이론 사전입니다.",
};

export default function ConceptsListPage() {
  const items = getAllByType("concepts").map(({ slug, frontmatter }) => {
    const title = (frontmatter.title as string) || slug;
    const referring = getContentReferringToConcept(slug, title, 100);
    return {
      slug,
      title,
      description: (frontmatter.description as string) || "",
      categories: normalizeCategories(frontmatter),
      tags: normalizeTags(frontmatter),
      referringCount: referring.length,
    };
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <SectionHeader
        title="개념 사전"
        description="학습과학 용어·이론 인덱스. 정의와 짧은 설명, 관련 글이 있는 개념을 모았습니다."
        badge="정의·예시·적용"
      />
      {items.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-6 py-12 text-center">
          <p className="text-[var(--muted)]">등록된 개념이 없습니다. 콘텐츠가 곧 추가됩니다.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ContentCard
              key={item.slug}
              type="concepts"
              title={item.title}
              href={fullPath("concepts", item.slug)}
              description={item.description || undefined}
              conceptReferringCount={item.referringCount}
            />
          ))}
        </div>
      )}
    </main>
  );
}
