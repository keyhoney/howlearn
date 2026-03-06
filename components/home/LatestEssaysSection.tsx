import Link from "next/link";
import { ContentCard } from "@/components/ContentCard";

export type EssayItem = {
  slug: string;
  title: string;
  description: string;
  href: string;
  date?: string;
  readingTimeMinutes?: number;
};

type LatestEssaysSectionProps = {
  essays: EssayItem[];
};

export function LatestEssaysSection({ essays }: LatestEssaysSectionProps) {
  return (
    <section className="py-20">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">LATEST ESSAYS</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
        문제 상황에서 시작하는 글
      </h2>
      <p className="mt-3 max-w-2xl text-[15.5px] leading-7 text-[var(--muted)]">
        부모가 실제로 마주하는 질문에서 출발해, 심리와 학습과학의 언어로 다시 설명합니다.
      </p>
      {essays.length > 0 ? (
        <>
          <ul className="mt-10 space-y-4">
            {essays.map((post) => (
              <li key={post.slug}>
                <ContentCard
                  type="blog"
                  title={post.title}
                  href={post.href}
                  description={post.description || undefined}
                  date={post.date}
                  readingTimeMinutes={post.readingTimeMinutes}
                  categories={[]}
                  tags={[]}
                />
              </li>
            ))}
          </ul>
          <Link
            href="/blog"
            className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-500)] no-underline hover:underline hover:underline-offset-2"
          >
            블로그 전체 보기
            <span aria-hidden>→</span>
          </Link>
        </>
      ) : (
        <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-6 py-12 text-center">
          <p className="text-[var(--muted)]">등록된 글이 없습니다.</p>
          <Link href="/blog" className="mt-2 inline-block text-sm font-medium text-[var(--brand-500)] no-underline hover:underline">
            블로그
          </Link>
        </div>
      )}
    </section>
  );
}
