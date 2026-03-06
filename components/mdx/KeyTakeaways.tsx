type KeyTakeawaysProps = {
  items: string[];
};

export function KeyTakeaways({ items }: KeyTakeawaysProps) {
  if (!items?.length) return null;

  return (
    <aside
      className="my-8 rounded-xl border-2 border-[var(--brand-500)]/30 bg-[var(--brand-500)]/5 p-5 md:p-6"
      aria-label="핵심 요약"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-500)]">핵심 요약</p>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-[15.5px] leading-7 text-[var(--ink)] md:text-[17px] md:leading-8">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-500)]" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
