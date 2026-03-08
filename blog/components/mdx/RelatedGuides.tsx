import Link from "next/link";
import { toStringArray } from "@/lib/mdx-props";

type RelatedGuidesProps = { slugs?: string[] | string | null };

export function RelatedGuides({ slugs }: RelatedGuidesProps) {
  const list = toStringArray(slugs);
  if (list.length === 0) return null;
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/80 dark:bg-slate-800/80 p-5 md:p-6"
      aria-label="Related guides"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Related guides
      </p>
      <ul className="mt-3 space-y-1.5">
        {list.map((slug) => (
          <li key={slug}>
            <Link
              href={`/guides/${slug}`}
              className="font-medium text-indigo-600 dark:text-indigo-400 no-underline hover:underline hover:underline-offset-2"
            >
              {slug.replace(/-/g, " ")} →
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
