import { getAllByType, getBySlug, getArchiveByCategory } from "@/lib/content";
import { fullPath } from "@/lib/content-path";
import { LEARNING_SCIENCE_DOMAINS } from "@/lib/learning-science-domains";
import { getReadingTimeMinutes } from "@/lib/reading-time";
import { ContentCard } from "@/components/ContentCard";
import { SectionHeader } from "@/components/SectionHeader";
import Link from "next/link";
import type { ContentType } from "@/lib/content";

const TRUST_ITEMS = [
  "전자책 2권 출간",
  "근거 기반 설명",
  "학부모 적용 템플릿 제공",
  "가이드 · 개념 사전 · 툴킷 구조",
];

const PILLAR_STRIP: Record<ContentType, string> = {
  guides: "var(--pillar-guides)",
  concepts: "var(--pillar-concepts)",
  toolkit: "var(--pillar-toolkit)",
  blog: "var(--pillar-blog)",
  books: "var(--pillar-books)",
};

const CATEGORY_CONFIG: {
  type: ContentType;
  title: string;
  description: string;
  href: string;
}[] = [
  { type: "guides", title: "가이드", description: "핵심 가이드 · 깊이 있는 문서", href: "/guides" },
  { type: "concepts", title: "개념 사전", description: "학습과학 용어·이론", href: "/concepts" },
  { type: "toolkit", title: "툴킷", description: "체크리스트·루틴·템플릿", href: "/toolkit" },
  { type: "blog", title: "블로그", description: "최신 글·에세이", href: "/blog" },
  { type: "books", title: "전자책", description: "출간 목록", href: "/books" },
];

