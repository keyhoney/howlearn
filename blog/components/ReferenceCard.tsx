type ReferenceItem = {
  title?: string;
  url: string;
};

type ReferenceCardProps = {
  items: ReferenceItem[];
};

export function ReferenceCard({ items }: ReferenceCardProps) {
  const list = Array.isArray(items) ? items : [];
  if (list.length === 0) return null;

  return (
    <aside
      id="references"
      className="mt-14 border-t-2 border-slate-200 dark:border-slate-700 pt-10 scroll-mt-24"
    >
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        참고 문헌
      </p>
      <h2 className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-100">
        References
      </h2>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        본 문서에서 인용·참고한 자료입니다.
      </p>
      <ul className="mt-4 space-y-2">
        {list.map((item, i) => {
          const label = item.title || item.url || "";
          const hasUrl = typeof item.url === "string" && item.url.trim() !== "";

          return (
            <li key={i}>
              {hasUrl ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 no-underline transition hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {label}
                </a>
              ) : (
                <span className="block rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                  {label}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
