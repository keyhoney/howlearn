type CommonMisconceptionProps = { myth: string; reality: string };

export function CommonMisconception({ myth, reality }: CommonMisconceptionProps) {
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 border-l-4 border-l-slate-300 bg-slate-50 p-5 md:p-6"
      aria-label="Common misconception"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Common misconception
      </p>
      <p className="mt-2 text-[15.5px] leading-7 text-slate-900 line-through md:text-[17px] md:leading-8">
        {myth}
      </p>
      <p className="mt-2 text-[15.5px] font-medium leading-7 text-slate-900 md:text-[17px] md:leading-8">
        Actually: {reality}
      </p>
    </aside>
  );
}
