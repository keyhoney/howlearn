type WhoThisIsForProps = {
  items: string[];
};

export function WhoThisIsFor({ items }: WhoThisIsForProps) {
  if (!items?.length) return null;

  return (
    <aside className="my-8 rounded-xl border border-[var(--border)] bg-[var(--inset)]/40 p-5 md:p-6" aria-label="이 책이 필요한 분">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">이 책이 필요한 분</p>
      <ul className="mt-3 space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-[15.5px] leading-7 text-[var(--ink)] md:text-[17px] md:leading-8">
            <span className="text-[var(--brand-500)]" aria-hidden>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
