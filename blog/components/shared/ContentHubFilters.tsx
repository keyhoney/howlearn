"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { AnyContent, ContentType, DomainSlug } from "@/lib/types";
import { ContentCard } from "@/components/cards/ContentCard";
import { domainInfo, DOMAIN_ORDER } from "@/lib/domains";
import { ALLOWED_TAGS } from "@/lib/content-taxonomy";
import { Search as SearchIcon, ChevronDown, Filter } from "lucide-react";

interface ContentHubFiltersProps {
  content: AnyContent[];
  type: ContentType;
  title: string;
}

function matchesSearch(item: AnyContent, q: string): boolean {
  const lower = q.trim().toLowerCase();
  if (!lower) return true;
  if (item.title.toLowerCase().includes(lower)) return true;
  if (item.summary?.toLowerCase().includes(lower)) return true;
  if (item.tags.some((t) => t.toLowerCase().includes(lower))) return true;
  if (item.categories.some((c) => c.toLowerCase().includes(lower))) return true;
  if (item.type === "concept" && "shortDefinition" in item && String(item.shortDefinition).toLowerCase().includes(lower))
    return true;
  return false;
}

export function ContentHubFilters({ content, type, title }: ContentHubFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryFromUrl = searchParams.get("q") ?? "";
  const [searchInput, setSearchInput] = useState(queryFromUrl);
  const domainParam = searchParams.get("domain") ?? "";
  const tagParam = searchParams.get("tag") ?? "";

  useEffect(() => {
    setSearchInput(queryFromUrl);
  }, [queryFromUrl]);

  const domains = DOMAIN_ORDER;

  /** 선택한 카테고리(도메인)에 해당하는 콘텐츠에서만 쓰인 태그만 표시 (도메인 미선택 시 전체 태그) */
  const availableTags = useMemo(() => {
    if (!domainParam) return [...ALLOWED_TAGS];
    const itemsInDomain = content.filter((c) => c.domains.includes(domainParam as DomainSlug));
    const tagSet = new Set<string>();
    itemsInDomain.forEach((c) => c.tags.forEach((t) => tagSet.add(t)));
    return ALLOWED_TAGS.filter((t) => tagSet.has(t));
  }, [content, domainParam]);

  /** 카테고리 변경 시 현재 선택된 태그가 새 목록에 없으면 태그 쿼리 제거 */
  useEffect(() => {
    if (!domainParam || !tagParam) return;
    const allowed = (availableTags as readonly string[]).includes(tagParam);
    if (allowed) return;
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tag");
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  }, [domainParam, tagParam, availableTags, pathname, router, searchParams]);

  const filtered = useMemo(() => {
    let list = content;
    if (searchInput.trim()) {
      list = list.filter((c) => matchesSearch(c, searchInput));
    }
    if (domainParam) {
      list = list.filter((c) => c.domains.includes(domainParam as DomainSlug));
    }
    if (tagParam) {
      list = list.filter((c) => c.tags.includes(tagParam));
    }
    return list;
  }, [content, searchInput, domainParam, tagParam]);

  useEffect(() => {
    const t = setTimeout(() => {
      const q = searchInput.trim();
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get("q") ?? "";
      if (q === current) return;
      if (q) params.set("q", q);
      else params.delete("q");
      router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput, pathname, router, searchParams]);

  const setQuery = (q: string) => {
    setSearchInput(q);
  };

  const setDomain = (domain: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (domain) params.set("domain", domain);
    else params.delete("domain");
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const setTag = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tag) params.set("tag", tag);
    else params.delete("tag");
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const selectBase =
    "min-h-[44px] w-full min-w-0 appearance-none rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 py-3 pl-4 pr-10 text-sm font-medium text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 transition-colors cursor-pointer";

  return (
    <>
      {/* 검색 + 필터 한 줄 (좁은 화면에서만 줄바꿈) */}
      <div className="mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
        <div className="flex flex-wrap items-stretch gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" aria-hidden />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="제목, 요약, 태그로 검색..."
              className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 py-3 pl-10 pr-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 transition-colors"
              aria-label="검색"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm font-medium">
              <Filter className="h-4 w-4" aria-hidden />
              <span>필터</span>
            </div>
            <div className="relative w-[160px] sm:w-[180px]">
              <select
                value={domainParam}
                onChange={(e) => setDomain(e.target.value)}
                className={selectBase}
                aria-label="카테고리 선택"
              >
                <option value="">전체 카테고리</option>
                {domains.map((d) => {
                  const info = domainInfo[d];
                  return (
                    <option key={d} value={d}>
                      {info?.name ?? d}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" aria-hidden />
            </div>
            <div className="relative w-[160px] sm:w-[200px]">
              <select
                value={tagParam}
                onChange={(e) => setTag(e.target.value)}
                className={selectBase}
                aria-label="태그 선택"
              >
                <option value="">전체 태그</option>
                {availableTags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" aria-hidden />
            </div>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((item) => (
            <ContentCard key={item.id} content={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
            {searchInput.trim() ? "검색 결과가 없습니다." : `매칭되는 ${title}이 없습니다.`}
          </h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            {searchInput.trim() ? "다른 검색어나 필터를 시도해 보세요." : "필터를 바꿔 보세요."}
          </p>
        </div>
      )}
    </>
  );
}
