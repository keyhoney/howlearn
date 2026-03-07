type TroubleshootingItem = { problem: string; solution: string };

type TroubleshootingProps = { items: TroubleshootingItem[] };

export function Troubleshooting({ items }: TroubleshootingProps) {
  if (!items?.length) return null;
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 bg-slate-50 p-5 md:p-6"
      aria-label="Troubleshooting"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Common issues
      </p>
      <ul className="mt-3 space-y-4">
        {items.map((item, i) => (
          <li
            key={i}
            className="border-b border-slate-200 pb-4 last:border-0 last:pb-0"
          >
            <p className="font-medium text-slate-900">{item.problem}</p>
            <p className="mt-1 text-sm text-slate-500">→ {item.solution}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
