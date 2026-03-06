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

/** 툴킷 타입 배지 (frontmatter toolkitType) */
export type ToolkitType = "routine" | "template" | "checklist";

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
  toolkitType?: ToolkitType;
  /** 개념 카드용: 이 개념을 참조하는 글 수 */
  conceptReferringCount?: number;
};

function getCardClasses(type: ContentType): string {
  const base =
    "rounded-2xl border transition-all duration-200 hover:border-[var(--border-strong)] hover:-translate-y-px focus-within:border-[var(--border-strong)]";
  const hoverBg = "hover:bg-[var(--surface)]";
  switch (type) {
    case "guides":
      return `${base} border-[var(--border)] bg-[var(--surface-2)] p-7 shadow-sm ${hoverBg}`;
    case "blog":
      return `${base} border-[var(--border)] bg-[var(--surface-2)] p-5 ${hoverBg}`;
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

const TOOLKIT_TYPE_LABEL: Record<ToolkitType, string> = {
  routine: "루틴",
  template: "템플릿",
  checklist: "체크리스트",
};

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
  toolkitType,
  conceptReferringCount,
}: ContentCardProps) {
  const hasMeta = date || (readingTimeMinutes != null && readingTimeMinutes > 0) || audience;
  const titleSize = getTitleSize(type);
  const stripWidth = type === "guides" ? "3px" : "2px";

  return (
    <article
      className={getCardClasses(type)}
      style={{ borderLeftWidth: stripWidth, borderLeftColor: PILLAR_STRIP[type] }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Link href={href} className="group block">
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
            {TYPE_LABEL[type]}
          </span>
        </Link>
        {type === "toolkit" && toolkitType && TOOLKIT_TYPE_LABEL[toolkitType] && (
          <span className="rounded-full border border-[var(--border)] bg-[var(--inset)]/60 px-2.5 py-0.5 text-xs font-medium text-[var(--muted)]">
            {TOOLKIT_TYPE_LABEL[toolkitType]}
          </span>
        )}
      </div>
      <Link href={href} className="group block mt-1">
        <h2
          className={`${titleSize} font-semibold text-foreground transition group-hover:text-[var(--brand-500)]`}
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
              : type === "concepts"
                ? "mt-3 line-clamp-2 text-sm leading-6 text-[var(--muted)]"
                : "mt-3 text-[15.5px] leading-7 text-[var(--muted)] md:leading-8"
          }
        >
          {description}
        </p>
      )}
      {type === "concepts" && conceptReferringCount != null && conceptReferringCount > 0 && (
        <p className="mt-2 text-xs text-[var(--muted)]">{conceptReferringCount}개 글</p>
      )}
      {(categories.length > 0 || tags.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c}
              href={`/c/${encodeURIComponent(c)}`}
              className="rounded-full border border-[var(--border)] bg-[var(--inset)]/50 px-2.5 py-1 text-xs font-medium text-foreground no-underline transition hover:border-[var(--border-strong)] hover:bg-[var(--inset)]"
            >
              {c}
            </Link>
          ))}
          {tags.map((t) => (
            <Link
              key={t}
              href={`/t/${encodeURIComponent(t)}`}
              className="rounded-full bg-[var(--muted-bg)]/80 px-2.5 py-1 text-xs font-medium text-[var(--muted)] no-underline hover:text-foreground"
            >
              #{t}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
