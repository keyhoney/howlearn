import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/Callout";
import { ConceptLink } from "@/components/ConceptLink";
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
} from "@/components/mdx";
import { slugify } from "@/lib/headings";

function headingText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(headingText).join("");
  if (children && typeof children === "object" && "props" in children) {
    const el = children as React.ReactElement<{ children?: React.ReactNode }>;
    return headingText(el.props?.children ?? "");
  }
  return "";
}

export const mdxServerComponents: MDXComponents = {
  Callout,
  ConceptLink,
  // 에디토리얼 컴포넌트 (필수·선택)
  TheoryBox,
  TeacherNote,
  ForStudents,
  ForParents,
  Sources,
  SourceNote: Sources, // 별칭
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
  h1: ({ children }) => (
    <h1 className="mb-6 mt-8 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
      {children}
    </h1>
  ),
  h2: ({ children }) => {
    const id = slugify(headingText(children));
    return (
      <h2 id={id} className="mb-4 mt-14 border-b border-[var(--border)] pb-2.5 text-xl font-semibold tracking-tight text-[var(--ink)] scroll-mt-24 md:text-2xl" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const id = slugify(headingText(children));
    return (
      <h3 id={id} className="mb-3 mt-10 text-lg font-semibold text-[var(--ink)] scroll-mt-24 md:text-xl" style={{ fontFamily: "var(--font-noto-serif-kr), ui-serif, serif" }}>
        {children}
      </h3>
    );
  },
  p: ({ children }) => (
    <p className="mb-5 text-[15.5px] leading-7 text-[var(--ink)] md:text-[17px] md:leading-8">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mb-6 list-disc space-y-2 pl-6 text-[var(--ink)]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-6 list-decimal space-y-2 pl-6 text-[var(--ink)]">
      {children}
    </ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-6 border-l-[4px] border-[var(--accent)] bg-[var(--muted-bg)]/80 py-3 pl-5 pr-4 text-[var(--muted)] not-italic">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded border border-[var(--border)]/80 bg-[var(--inset)]/50 px-1.5 py-0.5 font-mono text-sm text-[var(--ink)]">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-6 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--inset)]/50 p-5 font-mono text-sm leading-relaxed text-[var(--ink)]">
      {children}
    </pre>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-[var(--brand-500)] underline underline-offset-2 transition hover:text-[var(--brand-600)]"
    >
      {children}
    </a>
  ),
};
