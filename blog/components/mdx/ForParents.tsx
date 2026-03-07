type ForParentsProps = {
  situation: string;
  whatToSay?: string;
  whatToDo?: string[];
  avoid?: string[];
};

export function ForParents({
  situation,
  whatToSay,
  whatToDo = [],
  avoid = [],
}: ForParentsProps) {
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 border-l-4 border-l-cyan-500 bg-slate-50/80 p-5 shadow-sm md:p-6"
      aria-label="For parents"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">For parents</p>
      <p className="mt-2 text-[15.5px] leading-7 text-slate-900 md:text-[17px] md:leading-8">
        <span className="font-medium text-slate-900">Situation: </span>
        {situation}
      </p>
      {whatToSay && (
        <p className="mt-3 text-sm font-medium text-slate-900">
          Try saying: &ldquo;{whatToSay}&rdquo;
        </p>
      )}
      {whatToDo.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-[15.5px] leading-7 text-slate-900 md:text-[17px]">
          {whatToDo.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
      {avoid.length > 0 && (
        <p className="mt-4 text-sm text-slate-500">
          <span className="font-medium text-slate-900">Avoid: </span>
          {avoid.join(" · ")}
        </p>
      )}
    </aside>
  );
}