export default function Home() {
  const guidesRaw = getAllByType("guides");
  const conceptsRaw = getAllByType("concepts").slice(0, 8);
  const blogRaw = getAllByType("blog").slice(0, 6);
  const toolkitRaw = getAllByType("toolkit");
  const booksRaw = getAllByType("books");

  const featuredGuides = guidesRaw.slice(0, 6).map(({ slug, frontmatter }) => {
    const { content } = getBySlug("guides", slug);
    return {
      slug,
      title: (frontmatter.title as string) || slug,
      description: (frontmatter.description as string) || "",
      href: fullPath("guides", slug),
      readingTimeMinutes: getReadingTimeMinutes(content),
    };
  });

  const categoryExamples = CATEGORY_CONFIG.map((c) => {
    const list =
      c.type === "guides"
        ? guidesRaw
        : c.type === "concepts"
          ? getAllByType("concepts")
          : c.type === "toolkit"
            ? toolkitRaw
            : c.type === "blog"
              ? getAllByType("blog")
              : booksRaw;
    const two = list.slice(0, 2).map(({ slug, frontmatter }) => ({
      slug,
      title: (frontmatter.title as string) || slug,
      href: fullPath(c.type, slug),
    }));
    const count = list.length;
    return { ...c, examples: two, count };
  });

  const latestBlog = blogRaw.map(({ slug, frontmatter }) => ({
    slug,
    title: (frontmatter.title as string) || slug,
    description: (frontmatter.description as string) || "",
    href: fullPath("blog", slug),
  }));

  const guidesCat = categoryExamples.find((c) => c.type === "guides");
  const conceptsCat = categoryExamples.find((c) => c.type === "concepts");
  const toolkitCat = categoryExamples.find((c) => c.type === "toolkit");
  const blogCat = categoryExamples.find((c) => c.type === "blog");
  const booksCat = categoryExamples.find((c) => c.type === "books");

  return (
    <div className="px-6 py-16">
      <main className="mx-auto max-w-6xl space-y-24">
        {/* A) Hero: 2열 비대칭 — 좌측 H1·설명·CTA, 우측 신뢰 패널 */}
        <section className="relative">
          <div
            className="pointer-events-none absolute -top-10 left-0 right-0 h-48 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,var(--brand-500)_0%,transparent_60%)] opacity-[0.06]"
            aria-hidden
          />
          <div className="relative grid gap-12 md:grid-cols-[1fr,minmax(280px,340px)] md:items-start">
            <div>
              <h1
                className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-[2.5rem]"
                style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}
              >
                학습과학 기반 부모 교육
              </h1>
              <p className="mt-4 max-w-xl text-[15.5px] leading-7 text-[var(--muted)] md:text-[17px] md:leading-8">
                인지심리·뇌과학 연구를 바탕으로, 아이가 공부를 포기하는 이유와 가정에서의 적용법을 제공합니다.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/guides"
                  className="rounded-xl bg-[var(--brand-500)] px-6 py-3 text-sm font-medium text-white no-underline shadow-sm transition hover:bg-[var(--brand-600)]"
                >
                  가이드 보기
                </Link>
                <Link
                  href="/concepts"
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-medium text-foreground no-underline transition hover:border-[var(--border-strong)]"
                >
                  개념 사전
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-featured)] p-6 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                브랜드 소개
              </p>
              <ul className="mt-4 space-y-3">
                {TRUST_ITEMS.map((label) => (
                  <li key={label} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--brand-500)]" aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* B) 학습과학 5가지 영역 — 주제별 진입 */}
        <section>
          <SectionHeader
            eyebrow="학습과학"
            title="5가지 영역"
            description="인지심리학, 신경과학(뇌과학), 교육심리학, 발달심리학, 동기·정서심리학으로 나누어 탐색할 수 있습니다."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEARNING_SCIENCE_DOMAINS.map((domain) => {
              const count = getArchiveByCategory(domain.label).length;
              return (
                <Link
                  key={domain.id}
                  href={`/c/${encodeURIComponent(domain.label)}`}
                  className="group block rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
                >
                  <h2 className="font-semibold text-foreground group-hover:text-[var(--brand-500)]" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
                    {domain.label}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">{domain.description}</p>
                  {count > 0 && (
                    <p className="mt-3 text-xs text-[var(--muted)]">{count}개 글</p>
                  )}
                </Link>
              );
            })}
          </div>
          <Link
            href="/domains"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-500)] no-underline hover:underline hover:underline-offset-2"
          >
            주제별 보기
            <span aria-hidden>→</span>
          </Link>
        </section>

        {/* C) 카테고리: 에디토리얼 위계 — Guides 크게, Concepts/Toolkit 중간, Blog/Books 작게 */}
        <section>
          <SectionHeader
            eyebrow="카테고리"
            title="콘텐츠 탐색"
            description="가이드, 개념 사전, 툴킷, 블로그, 전자책을 한눈에."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-12">
            {guidesCat && (
              <Link
                href={guidesCat.href}
                className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-6 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface)] lg:col-span-5"
                style={{ borderLeftWidth: "3px", borderLeftColor: PILLAR_STRIP.guides }}
              >
                <h2 className="text-xl font-semibold text-foreground group-hover:text-[var(--brand-500)]" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
                  {guidesCat.title}
                </h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{guidesCat.description}</p>
                {guidesCat.examples.length > 0 && (
                  <ul className="mt-4 space-y-1">
                    {guidesCat.examples.map((ex) => (
                      <li key={ex.slug}>
                        <span className="text-sm font-medium text-[var(--brand-500)]">{ex.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-4 text-xs text-[var(--muted)]">{guidesCat.count}개 가이드</p>
              </Link>
            )}
            <div className="flex flex-col gap-5 lg:col-span-7">
              <div className="grid gap-5 sm:grid-cols-2">
                {conceptsCat && (
                  <Link
                    href={conceptsCat.href}
                    className="group rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
                    style={{ borderLeftWidth: "2px", borderLeftColor: PILLAR_STRIP.concepts }}
                  >
                    <h2 className="font-semibold text-foreground group-hover:text-[var(--brand-500)]" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
                      {conceptsCat.title}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">{conceptsCat.description}</p>
                    {conceptsCat.examples.length > 0 && (
                      <ul className="mt-3 space-y-0.5">
                        {conceptsCat.examples.map((ex) => (
                          <li key={ex.slug} className="text-sm text-[var(--brand-500)]">{ex.title}</li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-2 text-xs text-[var(--muted)]">개념 {conceptsCat.count}개</p>
                  </Link>
                )}
                {toolkitCat && (
                  <Link
                    href={toolkitCat.href}
                    className="group rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
                    style={{ borderLeftWidth: "2px", borderLeftColor: PILLAR_STRIP.toolkit }}
                  >
                    <h2 className="font-semibold text-foreground group-hover:text-[var(--brand-500)]" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
                      {toolkitCat.title}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">{toolkitCat.description}</p>
                    {toolkitCat.examples.length > 0 && (
                      <ul className="mt-3 space-y-0.5">
                        {toolkitCat.examples.map((ex) => (
                          <li key={ex.slug} className="text-sm text-[var(--brand-500)]">{ex.title}</li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-2 text-xs text-[var(--muted)]">템플릿 {toolkitCat.count}개</p>
                  </Link>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {blogCat && (
                  <Link
                    href={blogCat.href}
                    className="group rounded-xl border border-[var(--border)]/80 bg-[var(--surface-2)] p-4 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
                    style={{ borderLeftWidth: "2px", borderLeftColor: PILLAR_STRIP.blog }}
                  >
                    <h2 className="font-semibold text-foreground group-hover:text-[var(--brand-500)] text-base">{blogCat.title}</h2>
                    <p className="mt-0.5 text-xs text-[var(--muted)]">{blogCat.description}</p>
                    <p className="mt-2 text-xs text-[var(--muted)]">글 {blogCat.count}개</p>
                  </Link>
                )}
                {booksCat && (
                  <Link
                    href={booksCat.href}
                    className="group rounded-xl border border-[var(--border)]/80 bg-[var(--surface-2)] p-4 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
                    style={{ borderLeftWidth: "2px", borderLeftColor: PILLAR_STRIP.books }}
                  >
                    <h2 className="font-semibold text-foreground group-hover:text-[var(--brand-500)] text-base">{booksCat.title}</h2>
                    <p className="mt-0.5 text-xs text-[var(--muted)]">{booksCat.description}</p>
                    <p className="mt-2 text-xs text-[var(--muted)]">전자책 {booksCat.count}권</p>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* C) Featured Guides: 첫 번째 대형 패널, 나머지 작은 리스트 */}
        <section>
          <SectionHeader
            eyebrow="대표 가이드"
            title="핵심 문서"
            description="주제별 깊이 있는 가이드입니다."
          />
          {featuredGuides.length > 0 ? (
            <div className="space-y-4">
              <Link
                href={featuredGuides[0].href}
                className="group block rounded-2xl border border-[var(--border)] bg-[var(--surface-featured)] p-8 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]"
                style={{ borderLeftWidth: "4px", borderLeftColor: PILLAR_STRIP.guides }}
              >
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">가이드</span>
                <h3 className="mt-2 text-2xl font-semibold text-foreground group-hover:text-[var(--brand-500)]" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
                  {featuredGuides[0].title}
                </h3>
                {featuredGuides[0].description && (
                  <p className="mt-3 max-w-2xl text-[15.5px] leading-7 text-[var(--muted)]">
                    {featuredGuides[0].description}
                  </p>
                )}
                <p className="mt-4 text-sm text-[var(--muted)]">
                  {featuredGuides[0].readingTimeMinutes > 0 ? `${featuredGuides[0].readingTimeMinutes}분 읽기` : "읽기"}
                </p>
              </Link>
              {featuredGuides.length > 1 && (
                <ul className="space-y-3">
                  {featuredGuides.slice(1).map((g) => (
                    <li key={g.slug}>
                      <Link
                        href={g.href}
                        className="group flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-[var(--border)]/80 bg-[var(--surface-2)] px-5 py-3 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
                      >
                        <h4 className="font-semibold text-foreground group-hover:text-[var(--brand-500)] text-base" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
                          {g.title}
                        </h4>
                        {g.readingTimeMinutes > 0 && (
                          <span className="text-sm text-[var(--muted)]">{g.readingTimeMinutes}분</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href="/guides"
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-500)] no-underline hover:underline hover:underline-offset-2"
              >
                가이드 전체 보기
                <span aria-hidden>→</span>
              </Link>
            </div>
          ) : (
            <p className="text-[var(--muted)]">등록된 가이드가 없습니다.</p>
          )}
        </section>

        {/* D) 개념 사전: 용어 사전 인덱스 — 2~3열 미니 카드, 용어 + 짧은 정의 */}
        <section>
          <SectionHeader
            eyebrow="개념 사전"
            title="학습과학 용어"
            description="용어·이론을 짧게 정리했습니다."
          />
          {conceptsRaw.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {conceptsRaw.map(({ slug, frontmatter }) => (
                <Link
                  key={slug}
                  href={fullPath("concepts", slug)}
                  className="block rounded-xl border border-[var(--border)] bg-[var(--inset)]/40 p-4 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]"
                >
                  <p className="font-semibold text-foreground" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
                    {(frontmatter.title as string) || slug}
                  </p>
                  {(frontmatter.description as string) && (
                    <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
                      {(frontmatter.description as string)}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-[var(--muted)]">등록된 개념이 없습니다.</p>
          )}
          <Link
            href="/concepts"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-500)] no-underline hover:underline hover:underline-offset-2"
          >
            개념 사전 전체 보기
            <span aria-hidden>→</span>
          </Link>
        </section>

        {/* E) Latest Blog: 가장 가벼운 에디토리얼 리스트 */}
        <section>
          <SectionHeader
            title="최신 블로그"
            description="최신 글과 에세이."
          />
          {latestBlog.length > 0 ? (
            <ul className="space-y-4">
              {latestBlog.map((post) => (
                <li key={post.slug}>
                  <ContentCard
                    type="blog"
                    title={post.title}
                    href={post.href}
                    description={post.description || undefined}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--muted)]">등록된 글이 없습니다.</p>
          )}
          <Link
            href="/blog"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-500)] no-underline hover:underline hover:underline-offset-2"
          >
            블로그 전체 보기
            <span aria-hidden>→</span>
          </Link>
        </section>
      </main>
    </div>
  );
}
