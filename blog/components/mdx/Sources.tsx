import { toSourceItemsArray, type SourceItem } from "@/lib/mdx-props";

function doiUrl(doi: string): string {
  const clean = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").trim();
  return `https://doi.org/${clean}`;
}

type SourcesProps = {
  items?: Parameters<typeof toSourceItemsArray>[0];
  /** 기본 "참고 문헌" */
  title?: string;
};

export function Sources({ items, title = "참고 문헌" }: SourcesProps) {
  const list = toSourceItemsArray(items);
  if (list.length === 0) return null;

  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 p-5 md:p-6"
      aria-label={title}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <ul className="mt-3 space-y-3 list-none pl-0">
        {list.map((item, i) => {
          const href = item.href || (item.doi ? doiUrl(item.doi) : undefined);
          const text = (
            <>
              {item.author}
              {item.year ? ` (${item.year}). ` : ". "}
              <em className="not-italic font-medium">{item.title}</em>.
              {item.source ? ` ${item.source}.` : ""}
            </>
          );
          return (
            <li key={i} className="text-sm leading-relaxed text-slate-900 dark:text-slate-200">
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  {text}
                </a>
              ) : (
                <span>{text}</span>
              )}
              {item.note && (
                <span className="mt-0.5 block text-slate-500 dark:text-slate-400">{item.note}</span>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
