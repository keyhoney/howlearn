import { toSourceItemsArray } from '@/lib/mdx-props';

function doiUrl(doi: string): string {
  const clean = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').trim();
  return `https://doi.org/${clean}`;
}

type SourcesProps = {
  items?: Parameters<typeof toSourceItemsArray>[0];
  title?: string;
};

export function Sources({ items, title = '참고 문헌' }: SourcesProps) {
  const list = toSourceItemsArray(items);
  if (list.length === 0) return null;

  return (
    <aside
      className="app-mdx-card-muted my-8 p-5 md:p-6"
      aria-label={title}
    >
      <p className="app-mdx-kicker">{title}</p>
      <ul className="mt-3 list-none space-y-3 pl-0">
        {list.map((item, i) => {
          const href = item.href || (item.doi ? doiUrl(item.doi) : undefined);
          const text = (
            <>
              {item.author}
              {item.year ? ` (${item.year}). ` : '. '}
              <em className="not-italic font-medium">{item.title}</em>.
              {item.source ? ` ${item.source}.` : ''}
            </>
          );
          return (
            <li key={i} className="app-mdx-body text-sm leading-relaxed">
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] underline underline-offset-2 hover:brightness-90"
                >
                  {text}
                </a>
              ) : (
                <span>{text}</span>
              )}
              {item.note && (
                <span className="mt-0.5 block text-[var(--fg-muted)]">
                  {item.note}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
