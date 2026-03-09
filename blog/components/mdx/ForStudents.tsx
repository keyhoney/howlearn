import { toStringArray } from "@/lib/mdx-props";

type ForStudentsProps = {
  goal?: string;
  steps?: string[] | string | null;
  example?: string;
  tryThisToday?: string;
};

export function ForStudents({
  goal = "",
  steps,
  example,
  tryThisToday,
}: ForStudentsProps) {
  const stepsList = toStringArray(steps);
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 dark:border-slate-600 border-l-4 border-l-indigo-600 dark:border-l-indigo-500 bg-slate-50/50 dark:bg-slate-800/50 p-5 shadow-sm md:p-6"
      aria-label="학생용"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">학생용</p>
      <p className="mt-2 font-medium text-slate-900 dark:text-slate-100">{goal}</p>
      {stepsList.length > 0 && (
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[15.5px] leading-7 text-slate-900 dark:text-slate-200 md:text-[17px]">
          {stepsList.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      )}
      {example && (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-900 dark:text-slate-100">예: </span>
          {example}
        </p>
      )}
      {tryThisToday && (
        <p className="mt-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100">
          오늘 해보기: {tryThisToday}
        </p>
      )}
    </aside>
  );
}
