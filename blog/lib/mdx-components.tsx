import React from "react";
import type { MDXComponents } from "mdx/types";
import {
  TheoryBox,
  TeacherNote,
  ForStudents,
  ForParents,
  Sources,
  KeyTakeaways,
  CommonMisconception,
  ActionChecklist,
  RelatedConcepts,
  ConceptAnchorLink,
  ReflectionPrompt,
  WhyItMatters,
  RelatedGuides,
  WhenToUse,
  Troubleshooting,
  PrintableBlock,
  BookOverview,
  WhoThisIsFor,
  WhatYouWillLearn,
  TopicIntro,
  RelatedCards,
} from "@/components/mdx";
import { toImageUrl } from "@/lib/image-url";
import { slugify, extractTextFromNode } from "@/lib/headings";

function createHeading(level: 2 | 3) {
  const Tag = `h${level}` as "h2" | "h3";
  const MdxHeading = ({ children, ...props }: React.ComponentProps<"h2">) => {
    const text = extractTextFromNode(children);
    const id = text ? slugify(text) : undefined;
    return <Tag {...props} id={id}>{children}</Tag>;
  };
  MdxHeading.displayName = level === 2 ? "MdxH2" : "MdxH3";
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
  h2: createHeading(2),
  h3: createHeading(3),
  RelatedCards,
  TheoryBox,
  TeacherNote,
  ForStudents,
  ForParents,
  Sources,
  SourceNote: Sources,
  KeyTakeaways,
  CommonMisconception,
  ActionChecklist,
  RelatedConcepts,
  ConceptAnchorLink,
  ReflectionPrompt,
  WhyItMatters,
  RelatedGuides,
  WhenToUse,
  Troubleshooting,
  PrintableBlock,
  BookOverview,
  WhoThisIsFor,
  WhatYouWillLearn,
  TopicIntro,
};
