type TrustType = "researchBox" | "glossary" | "expertQuote" | string;

type GlossaryItem = { term: string; meaning: string };

type TrustModuleProps = {
  type?: TrustType;
  title?: string;
  body?: string;
  /** 연구 요약: 핵심 발견 */
  finding?: string;
  /** 연구 요약: 부모를 위한 시사점 */
  implication?: string;
  /** 용어 사전: JSON 배열 문자열 또는 term|meaning 줄바꿈 쌍은 별도 처리 안 함 — items prop 권장 */
  glossaryItems?: GlossaryItem[] | string | null;
  expertName?: string;
  expertLine?: string;
};

const typeLabels: Record<string, string> = {
  researchBox: "연구 요약",
  glossary: "용어 사전",
  expertQuote: "전문가 의견",
};

function parseGlossaryItems(
  value: GlossaryItem[] | string | null | undefined
): GlossaryItem[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (x): x is GlossaryItem =>
            typeof x === "object" &&
            x !== null &&
            "term" in x &&
            "meaning" in x
        ) as GlossaryItem[];
      }
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * 신뢰 보강 모듈 (참고 TrustModule + 다크모드)
 */
export function TrustModule({
  type = "researchBox",
  title,
  body,
  finding,
  implication,
  glossaryItems,
  expertName,
  expertLine,
}: TrustModuleProps) {
  const label = typeLabels[type] ?? "참고";
  const items = parseGlossaryItems(glossaryItems);

  return (
    <aside
      className="relative my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 pl-7 shadow-sm dark:border-slate-600 dark:bg-slate-900"
      aria-label={label}
    >
      <div
        className="absolute left-0 top-0 h-full w-1 bg-slate-800 dark:bg-slate-500"
        aria-hidden
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          {label}
        </span>
        {title && (
          <h4 className="font-bold text-slate-800 dark:text-slate-100">{title}</h4>
        )}
      </div>
      {body && (
        <p className="mb-4 text-slate-700 dark:text-slate-300">{body}</p>
      )}
      {(finding || implication) && (
        <div className="space-y-3">
          {finding && (
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/80">
              <div className="mb-1 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                핵심 발견
              </div>
              <p className="font-medium text-slate-800 dark:text-slate-100">
                {finding}
              </p>
            </div>
          )}
          {implication && (
            <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950/50">
              <div className="mb-1 text-xs font-bold uppercase text-indigo-500 dark:text-indigo-400">
                부모를 위한 시사점
              </div>
              <p className="font-medium text-indigo-900 dark:text-indigo-100">
                {implication}
              </p>
            </div>
          )}
        </div>
      )}
      {items.length > 0 && (
        <dl className="space-y-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/80"
            >
              <dt className="mb-1 font-bold text-slate-800 dark:text-slate-100">
                {item.term}
              </dt>
              <dd className="text-sm text-slate-600 dark:text-slate-400">
                {item.meaning}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {expertName && expertLine && (
        <blockquote className="mt-4">
          <p className="mb-3 font-serif text-lg italic text-slate-700 dark:text-slate-300">
            &ldquo;{expertLine}&rdquo;
          </p>
          <footer className="text-sm font-bold text-slate-500 dark:text-slate-400">
            — {expertName}
          </footer>
        </blockquote>
      )}
    </aside>
  );
}
