import { toStringArray } from "@/lib/mdx-props";

type ActionChecklistProps = { title?: string; items?: string[] | string | null };

export function ActionChecklist({
  title = "오늘 적용해 볼 것",
  items,
}: ActionChecklistProps) {
  const list = toStringArray(items);
  if (list.length === 0) return null;
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 dark:border-slate-600 border-l-4 border-l-cyan-500 dark:border-l-cyan-500 bg-slate-50/80 dark:bg-slate-800/80 p-5 shadow-sm md:p-6"
      aria-label="실천 체크리스트"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
        실천 체크리스트
      </p>
      {title && (
        <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100 md:text-lg">{title}</h3>
      )}
      <ul className="mt-3 space-y-2">
        {list.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-[15.5px] leading-7 text-slate-900 dark:text-slate-200 md:text-[17px] md:leading-8"
          >
            <span
              className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-indigo-600 dark:border-indigo-500 bg-white dark:bg-slate-700 text-xs font-medium text-indigo-600 dark:text-indigo-400"
              aria-hidden
            >
              {i + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
