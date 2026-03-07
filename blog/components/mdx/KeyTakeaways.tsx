type KeyTakeawaysProps = { items: string[] };

export function KeyTakeaways({ items }: KeyTakeawaysProps) {
  if (!items?.length) return null;
  return (
    <aside
      className="my-8 rounded-xl border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/50 p-5 md:p-6"
      aria-label="Key takeaways"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Key takeaways</p>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-2 text-[15.5px] leading-7 text-slate-900 dark:text-slate-200 md:text-[17px] md:leading-8"
          >
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600"
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
