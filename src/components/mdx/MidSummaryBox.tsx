import { toStringArray } from '@/lib/mdx-props';

type MidSummaryBoxProps = {
  title?: string;
  points?: string[] | string | null;
  items?: string[] | string | null;
  highlight?: string;
};

export function MidSummaryBox({
  title = '바쁜 부모님을 위한 30초 요약',
  points,
  items,
  highlight,
}: MidSummaryBoxProps) {
  const list = toStringArray(points ?? items);
  if (list.length === 0 && !highlight) return null;

  return (
    <aside
      className="my-12 overflow-hidden rounded-md border border-[var(--card-border)] bg-[var(--surface-2)] px-6 py-8 shadow-[var(--shadow-card)] sm:px-8 sm:py-10"
      aria-label="30초 요약"
    >
      <h3 className="app-mdx-title mb-6 flex items-center gap-2 text-left text-lg sm:text-xl">
        <span className="text-xl leading-none text-[var(--warning)]" aria-hidden>
          ⚡
        </span>
        <span>{title}</span>
      </h3>

      {list.length > 0 && (
        <ul className="mb-8 list-none space-y-4 p-0">
          {list.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-base font-semibold text-[var(--accent)]" aria-hidden>
                ✓
              </span>
              <span className="app-mdx-body text-[15px] leading-7 sm:text-[16px] sm:leading-8">{point}</span>
            </li>
          ))}
        </ul>
      )}

      {highlight && highlight.trim() !== '' && (
        <div className="rounded-md border border-[var(--card-border)] bg-[var(--surface-1)] px-4 py-4 text-center text-[15px] font-medium leading-relaxed text-[var(--fg)] sm:py-5 sm:text-[16px]">
          {highlight}
        </div>
      )}
    </aside>
  );
}
