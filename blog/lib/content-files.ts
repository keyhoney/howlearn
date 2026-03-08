import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import type { ContentType } from "./types";

const CONTENT_DIR = "content";
const TYPE_TO_DIR: Record<ContentType, string> = {
  guide: "guides",
  blog: "blog",
  concept: "concepts",
  toolkit: "toolkit",
  book: "books",
};

function getContentDir(type: ContentType): string {
  return join(process.cwd(), CONTENT_DIR, TYPE_TO_DIR[type]);
}

/** YAML에서 문자열을 감싼 따옴표("...", '...')를 제거해 화면에 " 기호가 그대로 나오지 않도록 함 */
function stripYamlQuotes(s: string): string {
  if (s.length < 2) return s;
  if (s.startsWith('"') && s.endsWith('"')) {
    return s.slice(1, -1).replace(/\\"/g, '"');
  }
  if (s.startsWith("'") && s.endsWith("'")) {
    return s.slice(1, -1).replace(/\\'/g, "'");
  }
  return s;
}

function parseMdx(raw: string): { frontmatter: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content: raw };
  const [, fm, content] = match;
  const frontmatter: Record<string, unknown> = {};
  if (fm) {
    for (const line of fm.split(/\r?\n/)) {
      const colon = line.indexOf(":");
      if (colon > 0) {
        const key = line.slice(0, colon).trim();
        let value: unknown = line.slice(colon + 1).trim();
        if (typeof value === "string") {
          if (value.startsWith("[") || value.startsWith("{")) {
            try {
              value = JSON.parse(value);
            } catch {
              // keep as string
            }
          } else {
            // YAML 스타일 따옴표 제거: "..." 또는 '...' → 내부 문자열만 사용
            const trimmed = stripYamlQuotes(value);
            if (trimmed !== value) value = trimmed;
          }
        }
        frontmatter[key] = value;
      }
    }
  }
  return { frontmatter, content: content ?? "" };
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
 * Reads content/{type}/{slug}.mdx and returns frontmatter + raw content, or null if not found.
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
  return parseMdx(raw);
}
