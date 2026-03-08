import { toStringArray } from "@/lib/mdx-props";

type WhenToUseProps = { situations?: string[] | string | null };

export function WhenToUse({ situations }: WhenToUseProps) {
  const list = toStringArray(situations);
  if (list.length === 0) return null;
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 dark:border-slate-600 border-l-4 border-l-cyan-500 dark:border-l-cyan-500 bg-slate-50/50 dark:bg-slate-800/50 p-5 md:p-6"
      aria-label="When to use"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
        When to use
      </p>
      <ul className="mt-3 space-y-1.5">
        {list.map((s, i) => (
          <li
            key={i}
            className="flex gap-2 text-[15.5px] leading-7 text-slate-900 dark:text-slate-200 md:text-[17px] md:leading-8"
          >
            <span className="text-slate-500 dark:text-slate-400" aria-hidden>✓</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
