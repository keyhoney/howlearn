import { toStringArray } from "@/lib/mdx-props";

type ReflectionPromptProps = { title?: string; questions?: string[] | string | null };

export function ReflectionPrompt({
  title = "Reflect",
  questions,
}: ReflectionPromptProps) {
  const list = toStringArray(questions);
  if (list.length === 0) return null;
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 dark:border-slate-600 border-l-4 border-l-indigo-600 dark:border-l-indigo-500 bg-slate-50/80 dark:bg-slate-800/80 p-5 shadow-sm md:p-6"
      aria-label="성찰"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">성찰</p>
      <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100 md:text-lg">{title}</h3>
      <ul className="mt-3 space-y-2">
        {list.map((q, i) => (
          <li
            key={i}
            className="flex gap-2 text-[15.5px] leading-7 text-slate-900 dark:text-slate-200 md:text-[17px] md:leading-8"
          >
            <span className="text-slate-500 dark:text-slate-400" aria-hidden>•</span>
            <span>{q}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
