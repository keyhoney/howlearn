import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ─── 공통 기본 스키마 ────────────────────────────────────────────
const domainEnum = z.enum([
  'cognitive-psychology',
  'neuroscience',
  'educational-psychology',
  'developmental-psychology',
  'motivation-emotion',
]);

const statusEnum = z.enum(['draft', 'published']);

const referenceSchema = z.object({
  title: z.string().optional(),
  url: z.string().url(),
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const baseContentSchema = z.object({
  /** 콘텐츠 유형 – 컬렉션별로 고정 literal로 override */
  title: z.string(),
  summary: z.string(),
  status: statusEnum.default('published'),
  domains: z.array(domainEnum).default([]),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  publishedAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  featured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  coverImage: z.string().optional(),
  ogImage: z.string().optional(),
  /**
   * 관련 콘텐츠 ID 배열. `${type}-${slug}` 형태 (예: guide-spaced-repetition).
   * 참조 무결성은 4단계 validate-content-index.ts에서 검사한다.
   */
  relatedContentIds: z.array(z.string()).default([]),
  references: z.array(referenceSchema).default([]),
  author: z.string().optional(),
  lang: z.string().default('ko'),
});

// ─── 콘텐츠 컬렉션 ──────────────────────────────────────────────

/** 가이드: 학습 과학 기반 학습법/교육 전략 가이드 */
const guides = defineCollection({
  loader: glob({ base: './src/content/guides', pattern: '**/*.{md,mdx}' }),
  schema: baseContentSchema.extend({
    intro: z.string().optional(),
    faq: z.array(faqSchema).default([]),
  }),
});

/** 개념: 인지 부하, 분산 학습 등 핵심 개념 사전 */
const concepts = defineCollection({
  loader: glob({ base: './src/content/concepts', pattern: '**/*.{md,mdx}' }),
  schema: baseContentSchema.extend({
    /** 개념 요약 (필수) – 검색 카드/툴팁에 사용 */
    shortDefinition: z.string(),
    englishName: z.string().optional(),
    faq: z.array(faqSchema).default([]),
  }),
});

/** 도서: 부모·학습자에게 도움이 되는 도서 리뷰 */
const books = defineCollection({
  loader: glob({ base: './src/content/books', pattern: '**/*.{md,mdx}' }),
  schema: baseContentSchema.extend({
    subtitle: z.string().optional(),
    purchaseLinks: z
      .array(z.object({ label: z.string(), href: z.string().url() }))
      .default([]),
  }),
});

/** 칼럼: 장기 학습을 돕는 에세이 콘텐츠 */
const columns = defineCollection({
  loader: glob({ base: './src/content/columns', pattern: '**/*.{md,mdx}' }),
  schema: baseContentSchema.extend({
    faq: z.array(faqSchema).default([]),
  }),
});

// ─── 문제 컬렉션 ─────────────────────────────────────────────────

const examTypeEnum = z.enum(['수능', '모의평가', '교육청', '논술']);

const problemBaseSchema = z.object({
  /**
   * 출처 표기. 예: "2024년 수능 수학"
   * MDX frontmatter에 명시 또는 id 에서 자동 생성 가능.
   */
  source: z.string(),
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
  examType: examTypeEnum,
  subject: z.string(),
  chapter: z.string(),
  concept: z.string(),
  difficulty: z.coerce.number().int().min(1).max(5).default(3),
  /**
   * 정답 타입.
   * - `mcq`: 객관식 1~5
   * - `short`: 단답형 0~999 정수
   */
  answerType: z.enum(['mcq', 'short']),
  /**
   * 정답값. mcq는 1~5, short는 0~999.
   * answerType과의 일치는 4단계 validate-problems.ts에서 검사한다.
   */
  answer: z.coerce.number().int().min(0).max(999),
  tags: z.array(z.string()).default([]),
  relatedProblemIds: z.array(z.string()).default([]),
});

/** 수능/모의평가 수학 기출 문제 */
const problems = defineCollection({
  loader: glob({ base: './src/content/problems', pattern: '**/*.{md,mdx}' }),
  schema: problemBaseSchema,
});

/** 논술 수학 기출 문제 */
const essayProblems = defineCollection({
  loader: glob({ base: './src/content/essay-problems', pattern: '**/*.{md,mdx}' }),
  schema: problemBaseSchema.extend({
    university: z.string(),
    examYear: z.coerce.number().int().optional(),
  }),
});

export const collections = {
  guides,
  concepts,
  books,
  columns,
  problems,
  'essay-problems': essayProblems,
};
