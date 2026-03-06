"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { HeadingItem } from "@/lib/headings";

type TableOfContentsProps = {
  headings: HeadingItem[];
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;
    const ids = headings.map((h) => h.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0% -70% 0%", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

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
                className={`block text-sm no-underline transition hover:text-foreground ${
                  activeId === h.id
                    ? "font-medium text-foreground"
                    : "text-[var(--muted)]"
                }`}
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
