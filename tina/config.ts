import { defineConfig, defineSchema } from 'tinacms';

// ─── 공통 재사용 필드 ────────────────────────────────────────────

/** 발행 상태 필드 */
const statusField = {
  type: 'string' as const,
  name: 'status',
  label: '발행 상태',
  required: true,
  options: [
    { value: 'draft', label: '초안 (비공개)' },
    { value: 'published', label: '발행' },
  ],
  ui: { defaultValue: 'published' },
};

/** 도메인(학문 분류) 필드 */
const domainsField = {
  type: 'string' as const,
  name: 'domains',
  label: '학문 분류',
  list: true,
  options: [
    { value: 'cognitive-psychology', label: '인지 심리학' },
    { value: 'neuroscience', label: '신경과학' },
    { value: 'educational-psychology', label: '교육 심리학' },
    { value: 'developmental-psychology', label: '발달 심리학' },
    { value: 'motivation-emotion', label: '동기·정서' },
  ],
};

/** 태그 필드 */
const tagsField = {
  type: 'string' as const,
  name: 'tags',
  label: '태그',
  list: true,
  ui: { component: 'tags' },
};

/** 카테고리 필드 */
const categoriesField = {
  type: 'string' as const,
  name: 'categories',
  label: '카테고리',
  list: true,
};

/** 발행일 필드 */
const publishedAtField = {
  type: 'datetime' as const,
  name: 'publishedAt',
  label: '발행일',
};

/** SEO 필드 묶음 */
const seoFields = [
  { type: 'string' as const, name: 'seoTitle', label: 'SEO 제목 (생략 시 title 사용)' },
  { type: 'string' as const, name: 'seoDescription', label: 'SEO 설명', ui: { component: 'textarea' } },
  { type: 'string' as const, name: 'coverImage', label: '커버 이미지 URL' },
];

/** 참고 문헌 필드 */
const referencesField = {
  type: 'object' as const,
  name: 'references',
  label: '참고 문헌',
  list: true,
  fields: [
    { type: 'string' as const, name: 'title', label: '제목 (선택)' },
    { type: 'string' as const, name: 'url', label: 'URL', required: true },
  ],
};

/** FAQ 필드 */
const faqField = {
  type: 'object' as const,
  name: 'faq',
  label: 'FAQ',
  list: true,
  fields: [
    { type: 'string' as const, name: 'question', label: '질문', required: true },
    { type: 'string' as const, name: 'answer', label: '답변', required: true, ui: { component: 'textarea' } },
  ],
};

/** 관련 콘텐츠 ID 필드 */
const relatedContentIdsField = {
  type: 'string' as const,
  name: 'relatedContentIds',
  label: '관련 콘텐츠 ID',
  list: true,
  description: '형식: guide-slug, concept-slug 등 (type-slug)',
};

// ─── Tina CMS 설정 ───────────────────────────────────────────────

