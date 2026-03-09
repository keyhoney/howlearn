type WhyItMattersProps = { children: React.ReactNode };

export function WhyItMatters({ children }: WhyItMattersProps) {
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 dark:border-slate-600 border-l-4 border-l-indigo-600 dark:border-l-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/50 p-5 md:p-6"
      aria-label="왜 중요한가"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
        왜 중요한가
      </p>
      <div className="mt-2 text-[15.5px] leading-7 text-slate-900 dark:text-slate-200 [&>p]:mb-2 [&>p:last-child]:mb-0 [&_*]:text-inherit md:text-[17px] md:leading-8">
        {children}
      </div>
    </aside>
  );
}
