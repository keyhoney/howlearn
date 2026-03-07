type WhyItMattersProps = { children: React.ReactNode };

export function WhyItMatters({ children }: WhyItMattersProps) {
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 border-l-4 border-l-indigo-600 bg-indigo-50/50 p-5 md:p-6"
      aria-label="Why it matters"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
        Why it matters
      </p>
      <div className="mt-2 text-[15.5px] leading-7 text-slate-900 [&>p]:mb-2 [&>p:last-child]:mb-0 md:text-[17px] md:leading-8">
        {children}
      </div>
    </aside>
  );
}
