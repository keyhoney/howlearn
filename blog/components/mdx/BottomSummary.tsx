import { toStringArray } from "@/lib/mdx-props";

type BottomSummaryProps = {
  /** 기본: 한눈에 정리하면 */
  title?: string;
  points?: string[] | string | null;
};

/**
 * 하단 요약 (참고 BottomSummary + 다크모드)
 */
export function BottomSummary({
  title = "한눈에 정리하면",
  points,
}: BottomSummaryProps) {
  const list = toStringArray(points);
  if (list.length === 0) return null;

  return (
    <aside
      className="my-12 rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-600 dark:bg-slate-800/40"
      aria-label="한눈에 정리"
    >
      <h3 className="mb-6 text-center text-xl font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <div className="mx-auto max-w-xl">
        <ul className="space-y-4">
          {list.map((point, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-600 dark:bg-slate-900"
            >
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-900/60 dark:text-indigo-300">
                {idx + 1}
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {point}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
