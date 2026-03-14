type TopicIntroProps = {
  title?: string;
  description?: string;
  /** 위에 표시할 라벨. 빈 문자열이면 라벨 줄을 숨김. 기본값 "주제 소개" */
  label?: string;
};

export function TopicIntro({ title = "", description = "", label = "주제 소개" }: TopicIntroProps) {
  if (!title && !description) return null;
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/80 dark:bg-slate-800/80 p-5 md:p-6"
      aria-label={label || title || "소개"}
    >
      {label ? (
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </p>
      ) : null}
      <h3 className={`text-xl font-semibold text-slate-900 dark:text-slate-100 md:text-2xl ${label ? "mt-1" : ""}`}>{title}</h3>
      <p className="mt-2 text-[15.5px] leading-7 text-slate-900 dark:text-slate-200 md:text-[17px] md:leading-8">
        {description}
      </p>
    </aside>
  );
}
