"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { AnyContent, ContentType, DomainSlug } from "@/lib/types";
import { ContentCard } from "@/components/cards/ContentCard";
import { domainInfo, DOMAIN_ORDER } from "@/lib/domains";
import { ALLOWED_TAGS } from "@/lib/content-taxonomy";
import { Search as SearchIcon, ChevronDown, Filter } from "lucide-react";
import { PaginationBar } from "@/components/shared/PaginationBar";
import type { ContentHubPagination } from "@/components/shared/ContentHub";

interface ContentHubFiltersProps {
  content: AnyContent[];
  type: ContentType;
  title: string;
  /** 페이지네이션 사용 시 서버에서 전달. 있으면 content는 이미 필터·슬라이스된 목록이라 그대로 표시 */
  pagination?: ContentHubPagination;
  /** 페이지네이션 사용 시 서버에서 계산한 태그 목록 (도메인별) */
  availableTags?: string[];
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

export function ContentHubFilters({ content, type, title, pagination, availableTags }: ContentHubFiltersProps) {
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

  /** 페이지네이션 없을 때만 클라이언트에서 계산 (content가 전체 목록). 페이지네이션 있을 때는 서버에서 availableTags 전달 */
  const clientAvailableTags = useMemo(() => {
    if (pagination && availableTags) return availableTags;
    if (!domainParam) return [...ALLOWED_TAGS];
    const itemsInDomain = content.filter((c) => c.domains.includes(domainParam as DomainSlug));
    const tagSet = new Set<string>();
    itemsInDomain.forEach((c) => c.tags.forEach((t) => tagSet.add(t)));
    return ALLOWED_TAGS.filter((t) => tagSet.has(t));
  }, [pagination, availableTags, content, domainParam]);

  const effectiveAvailableTags = useMemo(
    () => (pagination ? (availableTags ?? []) : clientAvailableTags),
    [pagination, availableTags, clientAvailableTags]
  );

  /** 카테고리 변경 시 현재 선택된 태그가 새 목록에 없으면 태그 쿼리 제거 */
  useEffect(() => {
    if (!domainParam || !tagParam) return;
    const allowed = effectiveAvailableTags.includes(tagParam);
    if (allowed) return;
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tag");
    if (pagination) params.set("page", "1");
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  }, [domainParam, tagParam, effectiveAvailableTags, pathname, router, searchParams, pagination]);

  /** 페이지네이션 사용 시: 서버가 이미 필터·슬라이스한 content만 표시. 미사용 시: 클라이언트 필터 */
  const displayList = useMemo(() => {
    if (pagination) return content;
    let list = content;
    if (searchInput.trim()) list = list.filter((c) => matchesSearch(c, searchInput));
    if (domainParam) list = list.filter((c) => c.domains.includes(domainParam as DomainSlug));
    if (tagParam) list = list.filter((c) => c.tags.includes(tagParam));
    return list;
  }, [pagination, content, searchInput, domainParam, tagParam]);

  useEffect(() => {
    const t = setTimeout(() => {
      const q = searchInput.trim();
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get("q") ?? "";
      if (q === current) return;
      if (q) params.set("q", q);
      else params.delete("q");
      if (pagination) params.set("page", "1");
      router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput, pathname, router, searchParams, pagination]);

  const setQuery = (q: string) => {
    setSearchInput(q);
  };

  const setDomain = (domain: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (domain) params.set("domain", domain);
    else params.delete("domain");
    params.set("page", "1");
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const setTag = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tag) params.set("tag", tag);
    else params.delete("tag");
    params.set("page", "1");
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
                {effectiveAvailableTags.map((t) => (
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

      {displayList.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayList.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
          {pagination && (
            <PaginationBar
              pathname={pagination.pathname}
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalCount={pagination.totalCount}
              perPage={pagination.perPage}
              preserveParams
            />
          )}
        </>
      ) : (
        <div className="text-center py-12 sm:py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
            {searchInput.trim() || domainParam || tagParam ? "검색 결과가 없습니다." : `매칭되는 ${title}이 없습니다.`}
          </h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            {searchInput.trim() || domainParam || tagParam ? "다른 검색어나 필터를 시도해 보세요." : "필터를 바꿔 보세요."}
          </p>
        </div>
      )}
    </>
  );
}
