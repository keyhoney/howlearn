type TrustType = 'researchBox' | 'glossary' | 'expertQuote' | string;

type GlossaryItem = { term: string; meaning: string };

type TrustModuleProps = {
  type?: TrustType;
  title?: string;
  body?: string;
  finding?: string;
  implication?: string;
  glossaryItems?: GlossaryItem[] | string | null;
  expertName?: string;
  expertLine?: string;
};

const typeLabels: Record<string, string> = {
  researchBox: '연구 요약',
  glossary: '용어 사전',
  expertQuote: '전문가 의견',
};

function parseGlossaryItems(value: GlossaryItem[] | string | null | undefined): GlossaryItem[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (x): x is GlossaryItem =>
            typeof x === 'object' &&
            x !== null &&
            'term' in x &&
            'meaning' in x
        ) as GlossaryItem[];
      }
    } catch {
      return [];
    }
  }
  return [];
}

export function TrustModule({
  type = 'researchBox',
  title,
  body,
  finding,
  implication,
  glossaryItems,
  expertName,
  expertLine,
}: TrustModuleProps) {
  const label = typeLabels[type] ?? '참고';
  const items = parseGlossaryItems(glossaryItems);

  return (
    <aside
      className="app-mdx-card relative my-8 overflow-hidden p-6 pl-7"
      aria-label={label}
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-[var(--accent)]" aria-hidden />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="app-mdx-kicker">{label}</span>
        {title && <h4 className="app-mdx-title font-bold">{title}</h4>}
      </div>
      {body && <p className="app-mdx-body mb-4">{body}</p>}
      {(finding || implication) && (
        <div className="space-y-3">
          {finding && (
            <div className="rounded-md border border-[var(--card-border)] bg-[var(--surface-2)] p-4">
              <div className="mb-1 text-xs font-bold uppercase text-[var(--fg-muted)]">
                핵심 발견
              </div>
              <p className="app-mdx-title font-medium">{finding}</p>
            </div>
          )}
          {implication && (
            <div className="rounded-md border border-[var(--card-border)] bg-[var(--surface-2)] p-4">
              <div className="mb-1 text-xs font-bold uppercase text-[var(--accent)]">
                부모를 위한 시사점
              </div>
              <p className="font-medium text-[var(--fg)]">{implication}</p>
            </div>
          )}
        </div>
      )}
      {items.length > 0 && (
        <dl className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="rounded-md border border-[var(--card-border)] bg-[var(--surface-2)] p-4">
              <dt className="app-mdx-title mb-1 font-bold">{item.term}</dt>
              <dd className="app-mdx-body text-sm">{item.meaning}</dd>
            </div>
          ))}
        </dl>
      )}
      {expertName && expertLine && (
        <blockquote className="mt-4">
          <p className="app-mdx-body mb-3 font-serif text-lg italic">
            &ldquo;{expertLine}&rdquo;
          </p>
          <footer className="text-sm font-bold text-[var(--fg-muted)]">
            — {expertName}
          </footer>
        </blockquote>
      )}
    </aside>
  );
}
