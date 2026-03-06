type TroubleshootingItem = {
  problem: string;
  solution: string;
};

type TroubleshootingProps = {
  items: TroubleshootingItem[];
};

export function Troubleshooting({ items }: TroubleshootingProps) {
  if (!items?.length) return null;

  return (
    <aside
      className="my-8 rounded-xl border border-[var(--border)] bg-[var(--inset)] p-5 md:p-6"
      aria-label="자주 막히는 문제"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">자주 막히는 문제</p>
      <ul className="mt-3 space-y-4">
        {items.map((item, i) => (
          <li key={i} className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
            <p className="font-medium text-[var(--ink)]">{item.problem}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">→ {item.solution}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
