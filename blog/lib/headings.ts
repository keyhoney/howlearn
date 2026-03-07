import type { ReactNode } from "react";

export type HeadingItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

/** React 노드에서 순수 텍스트만 추출 (TOC id와 동일한 slug 생성용) */
export function extractTextFromNode(node: ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractTextFromNode).join("");
  if (typeof node === "object" && "props" in node && node.props && typeof node.props === "object" && "children" in node.props)
    return extractTextFromNode((node.props as { children?: ReactNode }).children);
  return "";
}

/** Extract ## and ### headings from markdown string; return id and text */
export function extractHeadings(content: string): HeadingItem[] {
  const lines = content.split("\n");
  const out: HeadingItem[] = [];
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    if (h2) {
      const text = h2[1].replace(/#+$/, "").trim();
      out.push({ id: slugify(text), text, level: 2 });
    } else if (h3) {
      const text = h3[1].replace(/#+$/, "").trim();
      out.push({ id: slugify(text), text, level: 3 });
    }
  }
  return out;
}

export function slugify(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "");
}
