import Link from "next/link";

type RelatedConceptsProps = { slugs: string[] };

export function RelatedConcepts({ slugs }: RelatedConceptsProps) {
  if (!slugs?.length) return null;
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 p-5 md:p-6"
      aria-label="Related concepts"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Related concepts
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {slugs.map((slug) => (
          <li key={slug}>
            <Link
              href={`/concepts/${slug}`}
              className="rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-sm font-medium text-slate-900 dark:text-slate-100 no-underline transition hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {slug.replace(/-/g, " ")}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
