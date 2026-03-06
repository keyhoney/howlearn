type ForStudentsProps = {
  goal: string;
  steps?: string[];
  example?: string;
  tryThisToday?: string;
};

export function ForStudents({ goal, steps = [], example, tryThisToday }: ForStudentsProps) {
  return (
    <aside
      className="my-8 rounded-xl border border-[var(--border)] border-l-4 border-l-[var(--pillar-concepts)] bg-[var(--inset)]/40 p-5 shadow-sm md:p-6"
      aria-label="학생 적용 안내"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-500)]">학생에게</p>
      <p className="mt-2 font-medium text-[var(--ink)]">{goal}</p>
      {steps.length > 0 && (
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[15.5px] leading-7 text-[var(--ink)] md:text-[17px]">
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      )}
      {example && (
        <p className="mt-3 text-sm text-[var(--muted)]">
          <span className="font-medium text-[var(--ink)]">예: </span>
          {example}
        </p>
      )}
      {tryThisToday && (
        <p className="mt-4 rounded-lg bg-[var(--brand-500)]/10 px-3 py-2 text-sm font-medium text-[var(--ink)]">
          오늘 해보기: {tryThisToday}
        </p>
      )}
    </aside>
  );
}
