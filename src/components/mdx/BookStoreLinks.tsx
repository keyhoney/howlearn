import type { ReactNode } from 'react';

type BookStoreLinksProps = {
  children?: ReactNode;
};

export function BookStoreLinks({ children }: BookStoreLinksProps) {
  return (
    <div
      className="my-6 rounded-xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-600 dark:bg-slate-800/50 md:p-6 [&_a]:inline-flex [&_a]:items-center [&_a]:gap-2 [&_a]:font-medium [&_a]:text-slate-800 [&_a]:no-underline [&_a]:hover:underline [&_li]:flex [&_li]:items-center [&_li:not(:last-child)]:mr-3 [&_li:not(:last-child)]:border-r [&_li:not(:last-child)]:border-slate-300 [&_li:not(:last-child)]:pr-3 [&_ul]:list-none [&_ul]:flex [&_ul]:flex-row [&_ul]:flex-wrap [&_ul]:items-center [&_ul]:justify-center [&_ul]:gap-0 [&_ul]:pl-0 dark:[&_a]:text-slate-200 dark:[&_li:not(:last-child)]:border-slate-500"
      aria-label="서점 구매 링크"
    >
      {children}
    </div>
  );
}
