"use client";

/**
 * [slug] 동적 라우트용 공통 에러 UI (error.tsx에서 reset과 함께 사용)
 */
export function SlugRouteError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="container mx-auto max-w-lg px-4 py-16 text-center">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
        페이지를 불러오지 못했습니다
      </h2>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        잠시 후 다시 시도해 주세요.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        다시 시도
      </button>
    </div>
  );
}
