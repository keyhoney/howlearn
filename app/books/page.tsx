import { getAllByType } from "@/lib/content";
import { fullPath } from "@/lib/content-path";
import { SectionHeader } from "@/components/SectionHeader";
import { OutboundLink } from "@/components/OutboundLink";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "전자책",
  description: "출간 전자책 소개 및 구매 링크입니다.",
};

const STORE_LABELS: Record<string, string> = {
  ridibooks: "리디북스",
  kyobo: "교보문고",
  yes24: "예스24",
  aladin: "알라딘",
};

const STORE_ORDER = ["ridibooks", "kyobo", "yes24", "aladin"];

export default function BooksListPage() {
  const items = getAllByType("books").map(({ slug, frontmatter }) => ({
    slug,
    title: (frontmatter.title as string) || slug,
    description: (frontmatter.description as string) || "",
    audience: (frontmatter.audience as string) || "",
    coverImage: (frontmatter.coverImage as string) || "",
    stores: frontmatter.stores as Record<string, string> | undefined,
  }));

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <SectionHeader
        title="전자책"
        description="출간 목록 · 학습과학·교육 관련 전자책을 소개합니다."
        badge="출간 도서"
      />
      <p className="mb-10 text-sm leading-relaxed text-[var(--muted)]">
        저자와 연구 범위, 콘텐츠 원칙에 맞춰 학습과학·교육 주제의 전자책을 출간했습니다. 아래에서 각 서점으로 이동해 보실 수 있습니다.
      </p>
      <ul className="space-y-8">
        {items.map((item) => (
          <li
            key={item.slug}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              {item.coverImage && (
                <div className="h-40 w-32 shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted-bg)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.coverImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <Link
                  href={fullPath("books", item.slug)}
                  className="font-semibold text-foreground no-underline hover:text-[var(--brand-500)]"
                >
                  {item.title}
                </Link>
                {item.audience && (
                  <span className="ml-2 rounded-full border border-[var(--border)] bg-[var(--muted-bg)]/50 px-2.5 py-0.5 text-xs text-[var(--muted)]">
                    {item.audience}
                  </span>
                )}
                {item.description && (
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {item.description}
                  </p>
                )}
                {item.stores && Object.keys(item.stores).length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {STORE_ORDER.filter((k) => item.stores?.[k]).map((key) => (
                      <OutboundLink
                        key={key}
                        href={item.stores![key]}
                        label={STORE_LABELS[key] || key}
                        className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-medium text-foreground no-underline transition hover:border-[var(--brand-500)]/50 hover:bg-[var(--muted-bg)]/50"
                      >
                        서점에서 보기 · {STORE_LABELS[key] || key}
                      </OutboundLink>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
