type TeacherNoteProps = {
  context?: string;
  observation: string;
  interpretation?: string;
  caution?: string;
};

export function TeacherNote({ context, observation, interpretation, caution }: TeacherNoteProps) {
  return (
    <aside
      className="my-8 rounded-xl border border-[var(--border)] border-l-4 border-l-[var(--warm)] bg-[var(--surface-2)]/80 p-5 shadow-sm md:p-6"
      aria-label="교사 현장 노트"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--warm)]">교사 노트</p>
      {context && (
        <p className="mt-2 text-sm font-medium text-[var(--muted)]">
          <span className="text-[var(--ink)]">상황: </span>
          {context}
        </p>
      )}
      <p className="mt-2 text-[15.5px] leading-7 text-[var(--ink)] md:text-[17px] md:leading-8">
        {observation}
      </p>
      {interpretation && (
        <p className="mt-3 text-sm italic text-[var(--muted)]">
          <span className="font-medium not-italic text-[var(--ink)]">해석: </span>
          {interpretation}
        </p>
      )}
      {caution && (
        <p className="mt-3 text-xs text-[var(--muted)]">
          ⚠ {caution}
        </p>
      )}
    </aside>
  );
}
