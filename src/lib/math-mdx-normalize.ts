/**
 * math_howlearn components/MDXRenderer.tsx 와 동일한 소스 전처리.
 * - MDX 문자열용: \frac → \dfrac, ①~⑤ 한 줄 → McqChoices/McqChoiceItem
 * - 마크다운 문자열(문제 지문 HTML 렌더)용: \frac 치환만 적용 (JSX 불가)
 */

/** MDX 안의 `<Question>` 등 JSX 속 `$...$`는 remark에서 inlineMath로 안 잡힐 수 있어 소스 전체에서 치환 */
export function fracToDfracInSource(source: string): string {
  return source.replace(/\\frac/g, '\\dfrac');
}

const MCQ_LABEL_BODY = /^([①②③④⑤])\s*([\s\S]*)$/;

/**
 * 한 줄에 `① … ② … ⑤ …` 형태의 5지선다를 `<McqChoices>` + `<McqChoiceItem>`으로 바꾼다.
 * (math_howlearn MDXRenderer.wrapFiveChoiceLineInMdx 와 동일)
 */
export function wrapFiveChoiceLineInMdx(source: string): string {
  return source
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed.startsWith('①')) return line;
      const parts = trimmed.split(/(?=[②③④⑤]\s)/);
      if (parts.length !== 5) return line;
      if (!parts[0].startsWith('①')) return line;
      const indent = line.match(/^\s*/)?.[0] ?? '';
      const items = parts
        .map((p) => {
          const m = MCQ_LABEL_BODY.exec(p.trim());
          if (!m) return null;
          const [, lab, body] = m;
          const inner = body.trim();
          return `${indent}<McqChoiceItem label="${lab}">${inner}</McqChoiceItem>`;
        })
        .filter(Boolean)
        .join('\n\n');
      if (!items) return line;
      return `${indent}<McqChoices>\n\n${items}\n\n${indent}</McqChoices>`;
    })
    .join('\n');
}

/** MDX 파일 본문용 (import 없이 치환만; import는 Vite 플러그인에서 추가) */
export function normalizeMathMdxFileBody(source: string): string {
  return wrapFiveChoiceLineInMdx(fracToDfracInSource(source));
}

/** 순수 마크다운(문제 지문·힌트 HTML)용 — JSX 래핑 없음 */
export function normalizeMathMarkdownSource(source: string): string {
  return fracToDfracInSource(source);
}
