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
  return ({ children, ...props }: React.ComponentProps<"h2">) => {
    const text = extractTextFromNode(children);
    const id = text ? slugify(text) : undefined;
    return <Tag {...props} id={id}>{children}</Tag>;
  };
}

export const mdxComponents: MDXComponents = {
  img: (props) => <img {...props} src={toImageUrl(props.src ?? "")} alt={props.alt ?? ""} />,
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
