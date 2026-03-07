type ActionChecklistProps = { title?: string; items: string[] };

export function ActionChecklist({
  title = "Things to try today",
  items,
}: ActionChecklistProps) {
  if (!items?.length) return null;
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 border-l-4 border-l-cyan-500 bg-slate-50/80 p-5 shadow-sm md:p-6"
      aria-label="Action checklist"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
        Action checklist
      </p>
      {title && (
        <h3 className="mt-1 text-base font-semibold text-slate-900 md:text-lg">{title}</h3>
      )}
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-[15.5px] leading-7 text-slate-900 md:text-[17px] md:leading-8"
          >
            <span
              className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-indigo-600 bg-white text-xs font-medium text-indigo-600"
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
