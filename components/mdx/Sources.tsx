type SourceItem = {
  author: string;
  year: string;
  title: string;
  source?: string;
  note?: string;
  href?: string;
};

type SourcesProps = {
  items: SourceItem[];
};

export function Sources({ items }: SourcesProps) {
  if (!items?.length) return null;

  return (
    <aside
      className="my-8 rounded-xl border border-[var(--border)] bg-[var(--inset)]/50 p-5 md:p-6"
      aria-label="참고 문헌"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">출처</p>
      <ul className="mt-3 space-y-3">
        {items.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed text-[var(--ink)]">
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--brand-500)] underline underline-offset-2 hover:text-[var(--brand-600)]"
              >
                {item.author} ({item.year}). {item.title}.
                {item.source ? ` ${item.source}.` : ""}
              </a>
            ) : (
              <span>
                {item.author} ({item.year}). {item.title}.
                {item.source ? ` ${item.source}.` : ""}
              </span>
            )}
            {item.note && (
              <span className="block mt-0.5 text-[var(--muted)]">{item.note}</span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
