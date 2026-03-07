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
  relatedContentIds?: string[];
  references?: { title?: string; url: string }[];
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
