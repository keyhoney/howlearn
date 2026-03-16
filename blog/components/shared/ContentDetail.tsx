import Link from "next/link";
import { AnyContent, ContentType } from "@/lib/types";
import type { FaqItem } from "@/lib/types";
import { DomainBadge, TagList } from "@/components/ui/badges";
import { ContentCard } from "@/components/cards/ContentCard";
import { format } from "date-fns";
import { ChevronRight, Home } from "lucide-react";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { TableOfContents } from "@/components/TableOfContents";
import { TocFloatingMobile } from "@/components/TocFloatingMobile";
import { ReferenceCard } from "@/components/ReferenceCard";
import { DocCTA } from "@/components/DocCTA";
import { Disclaimer } from "@/components/Disclaimer";
import { CommentSectionDynamic } from "@/components/comments/CommentSectionDynamic";
import { FaqProvider } from "@/components/context/FaqContext";
import type { HeadingItem } from "@/lib/headings";
import { author, authorByline } from "@/lib/site";

export type ReferringItem = { type: ContentType; slug: string; title: string; path: string };

interface ContentDetailProps {
  content: AnyContent;
  relatedContent: AnyContent[];
  children?: React.ReactNode;
  tocHeadings?: HeadingItem[];
  references?: { title?: string; url: string }[];
  showDisclaimer?: boolean;
  referringContent?: ReferringItem[];
  /** CTA 문구(참고 문헌과 면책 안내 사이). 없으면 기본 문구 사용 */
  ctaText?: string;
  /** CTA 버튼 라벨 */
  ctaButtonLabel?: string;
  /** 가이드/개념 FAQ: 있으면 children을 FaqProvider로 감싸서 MDX 내 <FaqSection />이 FAQ → BottomSummary 순으로 표시되게 함 */
  faqItems?: FaqItem[];
}

const typeLabels: Record<ContentType, string> = {
  guide: "가이드",
  concept: "개념",
  toolkit: "툴킷",
  book: "전자책",
};

const typeLinks: Record<ContentType, string> = {
  guide: "/guides",
  concept: "/concepts",
  toolkit: "/toolkit",
  book: "/books",
};

