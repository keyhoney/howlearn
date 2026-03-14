import type { ReactNode } from "react";

type BookStoreLinksProps = {
  children?: ReactNode;
};

/**
 * 책 소개 페이지용 서점 링크 카드 — 링크 목록을 감싸서 여백·테두리로 구분
 */
export function BookStoreLinks({ children }: BookStoreLinksProps) {
  return (
    <div
      className="my-6 rounded-xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-600 dark:bg-slate-800/50 md:p-6 [&_ul]:list-none [&_ul]:space-y-2 [&_ul]:pl-0 [&_li]:flex [&_li]:items-center [&_a]:inline-flex [&_a]:items-center [&_a]:gap-2 [&_a]:font-medium [&_a]:text-slate-800 [&_a]:no-underline [&_a]:hover:underline dark:[&_a]:text-slate-200"
      aria-label="서점 구매 링크"
    >
      {children}
    </div>
  );
}
