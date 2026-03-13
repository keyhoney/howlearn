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
} from "@/components/mdx";
import { toImageUrl } from "@/lib/image-url";
import { slugify, extractTextFromNode } from "@/lib/headings";
import { MdxH2 } from "@/components/mdx/MdxH2";

function createConceptAwareAnchor(publishedConceptSlugs: string[]) {
  const slugSet = new Set(publishedConceptSlugs);
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
    const isReady = isConcept && targetSlug.length > 0 && slugSet.has(targetSlug);

    if (isConcept && !isReady) {
      return (
        <span
          className="text-slate-400 border-b border-dotted border-slate-400 cursor-default opacity-70"
          title="콘텐츠 준비 중입니다"
        >
          {children}
        </span>
      );
    }

    const isInternal = href.startsWith("/") && !href.startsWith("//");
    if (isInternal) {
      return (
        <Link href={href} {...props} className="text-indigo-600 hover:underline dark:text-indigo-400">
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

function MdxImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const src = typeof props.src === "string" ? props.src : "";
  const alt = props.alt ?? "";
  return (
    // eslint-disable-next-line @next/next/no-img-element -- MDX 콘텐츠는 동적 src/외부 URL이 많아 next/image 대신 img 사용
    <img {...props} src={toImageUrl(src)} alt={alt} role={alt ? undefined : "presentation"} />
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
};

/** 발행된 개념 슬러그 목록을 받아, 개념 링크는 발행된 것만 <a>, 미작성은 <span>으로 렌더하는 컴포넌트 맵 반환 */
export function getMdxComponents(publishedConceptSlugs: string[]): MDXComponents {
  return {
    ...baseMdxComponents,
    a: createConceptAwareAnchor(publishedConceptSlugs) as MDXComponents["a"],
  };
}

export const mdxComponents: MDXComponents = baseMdxComponents;