export function ContentDetail({
  content,
  relatedContent,
  children,
  tocHeadings,
  references,
  showDisclaimer,
  referringContent,
  ctaText = "나눌수록 더 깊이 이해됩니다.",
  ctaButtonLabel = "공유하기",
  faqItems,
}: ContentDetailProps) {
  const hasFaq = Array.isArray(faqItems) && faqItems.length > 0;
  const articleChildren = hasFaq ? (
    <FaqProvider faq={faqItems}>{children ?? <MarkdownRenderer content={content.body || ""} />}</FaqProvider>
  ) : (
    children ?? <MarkdownRenderer content={content.body || ""} />
  );
  const hubHref = typeLinks[content.type];
  const hubLabel = typeLabels[content.type];
  const refs = references ?? content.references;

  return (
    <div className="bg-white dark:bg-slate-900 transition-colors">
      {/* Header Section */}
      <header className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 py-8 sm:py-12 md:py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap items-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 sm:mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              <Home className="w-4 h-4 shrink-0" />
              <span className="sr-only">Home</span>
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-400 dark:text-slate-500 shrink-0" />
            <Link href={hubHref} className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors truncate">
              {hubLabel}
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="text-slate-900 dark:text-slate-100 truncate max-w-[180px] xs:max-w-[240px] sm:max-w-xs">{content.title}</span>
          </nav>

          {/* Title & Meta */}
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
            {(Array.isArray(content.domains) ? content.domains : []).map(domain => (
              <DomainBadge key={domain} domain={domain} />
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            {content.title}
          </h1>

          {content.type === "concept" && content.englishName && (
            <p className="text-lg sm:text-xl font-mono text-slate-500 dark:text-slate-400 mt-3 sm:mt-4">{content.englishName}</p>
          )}

          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            {content.type === "concept" ? content.shortDefinition : content.summary}
          </p>

          <div className="mt-6 sm:mt-8 border-t border-slate-200 dark:border-slate-700 pt-6 sm:pt-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <TagList tags={Array.isArray(content.tags) ? content.tags : []} />
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400 font-mono shrink-0">
                {content.publishedAt && (
                  <span>게시 {format(new Date(content.publishedAt), "yyyy.MM.dd")}</span>
                )}
                {content.reviewedAt && content.reviewedAt !== content.publishedAt && (
                  <span>검토 {format(new Date(content.reviewedAt), "yyyy.MM.dd")}</span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-slate-600 dark:text-slate-300">
              <span className="font-medium text-slate-700 dark:text-slate-200">저자</span>
              <Link href="/about#author" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                {content.author ?? authorByline.name}
              </Link>
              <span className="text-slate-500 dark:text-slate-400">({authorByline.credentials})</span>
              <span className="text-slate-400 dark:text-slate-500">·</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">검토</span>
              <Link href="/about#review-policy" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                {authorByline.reviewerNote}
              </Link>
              <span className="text-slate-400 dark:text-slate-500">·</span>
              <Link href="/about" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                소개
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,200px] gap-x-12 gap-y-8 lg:gap-y-0">
          {/* 본문: 좌측 컬럼에 고정 */}
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <article className="prose prose-slate prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-headings:scroll-mt-24 prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 hover:prose-a:text-indigo-500 dark:hover:prose-a:text-indigo-300 [&_a[href^='/concepts/']]:font-medium [&_a[href^='/concepts/']]:text-[#4F39F6] [&_a[href^='/concepts/']]:underline [&_a[href^='/concepts/']]:decoration-2 [&_a[href^='/concepts/']]:decoration-dotted [&_a[href^='/concepts/']]:underline-offset-2">
              {articleChildren}
            </article>
            {Array.isArray(refs) && refs.length > 0 && <ReferenceCard items={refs} />}
            <DocCTA text={ctaText} buttonLabel={ctaButtonLabel} />
            {showDisclaimer && <Disclaimer />}
            {(content.type === "guide" || content.type === "concept") && (
              <CommentSectionDynamic path={`${hubHref}/${content.slug}`} />
            )}
          </div>
          {/* TOC: 데스크톱에서 sticky — 스크롤해도 뷰포트 상단에 붙어 따라옴 (self-start로 그리드 셀 전체 높이에 묶이지 않음) */}
          {Array.isArray(tocHeadings) && tocHeadings.length > 0 && (
            <aside
              className="lg:col-start-2 lg:row-start-1 hidden lg:block lg:sticky lg:top-24 lg:z-10 lg:self-start lg:w-[200px] lg:min-w-[200px] lg:max-w-[200px] lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:overflow-x-hidden lg:rounded-xl lg:border lg:border-slate-200 lg:bg-white/95 lg:px-3 lg:py-4 lg:shadow-sm lg:backdrop-blur-sm dark:lg:border-slate-700 dark:lg:bg-slate-900/95"
              aria-label="목차"
            >
              <TableOfContents headings={tocHeadings} />
            </aside>
          )}
        </div>
      </div>

      {/* 모바일·태블릿: 플로팅 목차 버튼 (lg 미만에서만 노출, fixed로 CLS 없음) */}
      {Array.isArray(tocHeadings) && tocHeadings.length > 0 && (
        <TocFloatingMobile headings={tocHeadings} />
      )}

      {/* Content that refers to this concept (concept pages only) */}
      {(Array.isArray(referringContent) ? referringContent : []).length > 0 && (
        <section className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 py-10 sm:py-16 lg:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6 sm:mb-8">
              이 개념을 다루는 글
            </h2>
            <ul className="space-y-3">
              {(Array.isArray(referringContent) ? referringContent : []).map((item) => (
                <li key={`${item.type}-${item.slug}`}>
                  <Link
                    href={item.path}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
                  >
                    {item.title}
                  </Link>
                  <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">
                    ({typeLabels[item.type]})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Related Content (책 상세에서는 미노출) */}
      {Array.isArray(relatedContent) && relatedContent.length > 0 && content.type !== "book" && (
        <section className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 py-10 sm:py-16 lg:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6 sm:mb-8">관련 지식 탐색</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {(Array.isArray(relatedContent) ? relatedContent : []).map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
