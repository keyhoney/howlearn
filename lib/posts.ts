import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export function getSlugs(): string[] {
  if (!fs.existsSync(contentDirectory)) return [];
  const files = fs.readdirSync(contentDirectory);
  return files
    .filter(
      (file) =>
        (file.endsWith(".mdx") || file.endsWith(".md")) && file !== "README.md"
    )
    .map((file) => file.replace(/\.(mdx|md)$/, ""));
}

export function getPostBySlug(slug: string): {
  frontmatter: Record<string, unknown>;
  content: string;
} {
  const extensions = [".mdx", ".md"];
  for (const ext of extensions) {
    const fullPath = path.join(contentDirectory, `${slug}${ext}`);
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      return { frontmatter: data as Record<string, unknown>, content };
    }
  }
  throw new Error(`Post not found: ${slug}`);
}

export type PostFrontmatter = {
  title?: string;
  description?: string;
  date?: string;
  updated?: string;
  category?: string | string[];
  tags?: string[];
  grade?: string;
  ogImage?: string;
};

export function getAllPosts(): { slug: string; frontmatter: Record<string, unknown> }[] {
  const slugs = getSlugs();
  return slugs.map((slug) => {
    const { frontmatter } = getPostBySlug(slug);
    return { slug, frontmatter };
  });
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

export function getCategories(): string[] {
  const posts = getAllPosts();
  const set = new Set<string>();
  for (const { frontmatter } of posts) {
    for (const c of normalizeCategories(frontmatter)) set.add(c);
  }
  return Array.from(set).sort();
}

export function getTags(): string[] {
  const posts = getAllPosts();
  const set = new Set<string>();
  for (const { frontmatter } of posts) {
    for (const t of normalizeTags(frontmatter)) set.add(t);
  }
  return Array.from(set).sort();
}

export function getPostsByCategory(category: string): { slug: string; frontmatter: Record<string, unknown> }[] {
  return getAllPosts().filter((p) => normalizeCategories(p.frontmatter).includes(category));
}

export function getPostsByTag(tag: string): { slug: string; frontmatter: Record<string, unknown> }[] {
  return getAllPosts().filter((p) => normalizeTags(p.frontmatter).includes(tag));
}
