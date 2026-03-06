"use client";

import { useMemo, useState } from "react";
import { ContentCard, type ToolkitType } from "@/components/ContentCard";
import { FiltersBar, type SortOption } from "@/components/FiltersBar";
import type { ContentType } from "@/lib/content";

export type ListItem = {
  slug: string;
  href: string;
  type: ContentType;
  title: string;
  description?: string;
  date?: string;
  readingTimeMinutes?: number;
  categories: string[];
  tags: string[];
  audience?: string;
  toolkitType?: ToolkitType;
};

type ListWithFiltersProps = {
  type: "guides" | "blog" | "toolkit";
  items: ListItem[];
  categories: string[];
  tags: string[];
};

function filterAndSort(
  items: ListItem[],
  search: string,
  category: string,
  tag: string,
  sort: SortOption
): ListItem[] {
  let out = items.slice();
  const q = search.trim().toLowerCase();
  if (q) {
    out = out.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        (i.description && i.description.toLowerCase().includes(q)) ||
        i.tags.some((t) => t.toLowerCase().includes(q)) ||
        i.categories.some((c) => c.toLowerCase().includes(q))
    );
  }
  if (category) {
    out = out.filter((i) => i.categories.includes(category));
  }
  if (tag) {
    out = out.filter((i) => i.tags.includes(tag));
  }
  if (sort === "latest") {
    out.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  } else if (sort === "readingTime") {
    out.sort(
      (a, b) => (b.readingTimeMinutes ?? 0) - (a.readingTimeMinutes ?? 0)
    );
  }
  return out;
}

export function ListWithFilters({
  type,
  items,
  categories,
  tags,
}: ListWithFiltersProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState<SortOption>("latest");

  const filtered = useMemo(
    () => filterAndSort(items, search, category, tag, sort),
    [items, search, category, tag, sort]
  );

  const isEmpty = filtered.length === 0;
  const typeLabel = type === "guides" ? "가이드" : type === "blog" ? "글" : "툴킷";

  return (
    <>
      <FiltersBar
        type={type}
        categories={categories}
        tags={tags}
        search={search}
        category={category}
        tag={tag}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onTagChange={setTag}
        onSortChange={setSort}
        sortValue={sort}
      />
      {isEmpty ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-6 py-12 text-center">
          <p className="text-[var(--muted)]">
            {items.length === 0
              ? `등록된 ${typeLabel}가 없습니다. 콘텐츠가 곧 추가됩니다.`
              : "필터 조건에 맞는 항목이 없습니다. 검색어나 카테고리를 바꿔 보세요."}
          </p>
        </div>
      ) : (
        <ul className="space-y-6">
          {filtered.map((item) => (
            <li key={item.slug}>
              <ContentCard
                type={item.type}
                title={item.title}
                href={item.href}
                description={item.description}
                date={item.date}
                readingTimeMinutes={item.readingTimeMinutes}
                categories={item.categories}
                tags={item.tags}
                audience={item.audience}
                toolkitType={item.toolkitType}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
