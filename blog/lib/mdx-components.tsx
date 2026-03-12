import React from "react";
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

export const mdxComponents: MDXComponents = {
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
