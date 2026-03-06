type ActionChecklistProps = {
  title?: string;
  items: string[];
};

export function ActionChecklist({ title = "오늘 바로 적용할 수 있는 것", items }: ActionChecklistProps) {
  if (!items?.length) return null;

  return (
    <aside
      className="my-8 rounded-xl border border-[var(--border)] border-l-4 border-l-[var(--pillar-toolkit)] bg-[var(--surface-2)]/80 p-5 shadow-sm md:p-6"
      aria-label="실천 체크리스트"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-500)]">실천 체크리스트</p>
      {title && (
        <h3 className="mt-1 text-base font-semibold text-[var(--ink)] md:text-lg" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
          {title}
        </h3>
      )}
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-[15.5px] leading-7 text-[var(--ink)] md:text-[17px] md:leading-8">
            <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-[var(--brand-500)] bg-white text-xs font-medium text-[var(--brand-500)]" aria-hidden>
              {i + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
