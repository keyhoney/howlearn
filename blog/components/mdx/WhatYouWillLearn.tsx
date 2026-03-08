import { toStringArray } from "@/lib/mdx-props";

type WhatYouWillLearnProps = { items?: string[] | string | null };

export function WhatYouWillLearn({ items }: WhatYouWillLearnProps) {
  const list = toStringArray(items);
  if (list.length === 0) return null;
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 dark:border-slate-600 border-l-4 border-l-indigo-600 dark:border-l-indigo-500 bg-slate-50/80 dark:bg-slate-800/80 p-5 md:p-6"
      aria-label="What you will learn"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
        What you will learn
      </p>
      <ul className="mt-3 space-y-1.5">
        {list.map((item, i) => (
          <li
            key={i}
            className="flex gap-2 text-[15.5px] leading-7 text-slate-900 dark:text-slate-200 md:text-[17px] md:leading-8"
          >
            <span className="font-medium text-indigo-600 dark:text-indigo-400" aria-hidden>
              {i + 1}.
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
