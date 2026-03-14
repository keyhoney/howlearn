export type DomainSlug =
  | "cognitive-psychology"
  | "neuroscience"
  | "educational-psychology"
  | "developmental-psychology"
  | "motivation-emotion";

export type ContentType = "guide" | "concept" | "toolkit" | "book";

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
  /** MDX frontmatter coverImage 예: /guides/my-post/01.webp */
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
  body: string;
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

export type AnyContent = Guide | Concept | Toolkit | Book;
