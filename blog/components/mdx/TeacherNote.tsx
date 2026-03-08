type TeacherNoteProps = {
  context?: string;
  observation?: string;
  interpretation?: string;
  caution?: string;
};

export function TeacherNote({
  context,
  observation = "",
  interpretation,
  caution,
}: TeacherNoteProps) {
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 dark:border-slate-600 border-l-4 border-l-amber-500 dark:border-l-amber-500 bg-slate-50/80 dark:bg-slate-800/80 p-5 shadow-sm md:p-6"
      aria-label="Teacher note"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">Teacher note</p>
      {context && (
        <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          <span className="text-slate-900 dark:text-slate-100">Context: </span>
          {context}
        </p>
      )}
      <p className="mt-2 text-[15.5px] leading-7 text-slate-900 dark:text-slate-200 md:text-[17px] md:leading-8">
        {observation}
      </p>
      {interpretation && (
        <p className="mt-3 text-sm italic text-slate-500 dark:text-slate-400">
          <span className="font-medium not-italic text-slate-900 dark:text-slate-100">Interpretation: </span>
          {interpretation}
        </p>
      )}
      {caution && <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">⚠ {caution}</p>}
    </aside>
  );
}
