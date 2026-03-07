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
      className="my-8 rounded-xl border border-slate-200 border-l-4 border-l-indigo-600 bg-slate-50/80 p-5 shadow-sm md:p-6"
      aria-label="Theory"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Theory</p>
      <h3 className="mt-1 text-lg font-semibold text-slate-900 md:text-xl">{title}</h3>
      <p className="mt-2 text-[15.5px] leading-7 text-slate-900 md:text-[17px] md:leading-8">
        {summary}
      </p>
      {whyItMatters && (
        <p className="mt-3 text-sm font-medium text-slate-500">
          <span className="text-slate-900">Why it matters: </span>
          {whyItMatters}
        </p>
      )}
      {keywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {keywords.map((k) => (
            <span
              key={k}
              className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800"
            >
              {k}
            </span>
          ))}
        </div>
      )}
    </aside>
  );
}
