import type { ReactNode } from "react";

type BookTocProps = {
  children?: ReactNode;
};

/**
 * 책 소개 페이지용 목차 래퍼 — 본문과 구분되는 목차 블록
 */
export function BookToc({ children }: BookTocProps) {
  return (
    <div
      className="my-8 rounded-xl border border-slate-200 bg-slate-50/60 px-5 py-6 dark:border-slate-600 dark:bg-slate-800/30 md:px-6 md:py-7"
      aria-label="목차"
    >
      <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-slate-700 dark:text-slate-300 [&_p]:my-1.5 [&_p]:text-inherit">
        {children}
      </div>
    </div>
  );
}
