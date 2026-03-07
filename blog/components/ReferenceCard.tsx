type ReferenceItem = {
  title?: string;
  url: string;
};

type ReferenceCardProps = {
  items: ReferenceItem[];
};

export function ReferenceCard({ items }: ReferenceCardProps) {
  if (!items || items.length === 0) return null;

  return (
    <aside
      id="references"
      className="mt-14 border-t-2 border-slate-200 dark:border-slate-700 pt-10 scroll-mt-24"
    >
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Appendix
      </p>
      <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">
        References
      </h2>
      <ul className="mt-4 space-y-2">
        {items.map((item, i) => (
          <li key={i}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 no-underline transition hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {item.title || item.url}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
