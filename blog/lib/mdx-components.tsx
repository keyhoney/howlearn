import React from "react";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import {
  Sources,
  RelatedConcepts,
  Troubleshooting,
  TopicIntro,
  ConclusionHero,
  OxQuiz,
  CheckboxChecklist,
  Callout,
  VsBox,
  AnalogyBlock,
  CaseModule,
  TrustModule,
  MidSummaryBox,
  BottomSummary,
  BookStoreLinks,
  BookToc,
  Citation,
} from "@/components/mdx";
import { toImageUrl } from "@/lib/image-url";
import { slugify, extractTextFromNode } from "@/lib/headings";
import { MdxH2 } from "@/components/mdx/MdxH2";
import { FAQ } from "@/components/FAQ";
import { FaqSection } from "@/components/FaqSection";

function createConceptAwareAnchor(
  publishedConceptSlugs: string[],
  currentConceptSlug?: string | null
) {
  const slugSet = new Set(publishedConceptSlugs);
  const normalizeInternalHref = (value: string): string => {
    const normalized = value.replace(/^\/|\/$/g, "");
    if (normalized.startsWith("concept/")) {
      return `/${normalized.replace(/^concept\//, "concepts/")}`;
    }
    return value;
  };
  return function MdxA({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    if (typeof href !== "string") {
      return <a href={href} {...props}>{children}</a>;
    }
    const normalized = href.replace(/^\/|\/$/g, "");
    const isConcept =
      normalized.startsWith("concepts/") || normalized.startsWith("concept/");
    const targetSlug = normalized.replace(/^concepts?\//, "");

    if (isConcept && targetSlug.length > 0) {
      if (currentConceptSlug != null && targetSlug === currentConceptSlug) {
        return <span>{children}</span>;
      }
      if (!slugSet.has(targetSlug)) {
        return (
          <span
            className="text-slate-400 border-b border-dotted border-slate-400 cursor-default opacity-70"
            title="콘텐츠 준비 중입니다"
          >
            {children}
          </span>
        );
      }
    }

    const normalizedHref = normalizeInternalHref(href);
    const isInternal = normalizedHref.startsWith("/") && !normalizedHref.startsWith("//");
    if (isInternal) {
      return (
        <Link
          href={normalizedHref}
          prefetch={false}
          {...props}
          className="text-indigo-600 hover:underline dark:text-indigo-400"
        >
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  };
}

function createHeading(level: 3) {
  const Tag = "h3" as const;
  const MdxHeading = ({ children, ...props }: React.ComponentProps<"h3">) => {
    const text = extractTextFromNode(children);
    const id = text ? slugify(text) : undefined;
    return <Tag {...props} id={id}>{children}</Tag>;
  };
  MdxHeading.displayName = "MdxH3";
  return MdxHeading;
}

/** src URL에서 파일명을 추출해 alt 없을 때 쓸 기본 문구 생성 (예: /books/math-brain.png → "math-brain 이미지") */
function getDefaultAltFromSrc(src: string): string {
  if (!src) return "문서에 포함된 이미지";
  try {
    const pathname = src.includes("?") ? src.slice(0, src.indexOf("?")) : src;
    const segment = pathname.split("/").filter(Boolean).pop() ?? "";
    const name = segment.replace(/\.[a-zA-Z0-9]+$/, "").replace(/[-_]/g, " ");
    if (name.length > 0) return `${name} 이미지`;
  } catch {
    // ignore
  }
  return "문서에 포함된 이미지";
}

function MdxImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const src = typeof props.src === "string" ? props.src : "";
  const explicitAlt = props.alt;
  const alt =
    explicitAlt !== undefined && explicitAlt !== ""
      ? explicitAlt
      : explicitAlt === ""
        ? ""
        : getDefaultAltFromSrc(src);
  const isDecorative = alt === "";
  const { width, height, className, style, ...rest } = props;
  const hasDimensions = width != null && height != null;
  const reservedStyle = hasDimensions ? style : { ...style, aspectRatio: "16/9" as const };
  return (
    // eslint-disable-next-line @next/next/no-img-element -- MDX 콘텐츠는 동적 src/외부 URL이 많아 next/image 대신 img 사용
    <img
      {...rest}
      src={toImageUrl(src)}
      alt={alt}
      role={isDecorative ? "presentation" : undefined}
      loading="lazy"
      decoding="async"
      width={width}
      height={height}
      className={className}
      style={reservedStyle}
    />
  );
}
MdxImage.displayName = "MdxImage";

const baseMdxComponents: MDXComponents = {
  img: MdxImage,
  h2: MdxH2,
  MdxH2,
  h3: createHeading(3),
  ConclusionHero,
  Sources,
  SourceNote: Sources,
  RelatedConcepts,
  Troubleshooting,
  TopicIntro,
  OxQuiz,
  CheckboxChecklist,
  Callout,
  VsBox,
  AnalogyBlock,
  CaseModule,
  TrustModule,
  MidSummaryBox,
  BottomSummary,
  BookStoreLinks,
  BookToc,
  Citation,
  FAQ,
  FaqSection,
};

/** 발행된 개념 슬러그 목록을 받아, 개념 링크는 발행된 것만 <a>, 미작성은 <span>으로 렌더. currentConceptSlug를 주면 해당 개념 글에서는 자기 자신 링크는 평문으로 표시 */
export function getMdxComponents(
  publishedConceptSlugs: string[],
  currentConceptSlug?: string | null
): MDXComponents {
  return {
    ...baseMdxComponents,
    a: createConceptAwareAnchor(publishedConceptSlugs, currentConceptSlug) as MDXComponents["a"],
  };
}

export const mdxComponents: MDXComponents = baseMdxComponents;
