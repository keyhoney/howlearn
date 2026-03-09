type PrintableBlockProps = { title?: string; children: React.ReactNode };

export function PrintableBlock({
  title = "인쇄용",
  children,
}: PrintableBlockProps) {
  return (
    <div
      className="my-8 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/80 p-5 print:border print:border-slate-300 md:p-6"
      aria-label={title}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:mb-2">
        {title}
      </p>
      <div className="mt-2 text-[15.5px] leading-7 text-slate-900 dark:text-slate-200 [&>p]:mb-2 [&>p:last-child]:mb-0 [&_*]:text-inherit md:text-[17px] md:leading-8">
        {children}
      </div>
    </div>
  );
}
