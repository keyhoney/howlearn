import { Lightbulb } from 'lucide-react';

type ConclusionHeroProps = {
  leadLabel?: string;
  line1?: string;
  line2?: string;
  line3?: string;
  line4?: string;
  principle?: string;
};

export function ConclusionHero({
  leadLabel = '결론부터 말하면',
  line1 = '',
  line2 = '',
  line3,
  line4,
  principle,
}: ConclusionHeroProps) {
  const useFourLineMode =
    line3 != null && line4 != null && line3.trim() !== '' && line4.trim() !== '';

  return (
    <header
      className="my-5 overflow-hidden rounded-md border border-[var(--card-border)] bg-[var(--surface-2)] px-5 py-6 text-center shadow-[var(--shadow-card)] sm:px-8 sm:py-7"
      aria-label="결론 요약"
    >
      <p className="app-mdx-kicker mb-3">{leadLabel}</p>

      <div className="mx-auto max-w-2xl space-y-1.5">
        {useFourLineMode ? (
          <>
            <p className="app-mdx-title text-lg leading-snug sm:text-xl md:text-[1.35rem] md:leading-tight">
              <span
                style={{
                  color: 'var(--fg-muted)',
                  textDecoration: 'line-through',
                  textDecorationColor: 'var(--card-border)',
                }}
              >
                {line1}
              </span>
              <span>{line2}</span>
            </p>
            <p className="app-mdx-title text-lg leading-snug sm:text-xl md:text-[1.35rem] md:leading-tight">
              <span className="text-[var(--warning)]">{line3}</span>
              <span>{line4}</span>
            </p>
          </>
        ) : (
          <>
            <p className="app-mdx-title text-lg leading-snug sm:text-xl md:text-[1.35rem] md:leading-tight">{line1}</p>
            <p className="text-lg font-bold leading-snug text-[var(--warning)] sm:text-xl md:text-[1.35rem] md:leading-tight">{line2}</p>
          </>
        )}
      </div>

      {principle && principle.trim() !== '' && (
        <div className="mt-4 flex justify-center sm:mt-5">
          <div
            className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[var(--card-border)] bg-[var(--surface-1)] px-3 py-1.5 text-left sm:px-4 sm:py-2"
          >
            <Lightbulb className="h-4 w-4 shrink-0 text-[var(--warning)] sm:h-5 sm:w-5" aria-hidden />
            <span className="text-xs font-semibold text-[var(--fg)] sm:text-sm">
              {principle}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
