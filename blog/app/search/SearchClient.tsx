"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import { AnyContent, ContentType } from "@/lib/types";
import { ContentCard } from "@/components/cards/ContentCard";
import { trackSearch } from "@/lib/analytics";
import { Search as SearchIcon, X } from "lucide-react";

export function SearchClient({ initialData }: { initialData: AnyContent[] }) {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<ContentType | "all">("all");
  const trackedQueryRef = useRef<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trackedQueryRef.current === trimmed) return;
    const t = setTimeout(() => {
      trackSearch(trimmed);
      trackedQueryRef.current = trimmed;
    }, 600);
    return () => clearTimeout(t);
  }, [query]);

  const fuse = useMemo(() => new Fuse(initialData, {
    keys: ["title", "summary", "tags", "domains", "body", "englishName", "shortDefinition"],
    threshold: 0.3,
    ignoreLocation: true,
  }), [initialData]);

  const results = useMemo(() => {
    let filtered = initialData;
    
    if (query.trim()) {
      filtered = fuse.search(query).map(result => result.item);
    }

    if (activeType !== "all") {
      filtered = filtered.filter(item => item.type === activeType);
    }

    return filtered;
  }, [query, activeType, fuse, initialData]);

  const types: { value: ContentType | "all", label: string }[] = [
    { value: "all", label: "전체" },
    { value: "guide", label: "가이드" },
    { value: "concept", label: "개념" },
    { value: "toolkit", label: "툴킷" },
    { value: "blog", label: "블로그" },
    { value: "book", label: "전자책" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Search Input */}
      <div className="relative mb-6 sm:mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="h-6 w-6 text-slate-400 dark:text-slate-500" />
        </div>
        <input
          type="text"
          className="block w-full min-h-[48px] pl-12 pr-12 py-3 sm:py-4 border-2 border-slate-200 dark:border-slate-600 rounded-2xl leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 sm:text-lg transition-colors"
          placeholder="검색어를 입력하세요 (예: 작업기억, 동기부여)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button 
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 min-w-[48px]"
            aria-label="검색어 지우기"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8 sm:mb-12 justify-center">
        {types.map(type => (
          <button
            key={type.value}
            onClick={() => setActiveType(type.value)}
            className={`px-4 py-2 min-h-[44px] sm:min-h-0 rounded-full text-sm font-medium transition-colors ${
              activeType === type.value 
                ? "bg-indigo-600 text-white shadow-sm dark:bg-indigo-500" 
                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mb-4 sm:mb-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
        검색 결과 {results.length}건
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {results.map(item => (
            <ContentCard key={item.id} content={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">검색 결과가 없습니다.</h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">다른 검색어나 필터를 시도해 보세요.</p>
        </div>
      )}
    </div>
  );
}
