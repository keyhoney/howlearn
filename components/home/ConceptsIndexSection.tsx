import Link from "next/link";
import { fullPath } from "@/lib/content-path";

export type ConceptItem = {
  slug: string;
  title: string;
  description: string;
};

type ConceptsIndexSectionProps = {
  concepts: ConceptItem[];
};

export function ConceptsIndexSection({ concepts }: ConceptsIndexSectionProps) {
  return (
    <section className="py-12 sm:py-16 md:py-20">
      <p className="section-label">CONCEPTS INDEX</p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
        학습과학 용어를 짧고 정확하게
      </h2>
      <p className="mt-2 sm:mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-[15.5px]">
        복잡한 용어를 과장 없이 정리하고, 학부모의 언어로 다시 설명합니다.
      </p>
      {concepts.length > 0 ? (
        <>
          <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {concepts.map((c) => (
              <Link
                key={c.slug}
                href={fullPath("concepts", c.slug)}
                className="block card-elevated rounded-xl border border-[var(--border)] bg-white p-4 sm:p-5 min-h-[44px] flex flex-col justify-center sm:min-h-0"
              >
                <p className="font-semibold text-foreground" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
                  {c.title}
                </p>
                {c.description && (
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                    {c.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
          <Link
            href="/concepts"
            className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-500)] no-underline hover:underline hover:underline-offset-2"
          >
            개념 사전 전체 보기
            <span aria-hidden>→</span>
          </Link>
        </>
      ) : (
        <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-6 py-12 text-center">
          <p className="text-[var(--muted)]">등록된 개념이 없습니다.</p>
          <Link href="/concepts" className="mt-2 inline-block text-sm font-medium text-[var(--brand-500)] no-underline hover:underline">
            개념 사전
          </Link>
        </div>
      )}
    </section>
  );
}
