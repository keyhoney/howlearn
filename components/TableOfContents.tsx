"use client";

import Link from "next/link";
import type { HeadingItem } from "@/lib/headings";

type TableOfContentsProps = {
  headings: HeadingItem[];
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) return null;

  return (
    <nav className="hidden lg:block" aria-label="목차">
      <div className="sticky top-24">
        <h2 className="mb-3 border-b border-[var(--border)]/60 pb-2 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
          목차
        </h2>
        <ul className="mt-2 space-y-1.5 border-l border-[var(--border)]/80 pl-4">
          {headings.map((h) => (
            <li key={h.id} className={h.level === 3 ? "pl-2" : ""}>
              <Link
                href={`#${h.id}`}
                className="block text-sm text-[var(--muted)] no-underline transition hover:text-foreground"
              >
                {h.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
