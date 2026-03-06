type ForParentsProps = {
  situation: string;
  whatToSay?: string;
  whatToDo?: string[];
  avoid?: string[];
};

export function ForParents({ situation, whatToSay, whatToDo = [], avoid = [] }: ForParentsProps) {
  return (
    <aside
      className="my-8 rounded-xl border border-[var(--border)] border-l-4 border-l-[var(--pillar-toolkit)] bg-[var(--surface-2)]/80 p-5 shadow-sm md:p-6"
      aria-label="학부모 적용 안내"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-500)]">학부모에게</p>
      <p className="mt-2 text-[15.5px] leading-7 text-[var(--ink)] md:text-[17px] md:leading-8">
        <span className="font-medium text-[var(--ink)]">상황: </span>
        {situation}
      </p>
      {whatToSay && (
        <p className="mt-3 text-sm font-medium text-[var(--ink)]">
          이렇게 말해 보세요: &ldquo;{whatToSay}&rdquo;
        </p>
      )}
      {whatToDo.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-[15.5px] leading-7 text-[var(--ink)] md:text-[17px]">
          {whatToDo.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
      {avoid.length > 0 && (
        <p className="mt-4 text-sm text-[var(--muted)]">
          <span className="font-medium text-[var(--ink)]">피하기: </span>
          {avoid.join(" · ")}
        </p>
      )}
    </aside>
  );
}
