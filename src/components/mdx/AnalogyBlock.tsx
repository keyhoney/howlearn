type AnalogyType = 'warehouse' | 'muscle' | 'road' | 'file' | 'navigation' | string;

type AnalogyBlockProps = {
  type?: AnalogyType;
  concept: string;
  explanation: string;
  wrapUp?: string;
};

function iconFor(t: AnalogyType | undefined): string {
  switch (t) {
    case 'warehouse':
      return '📦';
    case 'muscle':
      return '💪';
    case 'road':
      return '🛣️';
    case 'file':
      return '📁';
    case 'navigation':
      return '🧭';
    default:
      return '💡';
  }
}

export function AnalogyBlock({ type, concept, explanation, wrapUp }: AnalogyBlockProps) {
  return (
    <aside
      className="app-mdx-card-muted my-8 p-6"
      aria-label="비유"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl" aria-hidden>
          {iconFor(type)}
        </span>
        <h4 className="app-mdx-title text-lg">
          비유하자면, <span className="text-[var(--accent)]">{concept}</span>와
          같습니다.
        </h4>
      </div>
      <p className="app-mdx-body mb-4 leading-relaxed">{explanation}</p>
      {wrapUp && (
        <div className="rounded-md border border-[var(--card-border)] bg-[var(--surface-1)] p-4 font-medium text-[var(--fg)]">
          👉 {wrapUp}
        </div>
      )}
    </aside>
  );
}
