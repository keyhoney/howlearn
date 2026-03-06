type ReflectionPromptProps = {
  title?: string;
  questions: string[];
};

export function ReflectionPrompt({ title = "이렇게 돌아보세요", questions }: ReflectionPromptProps) {
  if (!questions?.length) return null;

  return (
    <aside
      className="my-8 rounded-xl border border-[var(--border)] border-l-4 border-l-[var(--brand-500)] bg-[var(--surface-2)]/80 p-5 shadow-sm md:p-6"
      aria-label="성찰 질문"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-500)]">성찰</p>
      <h3 className="mt-1 text-base font-semibold text-[var(--ink)] md:text-lg" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
        {title}
      </h3>
      <ul className="mt-3 space-y-2">
        {questions.map((q, i) => (
          <li key={i} className="flex gap-2 text-[15.5px] leading-7 text-[var(--ink)] md:text-[17px] md:leading-8">
            <span className="text-[var(--muted)]" aria-hidden>•</span>
            <span>{q}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
