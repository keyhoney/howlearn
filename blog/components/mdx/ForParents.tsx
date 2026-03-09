import { toStringArray } from "@/lib/mdx-props";

type ForParentsProps = {
  situation?: string;
  whatToSay?: string;
  whatToDo?: string[] | string | null;
  avoid?: string[] | string | null;
};

export function ForParents({
  situation = "",
  whatToSay,
  whatToDo,
  avoid,
}: ForParentsProps) {
  const whatToDoList = toStringArray(whatToDo);
  const avoidList = toStringArray(avoid);
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 dark:border-slate-600 border-l-4 border-l-cyan-500 dark:border-l-cyan-500 bg-slate-50/80 dark:bg-slate-800/80 p-5 shadow-sm md:p-6"
      aria-label="부모용"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">부모용</p>
      <p className="mt-2 text-[15.5px] leading-7 text-slate-900 dark:text-slate-200 md:text-[17px] md:leading-8">
        <span className="font-medium text-slate-900 dark:text-slate-100">상황: </span>
        {situation}
      </p>
      {whatToSay && (
        <p className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-100">
          이렇게 말해보기: &ldquo;{whatToSay}&rdquo;
        </p>
      )}
      {whatToDoList.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-[15.5px] leading-7 text-slate-900 dark:text-slate-200 md:text-[17px]">
          {whatToDoList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
      {avoidList.length > 0 && (
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-900 dark:text-slate-100">피하기: </span>
          {avoidList.join(" · ")}
        </p>
      )}
    </aside>
  );
}
