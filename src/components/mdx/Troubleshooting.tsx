import { toTroubleshootingItemsArray } from '@/lib/mdx-props';

type TroubleshootingProps = { items?: Parameters<typeof toTroubleshootingItemsArray>[0] };

export function Troubleshooting({ items }: TroubleshootingProps) {
  const list = toTroubleshootingItemsArray(items);
  if (list.length === 0) return null;
  return (
    <aside
      className="app-mdx-card-muted my-8 p-5 md:p-6"
      aria-label="자주 막히는 문제"
    >
      <p className="app-mdx-kicker">자주 막히는 문제</p>
      <ul className="mt-3 space-y-4">
        {list.map((item, i) => (
          <li
            key={i}
            className="border-b border-[var(--card-border)] pb-4 last:border-0 last:pb-0"
          >
            <p className="app-mdx-title font-medium">{item.problem}</p>
            <p className="app-mdx-body mt-1 text-sm">→ {item.solution}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
