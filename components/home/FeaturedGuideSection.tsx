import Link from "next/link";

export type FeaturedGuideItem = {
  slug: string;
  title: string;
  description: string;
  href: string;
  readingTimeMinutes: number;
  conceptTags?: string[];
};

type FeaturedGuideSectionProps = {
  featured: FeaturedGuideItem | null;
  others: FeaturedGuideItem[];
};

export function FeaturedGuideSection({ featured, others }: FeaturedGuideSectionProps) {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[var(--surface-2)]/40">
      <p className="section-label">FEATURED GUIDE</p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
        가장 먼저 읽어볼 핵심 문서
      </h2>
      <p className="mt-2 sm:mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-[15.5px]">
        이 사이트의 문제의식과 설명 방식을 가장 잘 보여주는 대표 가이드입니다.
      </p>
      <div className="mt-8 grid gap-6 sm:mt-10 sm:gap-8 lg:grid-cols-[1.2fr,1fr]">
        <div>
          {featured ? (
            <Link
              href={featured.href}
              className="group block card-elevated rounded-xl border border-[var(--border)] bg-white p-5 sm:p-6 md:p-8"
              style={{ borderLeftWidth: "4px", borderLeftColor: "var(--pillar-guides)" }}
            >
              <span className="rounded-full bg-[var(--warm)]/15 px-2.5 py-0.5 text-xs font-medium text-[var(--warm)]">인지심리학 기반</span>
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">대표 가이드</span>
              <h3 className="mt-2 text-xl font-semibold text-foreground group-hover:text-[var(--brand-500)] sm:text-2xl md:text-[1.75rem]" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
                {featured.title}
              </h3>
              {featured.description && (
                <p className="mt-3 max-w-2xl text-[15.5px] leading-7 text-[var(--muted)]">
                  {featured.description}
                </p>
              )}
              <p className="mt-2 text-sm text-[var(--muted)]">
                수포자의 원인을 심리·인지 관점에서 구조적으로 설명합니다.
              </p>
              {featured.conceptTags && featured.conceptTags.length > 0 && (
                <p className="mt-4 text-xs text-[var(--muted)]">
                  <span className="font-medium text-foreground">관련 개념 </span>
                  {featured.conceptTags.slice(0, 3).join(" · ")}
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {featured.readingTimeMinutes > 0 && (
                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-medium text-[var(--muted)]">
                    {featured.readingTimeMinutes}분 읽기
                  </span>
                )}
                <span className="text-sm font-medium text-[var(--brand-500)] group-hover:underline">
                  가이드 읽기 →
                </span>
              </div>
            </Link>
          ) : (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-6 py-12 text-center">
              <p className="text-[var(--muted)]">등록된 가이드가 없습니다.</p>
            </div>
          )}
        </div>
        <div className="space-y-3">
          {others.slice(0, 4).map((g) => (
            <Link
              key={g.slug}
              href={g.href}
              className="group flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-white px-4 py-3 min-h-[48px] transition hover:border-[var(--border-strong)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:min-h-0 sm:px-5"
            >
              <h4 className="font-semibold text-foreground group-hover:text-[var(--brand-500)] text-base" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
                {g.title}
              </h4>
              {g.readingTimeMinutes > 0 && (
                <span className="text-sm text-[var(--muted)]">{g.readingTimeMinutes}분</span>
              )}
            </Link>
          ))}
        </div>
      </div>
      <Link
        href="/guides"
        className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-500)] no-underline hover:underline hover:underline-offset-2"
      >
        가이드 전체 보기
        <span aria-hidden>→</span>
      </Link>
    </section>
  );
}
