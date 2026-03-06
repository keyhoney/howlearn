"use client";

import { useMemo, useState } from "react";
import { ContentCard } from "@/components/ContentCard";
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
  grade?: string;
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
  grade: string,
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
  if (grade) {
    out = out.filter((i) => i.grade && i.grade.includes(grade));
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
  const [grade, setGrade] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState<SortOption>("latest");

  const filtered = useMemo(
    () => filterAndSort(items, search, grade, category, tag, sort),
    [items, search, grade, category, tag, sort]
  );

  return (
    <>
      <FiltersBar
        type={type}
        categories={categories}
        tags={tags}
        search={search}
        grade={grade}
        category={category}
        tag={tag}
        onSearchChange={setSearch}
        onGradeChange={setGrade}
        onCategoryChange={setCategory}
        onTagChange={setTag}
        onSortChange={setSort}
        sortValue={sort}
      />
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
            />
          </li>
        ))}
      </ul>
    </>
  );
}
