type WhatYouWillLearnProps = {
  items: string[];
};

export function WhatYouWillLearn({ items }: WhatYouWillLearnProps) {
  if (!items?.length) return null;

  return (
    <aside className="my-8 rounded-xl border border-[var(--border)] border-l-4 border-l-[var(--brand-500)] bg-[var(--surface-2)]/80 p-5 md:p-6" aria-label="이 책에서 배울 것">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-500)]">이 책에서 배울 것</p>
      <ul className="mt-3 space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-[15.5px] leading-7 text-[var(--ink)] md:text-[17px] md:leading-8">
            <span className="font-medium text-[var(--brand-500)]" aria-hidden>{i + 1}.</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
