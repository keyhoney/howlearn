import Link from "next/link";
import type { ContentType } from "@/lib/content";

const PILLAR_STRIP: Record<ContentType, string> = {
  guides: "var(--pillar-guides)",
  concepts: "var(--pillar-concepts)",
  toolkit: "var(--pillar-toolkit)",
  blog: "var(--pillar-blog)",
  books: "var(--pillar-books)",
};

export type KnowledgeMapCard = {
  type: ContentType;
  title: string;
  description: string;
  href: string;
  examples: { title: string; href: string }[];
  count: number;
  metaLabel: string;
};

type KnowledgeMapSectionProps = {
  cards: KnowledgeMapCard[];
};

export function KnowledgeMapSection({ cards }: KnowledgeMapSectionProps) {
  const guidesCard = cards.find((c) => c.type === "guides");
  const conceptsCard = cards.find((c) => c.type === "concepts");
  const toolkitCard = cards.find((c) => c.type === "toolkit");
  const blogCard = cards.find((c) => c.type === "blog");
  const booksCard = cards.find((c) => c.type === "books");

  const cardClass = "rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:shadow-[0_1px_0_0_var(--border)]";
  const linkClass = "text-sm font-medium text-[var(--brand-500)] no-underline hover:underline hover:underline-offset-2";

  return (
    <section className="py-20">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">KNOWLEDGE MAP</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
        어디서부터 읽어야 할지 한눈에 보이도록
      </h2>
      <p className="mt-3 max-w-2xl text-[15.5px] leading-7 text-[var(--muted)]">
        핵심 가이드부터 개념 사전, 실천 툴킷, 최신 글, 전자책까지 필요한 깊이와 목적에 따라 탐색할 수 있습니다.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-12">
        {guidesCard && (
          <div
            className={`group flex flex-col p-8 lg:col-span-5 ${cardClass}`}
            style={{ borderLeftWidth: "4px", borderLeftColor: PILLAR_STRIP.guides }}
          >
            <Link href={guidesCard.href} className="no-underline">
              <h3 className="text-2xl font-semibold text-foreground group-hover:text-[var(--brand-500)]" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
                {guidesCard.title}
              </h3>
            </Link>
            <p className="mt-1 text-sm text-[var(--muted)]">{guidesCard.description}</p>
            {guidesCard.examples.length > 0 && (
              <ul className="mt-4 space-y-1">
                {guidesCard.examples.map((ex) => (
                  <li key={ex.href}>
                    <Link href={ex.href} className={linkClass}>
                      {ex.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 text-xs text-[var(--muted)]">{guidesCard.metaLabel}</p>
          </div>
        )}
        <div className="flex flex-col gap-5 lg:col-span-7">
          <div className="grid gap-5 sm:grid-cols-2">
            {conceptsCard && (
              <div
                className={`group flex flex-col p-5 ${cardClass}`}
                style={{ borderLeftWidth: "3px", borderLeftColor: PILLAR_STRIP.concepts }}
              >
                <Link href={conceptsCard.href} className="no-underline">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-[var(--brand-500)]" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
                    {conceptsCard.title}
                  </h3>
                </Link>
                <p className="mt-1 text-sm text-[var(--muted)]">{conceptsCard.description}</p>
                {conceptsCard.examples.length > 0 && (
                  <ul className="mt-3 space-y-0.5">
                    {conceptsCard.examples.map((ex) => (
                      <li key={ex.href}>
                        <Link href={ex.href} className={linkClass}>
                          {ex.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 text-xs text-[var(--muted)]">{conceptsCard.metaLabel}</p>
              </div>
            )}
            {toolkitCard && (
              <div
                className={`group flex flex-col p-5 ${cardClass}`}
                style={{ borderLeftWidth: "3px", borderLeftColor: PILLAR_STRIP.toolkit }}
              >
                <Link href={toolkitCard.href} className="no-underline">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-[var(--brand-500)]" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
                    {toolkitCard.title}
                  </h3>
                </Link>
                <p className="mt-1 text-sm text-[var(--muted)]">{toolkitCard.description}</p>
                {toolkitCard.examples.length > 0 && (
                  <ul className="mt-3 space-y-0.5">
                    {toolkitCard.examples.map((ex) => (
                      <li key={ex.href}>
                        <Link href={ex.href} className={linkClass}>
                          {ex.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 text-xs text-[var(--muted)]">{toolkitCard.metaLabel}</p>
              </div>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {blogCard && (
              <Link
                href={blogCard.href}
                className={`group flex flex-col rounded-xl p-4 ${cardClass}`}
                style={{ borderLeftWidth: "2px", borderLeftColor: PILLAR_STRIP.blog }}
              >
                <h3 className="text-base font-semibold text-foreground group-hover:text-[var(--brand-500)]">{blogCard.title}</h3>
                <p className="mt-0.5 text-xs text-[var(--muted)]">{blogCard.description}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">{blogCard.metaLabel}</p>
              </Link>
            )}
            {booksCard && (
              <Link
                href={booksCard.href}
                className={`group flex flex-col rounded-xl p-4 ${cardClass}`}
                style={{ borderLeftWidth: "2px", borderLeftColor: PILLAR_STRIP.books }}
              >
                <h3 className="text-base font-semibold text-foreground group-hover:text-[var(--brand-500)]">{booksCard.title}</h3>
                <p className="mt-0.5 text-xs text-[var(--muted)]">{booksCard.description}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">{booksCard.metaLabel}</p>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
