import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { DOMAIN_LABELS } from "./learning-science-domains";

export type ContentType = "blog" | "guides" | "concepts" | "toolkit" | "books";

const CONTENT_DIR = path.join(process.cwd(), "content");

function getContentDir(type: ContentType): string {
  return path.join(CONTENT_DIR, type);
}

function listMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(
      (f) =>
        (f.endsWith(".mdx") || f.endsWith(".md")) && f !== "README.md"
    )
    .map((f) => f.replace(/\.(mdx|md)$/, ""));
}

function getFrontmatterForSlug(type: ContentType, fileSlug: string): Record<string, unknown> | null {
  const dir = getContentDir(type);
  for (const ext of [".mdx", ".md"]) {
    const fullPath = path.join(dir, `${fileSlug}${ext}`);
    if (fs.existsSync(fullPath)) {
      const raw = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(raw);
      return data as Record<string, unknown>;
    }
  }
  return null;
}

/** status가 draft가 아닌 슬러그만 반환. (draft는 목록/RSS/사이트맵에서 제외) */
export function getSlugs(type: ContentType): string[] {
  const dir = getContentDir(type);
  const files = listMdxFiles(dir);
  return files.filter((fileSlug) => {
    const fm = getFrontmatterForSlug(type, fileSlug);
    if (!fm) return true;
    const status = fm.status as string | undefined;
    return status !== "draft";
  });
}

export function getBySlug(
  type: ContentType,
  slug: string
): { frontmatter: Record<string, unknown>; content: string } {
  const dir = getContentDir(type);
  for (const ext of [".mdx", ".md"]) {
    const fullPath = path.join(dir, `${slug}${ext}`);
    if (fs.existsSync(fullPath)) {
      const raw = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(raw);
      return { frontmatter: data as Record<string, unknown>, content };
    }
  }
  throw new Error(`Content not found: ${type}/${slug}`);
}

export function normalizeCategories(fm: Record<string, unknown>): string[] {
  const c = fm.category;
  if (!c) return [];
  if (Array.isArray(c)) return c.filter((x): x is string => typeof x === "string");
  return typeof c === "string" ? [c] : [];
}

export function normalizeTags(fm: Record<string, unknown>): string[] {
  const t = fm.tags;
  if (!Array.isArray(t)) return [];
  return t.filter((x): x is string => typeof x === "string");
}

function getDatePublished(fm: Record<string, unknown>): string | undefined {
  const v = fm.datePublished ?? fm.date;
  if (v == null) return undefined;
  const s = String(v).trim();
  return s || undefined;
}

function getDateModified(fm: Record<string, unknown>): string | undefined {
  const v = fm.dateModified ?? fm.updated ?? fm.datePublished ?? fm.date;
  if (v == null) return undefined;
  const s = String(v).trim();
  return s || undefined;
}

export function getAllByType(
  type: ContentType
): { slug: string; frontmatter: Record<string, unknown> }[] {
  const slugs = getSlugs(type);
  return slugs.map((slug) => {
    const { frontmatter } = getBySlug(type, slug);
    return { slug, frontmatter };
  });
}

/** blog + guides + toolkit 통합 목록 (아카이브·카테고리·태그용) */
export function getAllForArchive(): {
  type: ContentType;
  slug: string;
  frontmatter: Record<string, unknown>;
}[] {
  const types: ContentType[] = ["blog", "guides", "toolkit"];
  const out: { type: ContentType; slug: string; frontmatter: Record<string, unknown> }[] = [];
  for (const type of types) {
    const items = getAllByType(type);
    for (const { slug, frontmatter } of items) {
      out.push({ type, slug, frontmatter });
    }
  }
  return out;
}

export function getCategories(): string[] {
  const set = new Set<string>();
  for (const { frontmatter } of getAllForArchive()) {
    for (const c of normalizeCategories(frontmatter)) set.add(c);
  }
  return Array.from(set).sort();
}

/** 필터용: 5대 영역 순서대로 먼저, 그 외 카테고리는 알파벳 정렬 */
export function getOrderedCategoriesForFilter(): string[] {
  const fromContent = getCategories();
  const domainSet = new Set<string>(DOMAIN_LABELS);
  const rest = fromContent.filter((c) => !domainSet.has(c)).sort();
  return [...DOMAIN_LABELS, ...rest];
}

export function getTags(): string[] {
  const set = new Set<string>();
  for (const { frontmatter } of getAllForArchive()) {
    for (const t of normalizeTags(frontmatter)) set.add(t);
  }
  return Array.from(set).sort();
}

export function getArchiveByCategory(category: string): {
  type: ContentType;
  slug: string;
  frontmatter: Record<string, unknown>;
}[] {
  return getAllForArchive().filter((item) =>
    normalizeCategories(item.frontmatter).includes(category)
  );
}

export function getArchiveByTag(tag: string): {
  type: ContentType;
  slug: string;
  frontmatter: Record<string, unknown>;
}[] {
  return getAllForArchive().filter((item) =>
    normalizeTags(item.frontmatter).includes(tag)
  );
}

export type ContentFrontmatter = {
  type?: string;
  title?: string;
  description?: string;
  slug?: string;
  datePublished?: string;
  dateModified?: string;
  category?: string | string[];
  tags?: string[];
  grade?: string;
  ogImage?: string;
  heroImage?: string;
};

export type BooksFrontmatter = ContentFrontmatter & {
  stores?: { ridibooks?: string; kyobo?: string; yes24?: string; aladin?: string };
  isbn?: string;
  audience?: string;
  toc?: string[];
};

export function getTitle(fm: Record<string, unknown>): string {
  return (fm.title as string) || "";
}

export function getDescription(fm: Record<string, unknown>): string {
  return (fm.description as string) || "";
}

/** frontmatter canonical이 있으면 반환, 없으면 undefined. (페이지에서 site.url + path 대체용) */
export function getCanonicalFromFrontmatter(fm: Record<string, unknown>): string | undefined {
  const v = fm.canonical;
  if (typeof v !== "string" || !v.trim()) return undefined;
  return v.trim();
}

/** frontmatter author. 문자열 또는 배열(첫 번째 사용). JSON-LD·메타용 */
export function getAuthorFromFrontmatter(fm: Record<string, unknown>): string | undefined {
  const v = fm.author;
  if (Array.isArray(v) && v.length > 0 && typeof v[0] === "string") return v[0];
  if (typeof v === "string" && v.trim()) return v.trim();
  return undefined;
}

/** frontmatter lang. 기본 ko-KR */
export function getLangFromFrontmatter(fm: Record<string, unknown>): string {
  const v = fm.lang;
  return typeof v === "string" && v.trim() ? v.trim() : "ko-KR";
}

/** frontmatter keywords. 메타 keywords·JSON-LD용. tags와 별도 */
export function getKeywordsFromFrontmatter(fm: Record<string, unknown>): string[] {
  const k = fm.keywords;
  if (!Array.isArray(k)) return [];
  return k.filter((x): x is string => typeof x === "string");
}

export { getDatePublished, getDateModified };
