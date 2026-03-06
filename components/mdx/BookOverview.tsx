type BookOverviewProps = {
  title?: string;
  children: React.ReactNode;
};

export function BookOverview({ title = "이 책에 대해", children }: BookOverviewProps) {
  return (
    <aside
      className="my-8 rounded-xl border-2 border-[var(--brand-500)]/20 bg-[var(--surface-2)]/80 p-5 md:p-6"
      aria-label="책 개요"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-500)]">책 개요</p>
      {title && (
        <h3 className="mt-1 text-lg font-semibold text-[var(--ink)]" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
          {title}
        </h3>
      )}
      <div className="mt-2 text-[15.5px] leading-7 text-[var(--ink)] [&>p]:mb-2 [&>p:last-child]:mb-0 md:text-[17px] md:leading-8">
        {children}
      </div>
    </aside>
  );
}
