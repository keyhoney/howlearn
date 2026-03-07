type BookOverviewProps = { title?: string; children: React.ReactNode };

export function BookOverview({
  title = "About this book",
  children,
}: BookOverviewProps) {
  return (
    <aside
      className="my-8 rounded-xl border-2 border-indigo-200 bg-slate-50/80 p-5 md:p-6"
      aria-label="Book overview"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
        Book overview
      </p>
      {title && (
        <h3 className="mt-1 text-lg font-semibold text-slate-900">{title}</h3>
      )}
      <div className="mt-2 text-[15.5px] leading-7 text-slate-900 [&>p]:mb-2 [&>p:last-child]:mb-0 md:text-[17px] md:leading-8">
        {children}
      </div>
    </aside>
  );
}
