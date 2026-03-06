import Link from "next/link";
import type { ContentType } from "@/lib/content";

const TYPE_LABEL: Record<ContentType, string> = {
  blog: "블로그",
  guides: "가이드",
  concepts: "개념",
  toolkit: "툴킷",
  books: "전자책",
};

const PILLAR_STRIP: Record<ContentType, string> = {
  guides: "var(--pillar-guides)",
  concepts: "var(--pillar-concepts)",
  toolkit: "var(--pillar-toolkit)",
  blog: "var(--pillar-blog)",
  books: "var(--pillar-books)",
};

type ContentCardProps = {
  type: ContentType;
  title: string;
  href: string;
  description?: string;
  date?: string;
  readingTimeMinutes?: number;
  categories?: string[];
  tags?: string[];
  audience?: string;
};

function getCardClasses(type: ContentType): string {
  const base =
    "rounded-2xl border transition hover:border-[var(--border-strong)] focus-within:border-[var(--border-strong)]";
  const hoverBg = "hover:bg-[var(--surface)]";
  switch (type) {
    case "guides":
      return `${base} border-[var(--border)] bg-[var(--surface-2)] p-7 shadow-sm ${hoverBg}`;
    case "blog":
      return `${base} border-[var(--border)]/80 bg-[var(--surface-2)] p-4 ${hoverBg}`;
    case "concepts":
      return `${base} border-[var(--border)] bg-[var(--inset)]/40 p-5 ${hoverBg}`;
    case "toolkit":
      return `${base} border-[var(--border)] bg-[var(--surface-2)] p-5 ${hoverBg}`;
    case "books":
      return `${base} border-[var(--border)] bg-[var(--surface-2)] p-6 ${hoverBg}`;
    default:
      return `${base} border-[var(--border)] bg-[var(--surface-2)] p-6 ${hoverBg}`;
  }
}

function getTitleSize(type: ContentType): string {
  switch (type) {
    case "guides":
      return "text-2xl";
    case "blog":
      return "text-lg";
    default:
      return "text-xl";
  }
}

export function ContentCard({
  type,
  title,
  href,
  description,
  date,
  readingTimeMinutes,
  categories = [],
  tags = [],
  audience,
}: ContentCardProps) {
  const hasMeta = date || (readingTimeMinutes != null && readingTimeMinutes > 0) || audience;
  const titleSize = getTitleSize(type);

  return (
    <article
      className={getCardClasses(type)}
      style={{ borderLeftWidth: "2px", borderLeftColor: PILLAR_STRIP[type] }}
    >
      <Link href={href} className="group block">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          {TYPE_LABEL[type]}
        </span>
        <h2
          className={`mt-1 ${titleSize} font-semibold text-foreground transition group-hover:text-[var(--brand-500)]`}
          style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}
        >
          {title}
        </h2>
      </Link>
      {/* toolkit: 메타를 더 전면에 */}
      {type === "toolkit" && hasMeta && (
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted)]">
          {readingTimeMinutes != null && readingTimeMinutes > 0 && (
            <span>{readingTimeMinutes}분 읽기</span>
          )}
          {audience && <span>{audience}</span>}
          {date && <time dateTime={date}>{date}</time>}
        </div>
      )}
      {type !== "toolkit" && hasMeta && (
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted)]">
          {date && <time dateTime={date}>{date}</time>}
          {readingTimeMinutes != null && readingTimeMinutes > 0 && (
            <span>{readingTimeMinutes}분 읽기</span>
          )}
          {audience && <span>{audience}</span>}
        </div>
      )}
      {description && (
        <p
          className={
            type === "guides"
              ? "mt-4 text-[15.5px] font-medium leading-7 text-foreground md:leading-8"
              : "mt-3 text-[15.5px] leading-7 text-[var(--muted)] md:leading-8"
          }
        >
          {description}
        </p>
      )}
      {(categories.length > 0 || tags.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c}
              href={`/c/${encodeURIComponent(c)}`}
              className="rounded-xl border border-[var(--border)]/80 px-2.5 py-1 text-xs font-medium text-foreground no-underline transition hover:border-[var(--border-strong)]"
            >
              {c}
            </Link>
          ))}
          {tags.map((t) => (
            <Link
              key={t}
              href={`/t/${encodeURIComponent(t)}`}
              className="rounded-xl px-2.5 py-1 text-xs font-medium text-[var(--muted)] no-underline hover:text-foreground"
            >
              #{t}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
