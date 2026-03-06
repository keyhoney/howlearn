type WhenToUseProps = {
  situations: string[];
};

export function WhenToUse({ situations }: WhenToUseProps) {
  if (!situations?.length) return null;

  return (
    <aside
      className="my-8 rounded-xl border border-[var(--border)] border-l-4 border-l-[var(--pillar-toolkit)] bg-[var(--inset)]/40 p-5 md:p-6"
      aria-label="언제 쓰나요"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-500)]">언제 쓰나요</p>
      <ul className="mt-3 space-y-1.5">
        {situations.map((s, i) => (
          <li key={i} className="flex gap-2 text-[15.5px] leading-7 text-[var(--ink)] md:text-[17px] md:leading-8">
            <span className="text-[var(--muted)]" aria-hidden>✓</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
