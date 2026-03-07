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
    <nav aria-label="Table of contents">
      <div className="sticky top-24">
        <h2 className="mb-3 border-b border-slate-200 dark:border-slate-700 pb-2 text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Contents
        </h2>
        <ul className="mt-2 space-y-1.5 border-l border-slate-200 dark:border-slate-700 pl-4">
          {headings.map((h) => (
            <li key={h.id} className={h.level === 3 ? "pl-2" : ""}>
              <Link
                href={`#${h.id}`}
                className={`block text-sm transition hover:text-slate-900 dark:hover:text-slate-100 ${
                  activeId === h.id
                    ? "font-medium text-slate-900 dark:text-slate-100"
                    : "text-slate-500 dark:text-slate-400"
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
