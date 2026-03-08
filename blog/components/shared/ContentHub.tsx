import { Suspense } from "react";
import { ContentType, AnyContent } from "@/lib/types";
import { ContentHubFilters } from "@/components/shared/ContentHubFilters";

export interface ContentHubPagination {
  totalCount: number;
  page: number;
  perPage: number;
  totalPages: number;
  pathname: string;
}

interface ContentHubProps {
  title: string;
  description: string;
  content: AnyContent[];
  type: ContentType;
  hideHeader?: boolean;
  /** 페이지네이션 사용 시 서버에서 전달. 없으면 기존처럼 content.length로 총 개수 표시 */
  pagination?: ContentHubPagination;
  /** 페이지네이션 사용 시 서버에서 계산한 태그 목록 (도메인 선택 시 드롭다운용) */
  availableTags?: string[];
}

export function ContentHub({ title, description, content, type, hideHeader, pagination, availableTags }: ContentHubProps) {
  const totalLabel = pagination ? pagination.totalCount : content.length;
  return (
    <div className={hideHeader ? "" : "container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20"}>
      {!hideHeader && (
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{title}</h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl">{description}</p>
          <div className="mt-4 sm:mt-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
            총 {totalLabel}개의 {title}
          </div>
        </div>
      )}

      <Suspense fallback={<div className="text-slate-500">Loading...</div>}>
        <ContentHubFilters
          content={content}
          type={type}
          title={title}
          pagination={pagination}
          availableTags={availableTags}
        />
      </Suspense>
    </div>
  );
}
