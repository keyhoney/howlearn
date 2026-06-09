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
  author: z.string().default('하우런'),
  lang: z.string().default('ko'),
});

// ─── 콘텐츠 컬렉션 ──────────────────────────────────────────────

/** 가이드: 학습 과학 기반 학습법/교육 전략 가이드 */
const guides = defineCollection({
  loader: glob({ base: './src/content/guides', pattern: '**/*.{md,mdx}' }),
  schema: baseContentSchema.omit({ categories: true }).extend({
    summary: z.string().optional(),
    description: z.string().optional(),
    datePublished: z.coerce.date().optional(),
    dateModified: z.coerce.date().optional(),
    dateReviewed: z.coerce.date().optional(),
    category: z.array(z.string()).optional(),
    categories: z.array(z.string()).default([]),
    intro: z.string().optional(),
    faq: z.array(faqSchema).default([]),
  }).transform((data) => {
    const publishedAt = data.publishedAt ?? data.datePublished;
    const updatedAt = data.updatedAt ?? data.dateModified ?? publishedAt;
    const categories =
      data.categories.length > 0 ? data.categories : (data.category ?? []);
    const summary = (data.summary ?? data.description ?? '').trim();
    return {
      ...data,
      summary,
      publishedAt,
      updatedAt,
      categories,
    };
  }),
});

/** 개념: 인지 부하, 분산 학습 등 핵심 개념 사전 */
const concepts = defineCollection({
  loader: glob({ base: './src/content/concepts', pattern: '**/*.{md,mdx}' }),
  schema: baseContentSchema
    .omit({ categories: true })
    .extend({
      summary: z.string().optional(),
      /** 개념 요약 – 검색 카드/툴팁에 사용 */
      shortDefinition: z.string().optional(),
      /** learninsight 등 이전 앱 frontmatter 호환 */
      description: z.string().optional(),
      datePublished: z.coerce.date().optional(),
      dateModified: z.coerce.date().optional(),
      category: z.array(z.string()).optional(),
      slug: z.string().optional(),
      englishName: z.string().optional(),
      dateReviewed: z.coerce.date().optional(),
      type: z.string().optional(),
      categories: z.array(z.string()).default([]),
      faq: z.array(faqSchema).default([]),
    })
    .transform((data) => {
      const shortDefinition = (
        data.shortDefinition ??
        data.description ??
        data.summary ??
        ''
      ).trim();
      const summaryFromField = (data.summary ?? '').trim();
      const summary = summaryFromField || (data.shortDefinition ? '' : shortDefinition);
      const publishedAt = data.publishedAt ?? data.datePublished;
      const updatedAt = data.updatedAt ?? data.dateModified ?? publishedAt;
      const categories =
        data.categories.length > 0 ? data.categories : (data.category ?? []);

      return {
        ...data,
        summary,
        shortDefinition,
        publishedAt,
        updatedAt,
        categories,
        coverImage: data.coverImage ?? data.ogImage,
        seoDescription: data.seoDescription ?? data.description,
        dateReviewed: data.dateReviewed,
      };
    }),
});

/** 도서: 부모·학습자에게 도움이 되는 도서 리뷰 */
const books = defineCollection({
  loader: glob({ base: './src/content/books', pattern: '**/*.{md,mdx}' }),
  schema: baseContentSchema
    .omit({ categories: true, tags: true })
    .extend({
      summary: z.string().optional(),
      /** learninsight 등 이전 앱 frontmatter 호환 */
      description: z.string().optional(),
      datePublished: z.coerce.date().optional(),
      dateModified: z.coerce.date().optional(),
      category: z.array(z.string()).optional(),
      slug: z.string().optional(),
      type: z.string().optional(),
      subtitle: z.string().optional(),
      tags: z.array(z.string()).default([]),
      categories: z.array(z.string()).default([]),
      purchaseLinks: z
        .array(z.object({ label: z.string(), href: z.string().url() }))
        .default([]),
    })
    .transform((data) => {
      const summary = (data.summary ?? data.description ?? '').trim();
      const publishedAt = data.publishedAt ?? data.datePublished;
      const updatedAt = data.updatedAt ?? data.dateModified ?? publishedAt;
      const categories =
        data.categories.length > 0 ? data.categories : (data.category ?? []);
      const coverImage = data.coverImage ?? data.ogImage;

      return {
        ...data,
        summary,
        publishedAt,
        updatedAt,
        categories,
        coverImage,
        seoDescription: data.seoDescription ?? data.description,
      };
    }),
});

/** 칼럼: 장기 학습을 돕는 에세이 콘텐츠 */
const columns = defineCollection({
  loader: glob({ base: './src/content/columns', pattern: '**/*.{md,mdx}' }),
  schema: baseContentSchema.extend({
    description: z.string().optional(),
    datePublished: z.coerce.date().optional(),
    dateModified: z.coerce.date().optional(),
    dateReviewed: z.coerce.date().optional(),
    category: z.array(z.string()).optional(),
    faq: z.array(faqSchema).default([]),
  }).transform((data) => {
    const publishedAt = data.publishedAt ?? data.datePublished;
    const updatedAt = data.updatedAt ?? data.dateModified ?? publishedAt;
    const categories =
      data.categories.length > 0 ? data.categories : (data.category ?? []);
    return {
      ...data,
      publishedAt,
      updatedAt,
      categories,
    };
  }),
});

export const collections = {
  guides,
  concepts,
  books,
  columns,
};
