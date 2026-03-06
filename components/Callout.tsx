type CalloutProps = {
  title?: string;
  children: React.ReactNode;
};

export function Callout({ title = "핵심", children }: CalloutProps) {
  return (
    <div className="my-6 rounded-2xl border border-[var(--border)]/80 border-l-4 border-l-[var(--accent)] bg-[var(--inset)]/50 px-5 py-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
        {title}
      </p>
      <div className="mt-2 text-[15.5px] leading-7 text-[var(--ink)] [&>p]:mb-2 [&>p:last-child]:mb-0 md:text-[17px] md:leading-8">
        {children}
      </div>
    </div>
  );
}
