import { toStringArray } from '@/lib/mdx-props';

type RelatedConceptsProps = { slugs?: string[] | string | null };

export function RelatedConcepts({ slugs }: RelatedConceptsProps) {
  const list = toStringArray(slugs);
  if (list.length === 0) return null;
  return (
    <aside
      className="app-mdx-card-muted my-8 p-5 md:p-6"
      aria-label="관련 개념"
    >
      <p className="app-mdx-kicker">관련 개념</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {list.map((slug) => (
          <li key={slug} id={`concept-${slug}`} className="scroll-mt-24">
            <a
              href={`/concepts/${slug}`}
              className="hl-concept-link inline-flex items-center rounded-full border border-[var(--card-border)] bg-[var(--surface-1)] px-3 py-1.5 text-sm font-medium text-[var(--fg)] no-underline transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {slug.replace(/-/g, ' ')}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
