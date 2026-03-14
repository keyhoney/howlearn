"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const TYPE_LABELS: Record<"all" | "guide" | "concept" | "book", string> = {
  all: "전체",
  guide: "가이드",
  concept: "개념",
  book: "도서",
};

interface DomainContentTypeFilterProps {
  domainSlug: string;
}

export function DomainContentTypeFilter({ domainSlug }: DomainContentTypeFilterProps) {
  const searchParams = useSearchParams();
  const rawType = searchParams.get("type") || "all";
  const currentType: "all" | "guide" | "concept" | "book" =
    rawType === "guide" || rawType === "concept" || rawType === "book" ? rawType : "all";
  const perPage = searchParams.get("perPage") || "12";

  const basePath = `/domains/${domainSlug}`;
  const options: ("all" | "guide" | "concept" | "book")[] = ["all", "guide", "concept", "book"];

  const buildHref = (t: "all" | "guide" | "concept" | "book") => {
    const p = new URLSearchParams();
    p.set("page", "1");
    p.set("perPage", perPage);
    if (t !== "all") p.set("type", t);
    return `${basePath}?${p.toString()}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mr-1">유형:</span>
      {options.map((t) => {
        const isActive = currentType === t;
        return (
          <Link
            key={t}
            href={buildHref(t)}
            className={`inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            }`}
            aria-current={isActive ? "true" : undefined}
          >
            {TYPE_LABELS[t]}
          </Link>
        );
      })}
    </div>
  );
}
