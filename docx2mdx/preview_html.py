"""
Streamlit 미리보기: KaTeX auto-render.

본문은 howlearn-astro의 math-mdx-normalize(frac, ①~⑤ 한 줄)와 비슷하게 보이도록
HTML 그리드로 5지선다를 표현한다. 실제 빌드 시에는 McqChoices 컴포넌트로 변환된다.
"""

from __future__ import annotations

import base64
import html
import re

_MCQ_LABEL_BODY = re.compile(r"^([①②③④⑤])\s*([\s\S]*)$")
_MCQ_SPLIT = re.compile(r"(?=[②③④⑤]\s)")
_MD_IMAGE = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)")


def frac_to_dfrac_source(s: str) -> str:
    return re.sub(r"\\frac", r"\\dfrac", s)


def _line_to_mcq_html(line: str) -> str | None:
    trimmed = line.strip()
    if not trimmed.startswith("①"):
        return None
    parts = _MCQ_SPLIT.split(trimmed)
    if len(parts) != 5 or not parts[0].startswith("①"):
        return None
    items: list[str] = []
    for p in parts:
        m = _MCQ_LABEL_BODY.match(p.strip())
        if not m:
            return None
        lab, body = m.group(1), m.group(2).strip()
        items.append(
            '<div class="mcq-item">'
            f'<span class="mcq-item-label">{html.escape(lab)}</span>'
            f'<div class="mcq-item-body">{body}</div>'
            "</div>"
        )
    return '<div class="mcq-grid">' + "".join(items) + "</div>"


def _apply_mcq_lines(s: str) -> str:
    lines = s.split("\n")
    out: list[str] = []
    for line in lines:
        h = _line_to_mcq_html(line)
        out.append(h if h else line)
    return "\n".join(out)


def _shield_math(s: str) -> tuple[str, list[str]]:
    store: list[str] = []

    def put(m: re.Match[str]) -> str:
        store.append(m.group(0))
        return f"\ufffcM{len(store) - 1}\ufffc"

    s = re.sub(r"\$\$[\s\S]*?\$\$", put, s)
    s = re.sub(r"\$[^\n$]+\$", put, s)
    return s, store


def _unshield_math(s: str, store: list[str]) -> str:
    for i, chunk in enumerate(store):
        s = s.replace(f"\ufffcM{i}\ufffc", chunk)
    return s


def _escape_chunk_preserve_math(chunk: str) -> str:
    chunk = chunk.strip()
    if not chunk:
        return ""
    if chunk.startswith('<div class="mcq-grid">'):
        return chunk
    chunk = chunk.replace("\n", "<br />\n")
    s, store = _shield_math(chunk)
    s = html.escape(s)
    s = _unshield_math(s, store)
    return _render_markdown_images(s)


def _render_markdown_images(s: str) -> str:
    """간단한 Markdown 이미지 문법을 HTML <img>로 렌더한다."""

    def repl(m: re.Match[str]) -> str:
        alt = html.escape(m.group(1).strip())
        payload = m.group(2).strip()
        if not payload:
            return m.group(0)

        src = payload
        quote_i = payload.find(' "')
        if quote_i != -1 and payload.endswith('"'):
            src = payload[:quote_i].strip()
        src = src.replace("&amp;", "&")
        if not src:
            return m.group(0)
        safe_src = html.escape(src, quote=True)
        return (
            f'<img src="{safe_src}" alt="{alt}" '
            'style="max-width:100%;height:auto;display:block;margin:0.5rem 0;" />'
        )

    return _MD_IMAGE.sub(repl, s)


def _simple_bold(s: str) -> str:
    return re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)


def build_preview_body_fragment(md: str) -> str:
    """본문만 (KaTeX가 $…$/$$…$$ 를 렌더)."""
    t = frac_to_dfrac_source(md)
    t = _apply_mcq_lines(t)
    blocks = re.split(r"\n\s*\n", t)
    parts: list[str] = []
    for b in blocks:
        b = b.strip()
        if not b:
            continue
        if b.startswith('<div class="mcq-grid">'):
            parts.append(b)
        else:
            parts.append(f"<p>{_simple_bold(_escape_chunk_preserve_math(b))}</p>")
    return "\n".join(parts)


def preview_shell_document(inner_html: str) -> str:
    b64 = base64.b64encode(inner_html.encode("utf-8")).decode("ascii")
    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" crossorigin="anonymous" />
  <style>
    body {{
      margin: 0;
      padding: 12px 16px 24px;
      font-family: ui-sans-serif, system-ui, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
      font-size: 1rem;
      line-height: 1.625;
      color: #1e293b;
      background: #fff;
    }}
    .preview-prose {{
      max-width: none;
    }}
    .preview-prose p {{
      margin: 0 0 1em;
    }}
    .preview-prose p:last-child {{ margin-bottom: 0; }}
    .mcq-grid {{
      display: grid;
      gap: 8px;
      margin: 1.25rem 0;
      grid-template-columns: 1fr;
    }}
    @media (min-width: 640px) {{
      .mcq-grid {{ grid-template-columns: repeat(2, minmax(0, 1fr)); }}
    }}
    @media (min-width: 1024px) {{
      .mcq-grid {{ grid-template-columns: repeat(3, minmax(0, 1fr)); }}
    }}
    .mcq-item {{
      display: flex;
      flex-direction: row;
      align-items: stretch;
      min-height: 3rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      padding: 0.75rem;
      background: linear-gradient(to bottom, #fff, rgba(248, 250, 252, 0.9));
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      color: #1e293b;
    }}
    .mcq-item-label {{
      flex: none;
      width: 2.25rem;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-family: ui-serif, Georgia, serif;
      font-size: 1.125rem;
      line-height: 1;
      color: #64748b;
    }}
    .mcq-item-body {{
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      line-height: 1.375;
    }}
    .mcq-item-body .katex {{ font-size: 1.05em; }}
    .katex-display {{ margin: 0.75em 0; overflow-x: auto; }}
  </style>
</head>
<body>
  <div id="preview" class="preview-prose"></div>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js" crossorigin="anonymous"></script>
  <script>
    (function() {{
      function b64ToUtf8(b64) {{
        var bin = atob(b64);
        var u8 = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
        return new TextDecoder("utf-8").decode(u8);
      }}
      var el = document.getElementById("preview");
      try {{
        el.innerHTML = b64ToUtf8("{b64}");
      }} catch (e) {{
        el.textContent = "미리보기 디코딩 오류";
        return;
      }}
      if (typeof renderMathInElement !== "undefined") {{
        renderMathInElement(el, {{
          delimiters: [
            {{ left: "$$", right: "$$", display: true }},
            {{ left: "$", right: "$", display: false }},
          ],
          throwOnError: false,
          strict: "warn",
          errorColor: "#cc0000",
        }});
      }}
    }})();
  </script>
</body>
</html>"""
