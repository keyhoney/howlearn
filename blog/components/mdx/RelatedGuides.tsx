import Link from "next/link";

type RelatedGuidesProps = { slugs: string[] };

export function RelatedGuides({ slugs }: RelatedGuidesProps) {
  if (!slugs?.length) return null;
  return (
    <aside
      className="my-8 rounded-xl border border-slate-200 bg-slate-50/80 p-5 md:p-6"
      aria-label="Related guides"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Related guides
      </p>
      <ul className="mt-3 space-y-1.5">
        {slugs.map((slug) => (
          <li key={slug}>
            <Link
              href={`/guides/${slug}`}
              className="font-medium text-indigo-600 no-underline hover:underline hover:underline-offset-2"
            >
              {slug.replace(/-/g, " ")} →
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
