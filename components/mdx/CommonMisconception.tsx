type CommonMisconceptionProps = {
  myth: string;
  reality: string;
};

export function CommonMisconception({ myth, reality }: CommonMisconceptionProps) {
  return (
    <aside
      className="my-8 rounded-xl border border-[var(--border)] border-l-4 border-l-[var(--border-strong)] bg-[var(--inset)] p-5 md:p-6"
      aria-label="흔한 오해"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">흔한 오해</p>
      <p className="mt-2 text-[15.5px] leading-7 text-[var(--ink)] line-through md:text-[17px] md:leading-8">
        {myth}
      </p>
      <p className="mt-2 text-[15.5px] font-medium leading-7 text-[var(--ink)] md:text-[17px] md:leading-8">
        실제: {reality}
      </p>
    </aside>
  );
}
