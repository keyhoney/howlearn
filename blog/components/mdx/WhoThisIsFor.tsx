type WhoThisIsForProps = { items: string[] };

export function WhoThisIsFor({ items }: WhoThisIsForProps) {
  if (!items?.length) return null;
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 bg-slate-50/50 p-5 md:p-6"
      aria-label="Who this is for"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Who this is for
      </p>
      <ul className="mt-3 space-y-1.5">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-2 text-[15.5px] leading-7 text-slate-900 md:text-[17px] md:leading-8"
          >
            <span className="text-indigo-600" aria-hidden>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
