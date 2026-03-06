export type HeadingItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

/** MDX 소스에서 ##, ### 제목만 추출해 id와 텍스트 반환 */
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
