type TopicIntroProps = { title: string; description: string };

export function TopicIntro({ title, description }: TopicIntroProps) {
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/80 dark:bg-slate-800/80 p-5 md:p-6"
      aria-label="Topic intro"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Topic intro
      </p>
      <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100 md:text-2xl">{title}</h3>
      <p className="mt-2 text-[15.5px] leading-7 text-slate-900 dark:text-slate-200 md:text-[17px] md:leading-8">
        {description}
      </p>
    </aside>
  );
}