export default defineConfig({
  /**
   * TinaCloud 사용 시 clientId/token을 환경 변수로 설정:
   * NEXT_PUBLIC_TINA_CLIENT_ID / TINA_TOKEN
   * 로컬 개발 시에는 branch="main"만으로 동작.
   */
  branch: process.env.TINA_BRANCH ?? process.env.HEAD ?? 'main',
  clientId: process.env.TINA_CLIENT_ID ?? null,
  token: process.env.TINA_TOKEN ?? null,

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },

  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },

  schema: defineSchema({
    collections: [
      // ─── 1. 가이드 컬렉션 ───────────────────────────────────────
      {
        name: 'guides',
        label: '가이드',
        path: 'src/content/guides',
        format: 'mdx',
        ui: {
          router: ({ document }) => `/guides/${document._sys.filename}`,
          defaultItem: () => ({ status: 'draft', domains: [], tags: [], categories: [] }),
        },
        fields: [
          { type: 'string', name: 'title', label: '제목', required: true, isTitle: true },
          { type: 'string', name: 'summary', label: '요약', required: true, ui: { component: 'textarea' } },
          statusField,
          domainsField,
          categoriesField,
          tagsField,
          publishedAtField,
          { type: 'string', name: 'intro', label: '도입 문장 (선택)', ui: { component: 'textarea' } },
          faqField,
          relatedContentIdsField,
          referencesField,
          ...seoFields,
          { type: 'boolean', name: 'featured', label: '추천 콘텐츠' },
          { type: 'rich-text', name: 'body', label: '본문', isBody: true },
        ],
      },

      // ─── 2. 개념 컬렉션 ─────────────────────────────────────────
      {
        name: 'concepts',
        label: '개념',
        path: 'src/content/concepts',
        format: 'mdx',
        ui: {
          router: ({ document }) => `/concepts/${document._sys.filename}`,
          defaultItem: () => ({ status: 'draft', domains: [], tags: [], categories: [] }),
        },
        fields: [
          { type: 'string', name: 'title', label: '제목', required: true, isTitle: true },
          {
            type: 'string',
            name: 'shortDefinition',
            label: '짧은 정의 (필수)',
            required: true,
            ui: { component: 'textarea' },
          },
          { type: 'string', name: 'englishName', label: '영문명 (선택)' },
          { type: 'string', name: 'summary', label: '요약', required: true, ui: { component: 'textarea' } },
          statusField,
          domainsField,
          categoriesField,
          tagsField,
          publishedAtField,
          faqField,
          relatedContentIdsField,
          referencesField,
          ...seoFields,
          { type: 'boolean', name: 'featured', label: '추천 콘텐츠' },
          { type: 'rich-text', name: 'body', label: '본문', isBody: true },
        ],
      },

      // ─── 3. 도서 컬렉션 ─────────────────────────────────────────
      {
        name: 'books',
        label: '도서',
        path: 'src/content/books',
        format: 'mdx',
        ui: {
          router: ({ document }) => `/books/${document._sys.filename}`,
          defaultItem: () => ({ status: 'draft', domains: [], tags: [], categories: [] }),
        },
        fields: [
          { type: 'string', name: 'title', label: '제목', required: true, isTitle: true },
          { type: 'string', name: 'subtitle', label: '부제 (선택)' },
          { type: 'string', name: 'summary', label: '요약', required: true, ui: { component: 'textarea' } },
          statusField,
          domainsField,
          categoriesField,
          tagsField,
          publishedAtField,
          {
            type: 'object',
            name: 'purchaseLinks',
            label: '구매 링크',
            list: true,
            fields: [
              { type: 'string', name: 'label', label: '표시 이름', required: true },
              { type: 'string', name: 'href', label: 'URL', required: true },
            ],
          },
          relatedContentIdsField,
          referencesField,
          ...seoFields,
          { type: 'boolean', name: 'featured', label: '추천 콘텐츠' },
          { type: 'rich-text', name: 'body', label: '본문', isBody: true },
        ],
      },

      // ─── 4. 칼럼 컬렉션 ─────────────────────────────────────────
      {
        name: 'columns',
        label: '칼럼',
        path: 'src/content/columns',
        format: 'mdx',
        ui: {
          router: ({ document }) => `/columns/${document._sys.filename}`,
          defaultItem: () => ({ status: 'draft', domains: [], tags: [], categories: [] }),
        },
        fields: [
          { type: 'string', name: 'title', label: '제목', required: true, isTitle: true },
          { type: 'string', name: 'summary', label: '요약', required: true, ui: { component: 'textarea' } },
          statusField,
          domainsField,
          categoriesField,
          tagsField,
          publishedAtField,
          faqField,
          relatedContentIdsField,
          referencesField,
          ...seoFields,
          { type: 'boolean', name: 'featured', label: '추천 콘텐츠' },
          { type: 'rich-text', name: 'body', label: '본문', isBody: true },
        ],
      },
    ],
  }),
});
