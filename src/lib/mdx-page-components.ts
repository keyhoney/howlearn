import {
  AnalogyBlock,
  BookCoverImage,
  BookStoreLinks,
  BookToc,
  BottomSummary,
  Callout,
  CalloutShell,
  CaseModule,
  Citation,
  ConclusionHero,
  FaqSection,
  FAQ,
  MdxH2,
  MidSummaryBox,
  RelatedConcepts,
  Sources,
  TopicIntro,
  Troubleshooting,
  TrustModule,
  VsBox,
} from '@/components/mdx';
import type { MDXComponents } from 'astro/components';
import OxQuiz from '@/components/mdx/OxQuizIsland.astro';
import CheckboxChecklist from '@/components/mdx/CheckboxChecklistIsland.astro';

const baseMdxComponents = {
  AnalogyBlock,
  BookCoverImage,
  BookStoreLinks,
  BookToc,
  BottomSummary,
  Callout,
  CalloutShell,
  CaseModule,
  Citation,
  ConclusionHero,
  FaqSection,
  FAQ,
  MdxH2,
  MidSummaryBox,
  RelatedConcepts,
  Sources,
  TopicIntro,
  Troubleshooting,
  TrustModule,
  VsBox,
} satisfies MDXComponents;

/** 가이드·개념 등 본문 MDX에 쓰는 기본 컴포넌트 맵 */
export const mdxContentComponents: MDXComponents = {
  ...baseMdxComponents,
  OxQuiz,
  CheckboxChecklist,
};
