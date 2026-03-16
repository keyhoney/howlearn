import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import type { ContentType } from "./types";

const CONTENT_DIR = "content";
const TYPE_TO_DIR: Record<ContentType, string> = {
  guide: "guides",
  concept: "concepts",
  toolkit: "toolkit",
  book: "books",
};

function getContentDir(type: ContentType): string {
  return join(process.cwd(), CONTENT_DIR, TYPE_TO_DIR[type]);
}

/**
 * MDX 원문에서 frontmatter(--- ... ---)와 본문을 파싱합니다.
 * gray-matter로 YAML 중첩·배열(references 등)을 올바르게 파싱합니다.
 * 이전 단순 줄 단위 파서는 들여쓰기된 key(예: reflectionPrompt 아래 title)를 최상위 key로 넣어
 * 게시글 title이 덮어쓰이는 버그가 있었습니다.
 */
function parseMdx(raw: string): { frontmatter: Record<string, unknown>; content: string } {
  const { data, content } = matter(raw);
  return {
    frontmatter: (data && typeof data === "object" && !Array.isArray(data) ? data : {}) as Record<string, unknown>,
    content: content ?? "",
  };
}

/**
 * Returns slugs of MDX files in content/{type}. Excludes README. Returns [] if directory does not exist.
 */
export function getMdxSlugs(type: ContentType): string[] {
  const dir = getContentDir(type);
  if (!existsSync(dir)) return [];
  try {
    const files = readdirSync(dir);
    return files
      .filter(
        (f) =>
          (f.endsWith(".mdx") || f.endsWith(".md")) && f !== "README.md"
      )
      .map((f) => f.replace(/\.(mdx|md)$/, ""));
  } catch {
    return [];
  }
}

/**
 * RSC/next-mdx-remote에서 number prop이 유실되는 문제 회피:
 * <Citation number={n} /> → <Citation>n</Citation> 로 변환해 번호를 children으로 전달합니다.
 */
function normalizeCitationInMdx(content: string): string {
  return content
    .replace(/<Citation\s+number=\{\s*(\d+)\s*\}\s*\/>/g, "<Citation>$1</Citation>")
    .replace(/<Citation\s+n=\{\s*(\d+)\s*\}\s*\/>/g, "<Citation>$1</Citation>");
}

/**
 * Reads content/{type}/{slug}.mdx and returns frontmatter + raw content, or null if not found.
 * MDX 본문은 Citation 번호 전달 호환을 위해 정규화됩니다.
 */
export function getMdxBySlug(
  type: ContentType,
  slug: string
): { frontmatter: Record<string, unknown>; content: string } | null {
  const dir = getContentDir(type);
  const base = join(dir, slug);
  let raw: string;
  try {
    if (existsSync(base + ".mdx")) {
      raw = readFileSync(base + ".mdx", "utf-8");
    } else if (existsSync(base + ".md")) {
      raw = readFileSync(base + ".md", "utf-8");
    } else {
      return null;
    }
  } catch {
    return null;
  }
  const { frontmatter, content } = parseMdx(raw);
  return {
    frontmatter,
    content: normalizeCitationInMdx(content),
  };
}
