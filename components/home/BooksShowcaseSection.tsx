import Link from "next/link";
import { fullPath } from "@/lib/content-path";
import { OutboundLink } from "@/components/OutboundLink";

const STORE_LABELS: Record<string, string> = {
  ridibooks: "리디에서 보기",
  kyobo: "교보에서 보기",
  yes24: "예스24에서 보기",
  aladin: "알라딘에서 보기",
};
const STORE_ORDER = ["ridibooks", "kyobo", "yes24", "aladin"];

export type BookItem = {
  slug: string;
  title: string;
  description: string;
  audience: string;
  coverImage?: string;
  stores?: Record<string, string>;
};

type BooksShowcaseSectionProps = {
  books: BookItem[];
};

export function BooksShowcaseSection({ books }: BooksShowcaseSectionProps) {
  if (books.length === 0) return null;

  return (
    <section className="py-20">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">BOOKS</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
        전자책으로 더 길게 읽기
      </h2>
      <p className="mt-3 max-w-2xl text-[15.5px] leading-7 text-[var(--muted)]">
        사이트에서 다루는 핵심 내용을 더 체계적인 흐름으로 읽고 싶다면 전자책이 도움이 됩니다.
      </p>
      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {books.map((item) => (
          <div
            key={item.slug}
            className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-6 transition hover:border-[var(--border-strong)] sm:flex-row sm:gap-6"
          >
            {item.coverImage && (
              <div className="h-36 w-28 shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted-bg)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.coverImage} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <Link
                href={fullPath("books", item.slug)}
                className="font-semibold text-foreground no-underline hover:text-[var(--brand-500)] hover:underline"
              >
                {item.title}
              </Link>
              {item.audience && (
                <p className="mt-1 text-xs text-[var(--muted)]">{item.audience}</p>
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
                      className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-medium text-foreground no-underline transition hover:border-[var(--brand-500)]/50 hover:bg-[var(--muted-bg)]/50"
                    >
                      {STORE_LABELS[key] || key}
                    </OutboundLink>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
