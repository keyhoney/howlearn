import Link from "next/link";
import { fullPath } from "@/lib/content-path";

type RelatedConceptsProps = {
  slugs: string[];
};

export function RelatedConcepts({ slugs }: RelatedConceptsProps) {
  if (!slugs?.length) return null;

  return (
    <aside className="my-8 rounded-xl border border-[var(--border)] bg-[var(--inset)]/40 p-5 md:p-6" aria-label="관련 개념">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">관련 개념</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {slugs.map((slug) => (
          <li key={slug}>
            <Link
              href={fullPath("concepts", slug)}
              className="rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--ink)] no-underline transition hover:border-[var(--brand-500)] hover:text-[var(--brand-500)]"
            >
              {slug.replace(/-/g, " ")}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
