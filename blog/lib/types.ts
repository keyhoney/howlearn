export type DomainSlug =
  | "cognitive-psychology"
  | "neuroscience"
  | "educational-psychology"
  | "developmental-psychology"
  | "motivation-emotion";

export type ContentType = "guide" | "blog" | "concept" | "toolkit" | "book";

export type BaseContent = {
  id: string;
  type: ContentType;
  slug: string;
  title: string;
  summary: string;
  description?: string;
  publishedAt?: string;
  updatedAt?: string;
  featured?: boolean;
  status: "draft" | "published";
  domains: DomainSlug[];
  categories: string[];
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  /** MDX frontmatter coverImage 예: /blog/my-first-post/01.webp */
  coverImage?: string;
  relatedContentIds?: string[];
  references?: { title?: string; url: string }[];
  /** 문서별 저자(이름 또는 사이트 기본 저자). E-E-A-T용 */
  author?: string;
  /** 마지막 검토일(YYYY-MM-DD). dateReviewed 우선, 없으면 dateModified */
  reviewedAt?: string;
  lang?: string;
};

export type Guide = BaseContent & {
  type: "guide";
  intro?: string;
  keyTakeaways?: string[];
  body: string;
};

export type BlogPost = BaseContent & {
  type: "blog";
  body: string;
  /** RSC에서 MDX props가 누락될 수 있어, 페이지에서 직접 렌더 시 사용. */
  keyTakeaways?: string[];
  /** RSC에서 MDX props가 누락될 수 있어, 페이지에서 직접 렌더 시 사용. */
  reflectionPrompt?: { title?: string; questions: string[] };
};

export type Concept = BaseContent & {
  type: "concept";
  englishName?: string;
  shortDefinition: string;
  body: string;
};

export type Toolkit = BaseContent & {
  type: "toolkit";
  format?: "checklist" | "template" | "worksheet";
  estimatedTime?: string;
  body: string;
};

export type Book = BaseContent & {
  type: "book";
  subtitle?: string;
  coverImage?: string;
  purchaseLinks?: { label: string; href: string }[];
  body?: string;
};

export type AnyContent = Guide | BlogPost | Concept | Toolkit | Book;
