import { toTroubleshootingItemsArray } from "@/lib/mdx-props";

type TroubleshootingProps = { items?: Parameters<typeof toTroubleshootingItemsArray>[0] };

export function Troubleshooting({ items }: TroubleshootingProps) {
  const list = toTroubleshootingItemsArray(items);
  if (list.length === 0) return null;
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/80 p-5 md:p-6"
      aria-label="Troubleshooting"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Common issues
      </p>
      <ul className="mt-3 space-y-4">
        {list.map((item, i) => (
          <li
            key={i}
            className="border-b border-slate-200 dark:border-slate-600 pb-4 last:border-0 last:pb-0"
          >
            <p className="font-medium text-slate-900 dark:text-slate-100">{item.problem}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">→ {item.solution}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
