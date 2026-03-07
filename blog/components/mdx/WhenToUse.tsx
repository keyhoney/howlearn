type WhenToUseProps = { situations: string[] };

export function WhenToUse({ situations }: WhenToUseProps) {
  if (!situations?.length) return null;
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 border-l-4 border-l-cyan-500 bg-slate-50/50 p-5 md:p-6"
      aria-label="When to use"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
        When to use
      </p>
      <ul className="mt-3 space-y-1.5">
        {situations.map((s, i) => (
          <li
            key={i}
            className="flex gap-2 text-[15.5px] leading-7 text-slate-900 md:text-[17px] md:leading-8"
          >
            <span className="text-slate-500" aria-hidden>✓</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
