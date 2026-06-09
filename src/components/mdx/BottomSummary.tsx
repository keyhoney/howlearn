import { toStringArray } from '@/lib/mdx-props';

type BottomSummaryProps = {
  title?: string;
  points?: string[] | string | null;
  items?: string[] | string | null;
};

export function BottomSummary({ title = '한눈에 정리하면', points, items }: BottomSummaryProps) {
  const list = toStringArray(points ?? items);
  if (list.length === 0) return null;

  return (
    <aside
      className="app-mdx-card-muted my-12 p-8"
      aria-label="한눈에 정리"
    >
      <h3 className="app-mdx-title mb-6 text-center text-xl">{title}</h3>
      <div className="mx-auto max-w-xl">
        <ul className="space-y-4">
          {list.map((point, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 rounded-md border border-[var(--card-border)] bg-[var(--surface-1)] p-4"
            >
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--card-border)] bg-[var(--surface-2)] text-sm font-bold text-[var(--accent)]">
                {idx + 1}
              </div>
              <span className="app-mdx-body font-medium">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
