import { toSourceItemsArray, type SourceItem } from "@/lib/mdx-props";

type SourcesProps = { items?: Parameters<typeof toSourceItemsArray>[0] };

export function Sources({ items }: SourcesProps) {
  const list = toSourceItemsArray(items);
  if (list.length === 0) return null;
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 p-5 md:p-6"
      aria-label="References"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sources</p>
      <ul className="mt-3 space-y-3">
        {list.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed text-slate-900 dark:text-slate-200">
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-700 dark:hover:text-indigo-300"
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
              <span className="mt-0.5 block text-slate-500 dark:text-slate-400">{item.note}</span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
