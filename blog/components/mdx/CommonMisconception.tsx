type CommonMisconceptionProps = { myth?: string; reality?: string };

export function CommonMisconception({ myth = "", reality = "" }: CommonMisconceptionProps) {
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 dark:border-slate-600 border-l-4 border-l-slate-300 dark:border-l-slate-500 bg-slate-50 dark:bg-slate-800/80 p-5 md:p-6"
      aria-label="Common misconception"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Common misconception
      </p>
      <p className="mt-2 text-[15.5px] leading-7 text-slate-900 dark:text-slate-300 line-through md:text-[17px] md:leading-8">
        {myth}
      </p>
      <p className="mt-2 text-[15.5px] font-medium leading-7 text-slate-900 dark:text-slate-100 md:text-[17px] md:leading-8">
        Actually: {reality}
      </p>
    </aside>
  );
}
