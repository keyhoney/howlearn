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

type HeadingCandidate = { pos: number; level: 2 | 3; text: string };

/** MdxH2 내부 텍스트에서 TOC용 한 줄 제목 (마크다운 굵게 등 제거) */
function mdxH2InnerToTocText(inner: string): string {
  const oneLine = inner.trim().replace(/\s+/g, " ");
  return oneLine
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .trim();
}

/**
 * ## / ### 줄과 `<MdxH2>...</MdxH2>` 블록을 모두 TOC 후보로 수집합니다.
 * MdxH2만 쓰면 ## 가 없어 TOC가 비던 문제를 막기 위함입니다. (id는 MdxH2의 slugify와 동일)
 */
export function extractHeadings(content: string): HeadingItem[] {
  const items: HeadingCandidate[] = [];
  let pos = 0;
  const lines = content.split("\n");
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    if (h2) {
      const text = h2[1].replace(/#+$/, "").trim();
      items.push({ pos, level: 2, text });
    } else if (h3) {
      const text = h3[1].replace(/#+$/, "").trim();
      items.push({ pos, level: 3, text });
    }
    pos += line.length + 1;
  }

  const mdxH2Re = /<MdxH2[^>]*>([\s\S]*?)<\/MdxH2>/g;
  let m: RegExpExecArray | null;
  while ((m = mdxH2Re.exec(content)) !== null) {
    const text = mdxH2InnerToTocText(m[1]);
    if (text) items.push({ pos: m.index, level: 2, text });
  }

  items.sort((a, b) => a.pos - b.pos);

  return items.map(({ level, text }) => ({
    id: slugify(text),
    text,
    level,
  }));
}

export function slugify(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "");
}
