type WhyItMattersProps = {
  children: React.ReactNode;
};

export function WhyItMatters({ children }: WhyItMattersProps) {
  return (
    <aside
      className="my-8 rounded-xl border border-[var(--border)] border-l-4 border-l-[var(--brand-500)] bg-[var(--brand-500)]/5 p-5 md:p-6"
      aria-label="왜 중요한가"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-500)]">왜 중요한가</p>
      <div className="mt-2 text-[15.5px] leading-7 text-[var(--ink)] [&>p]:mb-2 [&>p:last-child]:mb-0 md:text-[17px] md:leading-8">
        {children}
      </div>
    </aside>
  );
}
