/**
 * [slug] 동적 라우트용 공통 로딩 스켈레톤
 */
export function SlugRouteSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-12 animate-pulse">
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4 mb-6" />
      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2 mb-8" />
      <div className="space-y-3">
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-5/6" />
      </div>
    </div>
  );
}
