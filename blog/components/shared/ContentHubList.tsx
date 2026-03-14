import { ContentType, AnyContent } from "@/lib/types";
import { ContentCard } from "@/components/cards/ContentCard";
import { PaginationBar } from "@/components/shared/PaginationBar";
import type { ContentHubPagination } from "@/components/shared/ContentHub";

interface ContentHubListProps {
  content: AnyContent[];
  type: ContentType;
  title: string;
  pagination?: ContentHubPagination;
}

/**
 * 가이드/개념 목록을 서버에서 렌더해 초기 HTML에 링크가 포함되도록 합니다. (SEO)
 */
export function ContentHubList({ content, type, title, pagination }: ContentHubListProps) {
  if (content.length === 0) {
    return (
      <div className="text-center py-12 sm:py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600">
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
          검색 결과가 없습니다.
        </h3>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          다른 검색어나 필터를 시도해 보세요.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {content.map((item) => (
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
    </div>
  );
}
