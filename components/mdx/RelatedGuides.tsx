import Link from "next/link";
import { fullPath } from "@/lib/content-path";

type RelatedGuidesProps = {
  slugs: string[];
};

export function RelatedGuides({ slugs }: RelatedGuidesProps) {
  if (!slugs?.length) return null;

  return (
    <aside className="my-8 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/80 p-5 md:p-6" aria-label="관련 가이드">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">관련 가이드</p>
      <ul className="mt-3 space-y-1.5">
        {slugs.map((slug) => (
          <li key={slug}>
            <Link
              href={fullPath("guides", slug)}
              className="font-medium text-[var(--brand-500)] no-underline hover:underline hover:underline-offset-2"
            >
              {slug.replace(/-/g, " ")} →
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
