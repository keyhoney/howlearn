"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { isAllowedPerPage, PER_PAGE_OPTIONS, type PerPageOption } from "@/lib/pagination";

export interface PaginationBarProps {
  pathname: string;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  perPage: number;
  /** 검색/필터 유지용. 페이지 이동 시 나머지 쿼리는 그대로 유지 */
  preserveParams?: boolean;
}

function buildQueryString(params: URLSearchParams, updates: { page?: number; perPage?: number }): string {
  const next = new URLSearchParams(params.toString());
  if (updates.page !== undefined) next.set("page", String(updates.page));
  if (updates.perPage !== undefined) next.set("perPage", String(updates.perPage));
  const s = next.toString();
  return s ? `?${s}` : "";
}

/** 현재 페이지 주변만 숫자로 보여주고 나머지는 ... 으로 생략 */
function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const result: (number | "ellipsis")[] = [];
  const showEdge = 1;
  const showAround = 1;

  if (currentPage <= showEdge + showAround + 1) {
    for (let i = 1; i <= Math.min(4, totalPages); i++) result.push(i);
    result.push("ellipsis");
    result.push(totalPages);
    return result;
  }
  if (currentPage >= totalPages - showAround - showEdge) {
    result.push(1);
    result.push("ellipsis");
    for (let i = Math.max(1, totalPages - 3); i <= totalPages; i++) result.push(i);
    return result;
  }
  result.push(1);
  result.push("ellipsis");
  for (let i = currentPage - showAround; i <= currentPage + showAround; i++) result.push(i);
  result.push("ellipsis");
  result.push(totalPages);
  return result;
}

export function PaginationBar({
  pathname,
  currentPage,
  totalPages,
  totalCount,
  perPage,
  preserveParams = true,
}: PaginationBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 0 || totalCount === 0) {
    return null;
  }

  const baseQuery = preserveParams ? searchParams : new URLSearchParams();
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const navButton =
    "inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:pointer-events-none transition-colors";
  const pageLink =
    "inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border text-sm font-medium transition-colors";
  const pageCurrent =
    "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/50";
  const pageOther =
    "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50";

  return (
    <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      {/* 페이지당 개수 선택 */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-slate-500 dark:text-slate-400">페이지당</span>
        <select
          value={perPage}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (!isAllowedPerPage(next)) return;
            const qs = buildQueryString(baseQuery, { page: 1, perPage: next });
            router.push(`${pathname}${qs}`);
          }}
          className="min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 py-2 pl-3 pr-8 text-sm font-medium text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          aria-label="페이지당 항목 수"
        >
          {PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}개씩 보기
            </option>
          ))}
        </select>
      </div>

      {/* 네비게이션: 처음 / 이전 / 숫자 / 다음 / 끝 */}
      <nav className="flex items-center gap-1 sm:gap-2 flex-wrap" aria-label="페이지 네비게이션">
        <Link
          href={`${pathname}${buildQueryString(baseQuery, { page: 1 })}`}
          className={navButton}
          aria-label="첫 페이지"
          title="첫 페이지"
        >
          <ChevronsLeft className="h-5 w-5" />
        </Link>
        <Link
          href={`${pathname}${buildQueryString(baseQuery, { page: Math.max(1, currentPage - 1) })}`}
          className={navButton}
          aria-label="이전 페이지"
          title="이전 페이지"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>

        <span className="hidden sm:inline-flex items-center min-h-[44px] px-2 text-sm font-medium text-slate-600 dark:text-slate-400" aria-hidden>
          {currentPage} / {totalPages} 페이지
        </span>
        <span className="sr-only">현재 페이지: {currentPage}, 총 {totalPages}페이지</span>

        <div className="flex items-center gap-1">
          {pageNumbers.map((p, i) =>
            p === "ellipsis" ? (
              <span key={`ellipsis-${i}`} className="min-w-[44px] text-center text-slate-400 dark:text-slate-500 px-1" aria-hidden>
                …
              </span>
            ) : (
              <Link
                key={p}
                href={`${pathname}${buildQueryString(baseQuery, { page: p })}`}
                className={`${pageLink} ${p === currentPage ? pageCurrent : pageOther}`}
                aria-label={p === currentPage ? `현재 페이지 ${p}` : `페이지 ${p}`}
                aria-current={p === currentPage ? "page" : undefined}
              >
                {p}
              </Link>
            )
          )}
        </div>

        <Link
          href={`${pathname}${buildQueryString(baseQuery, { page: Math.min(totalPages, currentPage + 1) })}`}
          className={navButton}
          aria-label="다음 페이지"
          title="다음 페이지"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
        <Link
          href={`${pathname}${buildQueryString(baseQuery, { page: totalPages })}`}
          className={navButton}
          aria-label="마지막 페이지"
          title="마지막 페이지"
        >
          <ChevronsRight className="h-5 w-5" />
        </Link>
      </nav>
    </div>
  );
}
