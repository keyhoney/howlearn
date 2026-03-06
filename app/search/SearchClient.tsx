"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { trackSearch } from "@/lib/analytics";

type SearchIndexItem = {
  type: string;
  slug: string;
  path: string;
  title: string;
  description: string;
  tags: string[];
};

const TYPE_LABEL: Record<string, string> = {
  blog: "블로그",
  guides: "가이드",
  concepts: "개념",
  toolkit: "툴킷",
  books: "전자책",
};

const TYPE_ORDER = ["guides", "concepts", "toolkit", "blog", "books"];

function filterItems(items: SearchIndexItem[], q: string): SearchIndexItem[] {
  const lower = q.trim().toLowerCase();
  if (!lower) return [];
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(lower) ||
      item.description.toLowerCase().includes(lower) ||
      item.tags.some((t) => t.toLowerCase().includes(lower))
  );
}

function groupByType(items: SearchIndexItem[]): Map<string, SearchIndexItem[]> {
  const map = new Map<string, SearchIndexItem[]>();
  for (const item of items) {
    const list = map.get(item.type) ?? [];
    list.push(item);
    map.set(item.type, list);
  }
  return map;
}

export function SearchClient() {
  const [index, setIndex] = useState<SearchIndexItem[]>([]);
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/search-index.json")
      .then((r) => r.json())
      .then(setIndex)
      .catch(() => setIndex([]));
  }, []);

  const results = filterItems(index, query);
  const byType = groupByType(results);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        setSubmitted(true);
        trackSearch(query.trim());
      }
    },
    [query]
  );

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-10">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="주제, 개념, 글 제목으로 검색해보세요"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-foreground placeholder:text-[var(--muted)] focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
          aria-label="검색"
        />
        <button
          type="submit"
          className="mt-3 rounded-xl bg-[var(--brand-500)] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[var(--brand-600)]"
        >
          검색
        </button>
      </form>

      {query.trim() && (
        <section>
          {results.length === 0 ? (
            <p className="text-[var(--muted)]">검색 결과가 없습니다.</p>
          ) : (
            <ul className="space-y-8">
              {TYPE_ORDER.filter((type) => byType.has(type)).map((type) => (
                <li key={type}>
                  <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
                    {TYPE_LABEL[type] ?? type}
                  </h2>
                  <ul className="space-y-3">
                    {(byType.get(type) ?? []).map((item) => (
                      <li key={`${item.type}-${item.slug}`}>
                        <Link
                          href={item.path}
                          className="block rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 shadow-sm transition hover:border-[var(--brand-500)]/30 hover:shadow-md"
                        >
                          <span className="font-semibold text-foreground">{item.title}</span>
                          {item.description && (
                            <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">
                              {item.description}
                            </p>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  );
}
