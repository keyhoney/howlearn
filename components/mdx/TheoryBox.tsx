type TheoryBoxProps = {
  title: string;
  summary: string;
  whyItMatters?: string;
  keywords?: string[];
};

export function TheoryBox({ title, summary, whyItMatters, keywords = [] }: TheoryBoxProps) {
  return (
    <aside
      className="my-8 rounded-xl border border-[var(--border)] border-l-4 border-l-[var(--brand-500)] bg-[var(--surface-2)]/80 p-5 shadow-sm md:p-6"
      aria-label="학습 과학 이론"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-500)]">이론</p>
      <h3 className="mt-1 text-lg font-semibold text-[var(--ink)] md:text-xl" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
        {title}
      </h3>
      <p className="mt-2 text-[15.5px] leading-7 text-[var(--ink)] md:text-[17px] md:leading-8">
        {summary}
      </p>
      {whyItMatters && (
        <p className="mt-3 text-sm font-medium text-[var(--muted)]">
          <span className="text-[var(--ink)]">왜 중요한가: </span>
          {whyItMatters}
        </p>
      )}
      {keywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {keywords.map((k) => (
            <span
              key={k}
              className="rounded-full bg-[var(--warm)]/15 px-2.5 py-0.5 text-xs font-medium text-[var(--warm)]"
            >
              {k}
            </span>
          ))}
        </div>
      )}
    </aside>
  );
}
