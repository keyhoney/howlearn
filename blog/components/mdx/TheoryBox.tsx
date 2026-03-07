type TheoryBoxProps = {
  title: string;
  summary: string;
  whyItMatters?: string;
  keywords?: string[];
};

export function TheoryBox({
  title,
  summary,
  whyItMatters,
  keywords = [],
}: TheoryBoxProps) {
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 dark:border-slate-600 border-l-4 border-l-indigo-600 dark:border-l-indigo-500 bg-slate-50/80 dark:bg-slate-800/80 p-5 shadow-sm md:p-6"
      aria-label="Theory"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Theory</p>
      <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100 md:text-xl">{title}</h3>
      <p className="mt-2 text-[15.5px] leading-7 text-slate-900 dark:text-slate-200 md:text-[17px] md:leading-8">
        {summary}
      </p>
      {whyItMatters && (
        <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
          <span className="text-slate-900 dark:text-slate-100">Why it matters: </span>
          {whyItMatters}
        </p>
      )}
      {keywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {keywords.map((k) => (
            <span
              key={k}
              className="rounded-full bg-amber-100 dark:bg-amber-900/40 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-200"
            >
              {k}
            </span>
          ))}
        </div>
      )}
    </aside>
  );
}
