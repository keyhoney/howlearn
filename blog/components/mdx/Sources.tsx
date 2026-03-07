type SourceItem = {
  author: string;
  year: string;
  title: string;
  source?: string;
  note?: string;
  href?: string;
};

type SourcesProps = { items: SourceItem[] };

export function Sources({ items }: SourcesProps) {
  if (!items?.length) return null;
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 bg-slate-50/50 p-5 md:p-6"
      aria-label="References"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sources</p>
      <ul className="mt-3 space-y-3">
        {items.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed text-slate-900">
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-700"
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
              <span className="mt-0.5 block text-slate-500">{item.note}</span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
