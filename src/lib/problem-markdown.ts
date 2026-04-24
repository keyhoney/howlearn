import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { rehypeKatexSafeOptions } from './katex-shared';
import { normalizeMathMarkdownSource } from './math-mdx-normalize';
import { remarkDfrac } from './remark-dfrac';

let processorPromise: ReturnType<typeof createMarkdownProcessor> | null = null;

async function getProcessor() {
  if (!processorPromise) {
    processorPromise = createMarkdownProcessor({
      remarkPlugins: [remarkMath, remarkDfrac],
      rehypePlugins: [[rehypeKatex, rehypeKatexSafeOptions]],
      gfm: true,
    });
  }
  return processorPromise;
}

export async function renderTrustedMarkdown(markdown: string): Promise<string> {
  const trimmed = normalizeMathMarkdownSource(markdown).trim();
  if (!trimmed) return '';
  const processor = await getProcessor();
  const { code } = await processor.render(trimmed, {});
  return code;
}

/** `## 문제` 다음부터 다음 `## 제목` 전까지(힌트·풀이 제외). */
export function extractProblemStatementMarkdown(body: string): string {
  const marker = '## 문제';
  const idx = body.indexOf(marker);
  if (idx >= 0) {
    const after = idx + marker.length;
    const rest = body.slice(after);
    const next = rest.search(/\n## [^\n#]/);
    if (next < 0) return rest.trim();
    return rest.slice(0, next).trim();
  }
  let b = body;
  const cuts: number[] = [];
  for (const h of ['힌트', '모범 풀이', '풀이']) {
    const i = b.indexOf(`## ${h}`);
    if (i >= 0) cuts.push(i);
  }
  if (cuts.length === 0) return b.trim();
  return b.slice(0, Math.min(...cuts)).trim();
}

export function extractSection(body: string, headings: string[]): string {
  for (const heading of headings) {
    const marker = `## ${heading}`;
    const start = body.indexOf(marker);
    if (start < 0) continue;
    const next = body.indexOf('\n## ', start + marker.length);
    const chunk = body.slice(start + marker.length, next < 0 ? undefined : next).trim();
    if (chunk) return chunk;
  }
  return '';
}

export function buildHintSteps(hintText: string): string[] {
  if (!hintText) return [];
  const byStepHeading = hintText
    .split(/\n(?=STEP\s*\d+[:.)\-\s])/i)
    .map((v) => v.trim())
    .filter(Boolean);
  if (byStepHeading.length > 1) return byStepHeading;
  return hintText
    .split(/\n{2,}/)
    .map((v) => v.trim())
    .filter(Boolean);
}
