import Link from "next/link";
import { LEARNING_SCIENCE_DOMAINS } from "@/lib/learning-science-domains";

type DomainsStripProps = {
  getCount: (label: string) => number;
};

export function DomainsStrip({ getCount }: DomainsStripProps) {
  return (
    <section className="py-10">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--muted)]">
        <span className="font-medium text-foreground">주제별:</span>
        {LEARNING_SCIENCE_DOMAINS.map((domain, i) => {
          const count = getCount(domain.label);
          return (
            <span key={domain.id}>
              <Link
                href={`/c/${encodeURIComponent(domain.label)}`}
                className="text-foreground no-underline hover:text-[var(--brand-500)] hover:underline"
              >
                {domain.label}
              </Link>
              {count > 0 && <span className="text-[var(--muted)]"> ({count})</span>}
              {i < LEARNING_SCIENCE_DOMAINS.length - 1 && <span className="mx-1.5 text-[var(--border)]">·</span>}
            </span>
          );
        })}
        <Link
          href="/domains"
          className="ml-1 font-medium text-[var(--brand-500)] no-underline hover:underline"
        >
          전체 보기 →
        </Link>
      </div>
    </section>
  );
}
