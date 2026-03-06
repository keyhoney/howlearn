type ReferenceItem = {
  title?: string;
  url: string;
};

type ReferenceCardProps = {
  items: ReferenceItem[];
};

export function ReferenceCard({ items }: ReferenceCardProps) {
  if (!items || items.length === 0) return null;

  return (
    <aside id="references" className="mt-14 border-t-2 border-[var(--border)] pt-10 scroll-mt-24">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">부록</p>
      <h2 className="mb-4 text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
        참고 문헌
      </h2>
      <ul className="mt-4 space-y-2">
        {items.map((item, i) => (
          <li key={i}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-[var(--border)]/80 bg-[var(--surface-2)] px-4 py-3 text-sm text-foreground no-underline transition hover:border-[var(--border-strong)] hover:bg-[var(--inset)]/40"
            >
              {item.title || item.url}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
