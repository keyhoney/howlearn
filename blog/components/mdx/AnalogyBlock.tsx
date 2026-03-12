type AnalogyType =
  | "warehouse"
  | "muscle"
  | "road"
  | "file"
  | "navigation"
  | string;

type AnalogyBlockProps = {
  /** 비유 유형 (아이콘 이모지 선택용) */
  type?: AnalogyType;
  concept: string;
  explanation: string;
  /** 부모 친화 한 줄 마무리 */
  wrapUp?: string;
};

function iconFor(t: AnalogyType | undefined): string {
  switch (t) {
    case "warehouse":
      return "📦";
    case "muscle":
      return "💪";
    case "road":
      return "🛣️";
    case "file":
      return "📁";
    case "navigation":
      return "🧭";
    default:
      return "💡";
  }
}

/**
 * 비유 블록 (참고 AnalogyBlock + 다크모드)
 */
export function AnalogyBlock({
  type,
  concept,
  explanation,
  wrapUp,
}: AnalogyBlockProps) {
  return (
    <aside
      className="my-8 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:border-slate-600 dark:from-slate-900 dark:to-slate-800"
      aria-label="비유"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl" aria-hidden>
          {iconFor(type)}
        </span>
        <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          비유하자면,{" "}
          <span className="text-indigo-600 dark:text-indigo-400">{concept}</span>
          와 같습니다.
        </h4>
      </div>
      <p className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">
        {explanation}
      </p>
      {wrapUp && (
        <div className="rounded-xl border border-slate-100 bg-white p-4 font-medium text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
          👉 {wrapUp}
        </div>
      )}
    </aside>
  );
}
