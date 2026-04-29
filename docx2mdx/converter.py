"""
DOCX → MDX 본문 (Markdown).

howlearn-astro는 remark-math + rehype-katex이며, `src/content/**/*.mdx`는
Vite 플러그인에서 \\frac→\\dfrac·①~⑤ 한 줄 래핑을 추가로 적용한다.
Pandoc 출력은 tex_math_dollars( $ / $$ ) 기준으로 맞춘다.
"""

from __future__ import annotations

import re
import shutil
import subprocess
from pathlib import Path

from PIL import Image, UnidentifiedImageError


def _flatten_to_rgb(im: Image.Image) -> Image.Image:
    """투명 채널이 있으면 흰 배경 위에 합성한 뒤 RGB로 만든다."""
    has_alpha = im.mode in {"RGBA", "LA"} or (
        im.mode == "P" and "transparency" in im.info
    )
    if has_alpha:
        rgba = im.convert("RGBA")
        rgb = Image.new("RGB", rgba.size, (255, 255, 255))
        rgb.paste(rgba, mask=rgba.split()[-1])
        return rgb
    return im.convert("RGB")


def _otsu_threshold(hist: list[int], pixel_count: int) -> int:
    """히스토그램으로 Otsu 임계값(0~255). 실패 시 128."""
    if pixel_count <= 0:
        return 128
    sum_total = sum(i * hist[i] for i in range(256))
    sum_b = 0
    w_b = 0
    max_sigma = -1.0
    threshold = 127
    for t in range(256):
        w_b += hist[t]
        if w_b == 0:
            continue
        w_f = pixel_count - w_b
        if w_f == 0:
            break
        sum_b += t * hist[t]
        m_b = sum_b / w_b
        m_f = (sum_total - sum_b) / w_f
        sigma = w_b * w_f * (m_b - m_f) ** 2
        if sigma > max_sigma:
            max_sigma = sigma
            threshold = t
    if max_sigma <= 0:
        return 128
    return int(threshold)


def _to_binary_bw_rgb(im: Image.Image, *, threshold: int | None = None) -> Image.Image:
    """
    순수 흑(#000)과 백(#FFF)만 갖는 RGB 이미지.
    threshold가 None이면 Otsu 자동, 아니면 해당 값(0~255)으로 이진화.
    """
    gray = _flatten_to_rgb(im).convert("L")
    n = gray.size[0] * gray.size[1]
    t = (
        max(0, min(255, threshold))
        if threshold is not None
        else _otsu_threshold(gray.histogram(), n)
    )
    bw = gray.point(lambda p, tt=t: 255 if p > tt else 0)
    return bw.convert("RGB")


def pandoc_available() -> bool:
    return shutil.which("pandoc") is not None


def docx_to_markdown_pandoc(
    docx_path: Path,
    *,
    extract_media_dir: Path | None = None,
    media_url_prefix: str | None = None,
) -> str:
    cmd = [
        "pandoc",
        str(docx_path),
        "-f",
        "docx",
        "-t",
        "markdown+tex_math_dollars+pipe_tables+raw_html",
        "--wrap=none",
        "--markdown-headings=atx",
    ]
    if extract_media_dir is not None:
        extract_media_dir.mkdir(parents=True, exist_ok=True)
        cmd.extend(["--extract-media", str(extract_media_dir)])
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if r.returncode != 0:
        raise RuntimeError(r.stderr or "pandoc 실행에 실패했습니다.")
    out = postprocess_for_webapp(r.stdout)
    media_rename_map: dict[str, str] = {}
    if extract_media_dir is not None:
        media_rename_map = _convert_extracted_media_to_webp(extract_media_dir)
    if media_url_prefix:
        out = _rewrite_pandoc_image_links(out, media_url_prefix, media_rename_map)
    return out


def postprocess_for_webapp(md: str) -> str:
    """줄바꿈 정리 및 공백 정돈 (math_howlearn docx2mdx와 동일 의도)."""
    text = md.replace("\r\n", "\n").replace("\r", "\n")
    text = text.strip()
    text = _normalize_inline_math_delimiters(text)
    text = _replace_thin_space_comma_in_math(text)
    text = _normalize_lim_and_frac_for_katex(text)
    text = _normalize_binom_to_ncr(text)
    text = _promote_display_math_for_major_operators(text)
    text = _remove_hardbreak_after_math_only_line(text)
    text = _split_adjacent_inline_dollar_delimiters(text)
    text = _normalize_angle_brackets_for_webapp(text)
    text = _remove_image_size_attributes(text)
    return text + "\n" if text else ""


_CHAIN_AFTER_DDOLLAR = re.compile(
    r"([\]\)}0-9])\s*\$\$(\s*)(?=[-+=±∓×÷≤≥≈≠⟨⟩]|\s*\\(?:times|cdot|pm|mp)\b)"
)
_INLINE_MATH = re.compile(r"\$(?!\$)([^\n$]+?)\$(?!\$)")
_DISPLAY_OPERATOR = re.compile(
    r"\\(?:lim|sum|int|iint|iiint|oint|prod|coprod|bigcup|bigcap|bigsqcup|bigvee|bigwedge|bigoplus|bigotimes|bigodot|biguplus)(?=[^A-Za-z]|$)|Σ|∑|∫|∮"
)
_BINOM_PATTERN = re.compile(r"\\binom\s*\{([^{}]+)\}\s*\{([^{}]+)\}")
_MATH_LINE_HARDBREAK = re.compile(r"^(\s*\$(?!\$)[\s\S]*?\$(?!\$)\s*)\\\s*$")
_MD_IMAGE = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)")
_IMAGE_ATTR_BLOCK = re.compile(r"(!\[[^\]]*]\([^)]+\))\s*\{[^}\n]*\}")

# Pandoc/Word가 수식 속 공백을 \, 로 넣으면 KaTeX에서 오류·경고가 나는 경우가 있어 제거한다.
_THIN_SPACE_COMMA = re.compile(r"\\,")


def _replace_thin_space_comma_in_math(text: str) -> str:
    """
    수식 구간(`$...$`, `$$...$$`) 안의 LaTeX 얇은 공백 `\\,`를 일반 공백 한 칸으로 바꾼다.
    Word→DOCX→Pandoc 과정에서 삽입되는 `\\,`는 KaTeX strict 렌더와 충돌할 수 있다.
    """

    def fix_display(m: re.Match[str]) -> str:
        inner = _THIN_SPACE_COMMA.sub(" ", m.group(1))
        return "$$" + inner + "$$"

    text = re.sub(r"\$\$([\s\S]*?)\$\$", fix_display, text)

    def fix_inline(m: re.Match[str]) -> str:
        inner = _THIN_SPACE_COMMA.sub(" ", m.group(1))
        return "$" + inner + "$"

    return re.sub(r"\$(?!\$)([^\n$]+?)\$(?!\$)", fix_inline, text)


def _normalize_lim_and_frac_for_katex(text: str) -> str:
    text = re.sub(r"\\lim_{", r"\\lim\\limits_{", text)

    def fix_lim_inner(inner: str) -> str:
        s = inner.strip()
        # 앞 단계에서 \\, → 공백 처리 후에도 동작하도록 공백만 유연하게 인정한다.
        if re.fullmatch(r"h\s+\\rightarrow\s+0", s):
            return r"h \rightarrow 0"
        if re.fullmatch(r"h\s+\\to\s+0", s):
            return r"h \rightarrow 0"
        if re.fullmatch(r"h\s*\\to\s*0", s):
            return r"h \rightarrow 0"
        if re.fullmatch(r"h\s*\\rightarrow\s*0", s):
            return r"h \rightarrow 0"
        return inner

    def fix_lim_block(m: re.Match) -> str:
        inner = fix_lim_inner(m.group(1))
        return f"\\lim\\limits_{{{inner}}}"

    text = re.sub(r"\\lim\\limits_\{([^}]*)\}", fix_lim_block, text)

    text = re.sub(
        r"(\\lim\\limits_\{[^}]+\})\\(?:frac|tfrac|dfrac)\b",
        lambda m: m.group(1) + r"\ " + r"\frac",
        text,
    )
    return text


def _split_adjacent_inline_dollar_delimiters(text: str) -> str:
    return _CHAIN_AFTER_DDOLLAR.sub(r"\1 $ $\2", text)


def _promote_display_math_for_major_operators(text: str) -> str:
    """
    \\lim, \\sum, \\int 계열은 인라인을 유지하되 \\displaystyle 스타일을 적용한다.
    이미 $$...$$ 인 블록은 _INLINE_MATH 정규식에 잡히지 않으므로 그대로 유지된다.
    """

    def repl(m: re.Match) -> str:
        body = _trim_math_edge_spacing_commands(m.group(1).strip())
        if not _DISPLAY_OPERATOR.search(body):
            return m.group(0)
        if body.startswith(r"\displaystyle"):
            return m.group(0)
        return f"${r'\displaystyle '}{body}$"

    return _INLINE_MATH.sub(repl, text)


def _normalize_binom_to_ncr(text: str) -> str:
    """
    조합 표기를 \binom{n}{r} 대신 좌첨자형 {}_{n}C_{r}로 통일한다.
    """
    return _BINOM_PATTERN.sub(
        lambda m: f"{{}}_{{{m.group(1).strip()}}}C_{{{m.group(2).strip()}}}",
        text,
    )


def _trim_math_edge_spacing_commands(body: str) -> str:
    """
    인라인 수식 양끝에 붙는 LaTeX 공백 명령(\\,, \\;, \\!, \\quad 등)을 제거한다.
    Word/Pandoc 변환 잔여물을 줄여 수식 표시를 깔끔하게 유지한다.
    """
    # leading spacing commands
    body = re.sub(r"^(?:\\,|\\;|\\!|\\:|\\quad|\\qquad)\s*", "", body)
    # trailing spacing commands
    body = re.sub(r"\s*(?:\\,|\\;|\\!|\\:|\\quad|\\qquad)+$", "", body)
    return body.strip()


def _remove_hardbreak_after_math_only_line(text: str) -> str:
    """
    `$...$\\` 형태의 수식 단독 줄에서 Pandoc hard break(`\\`)를 제거한다.
    """
    out: list[str] = []
    for line in text.split("\n"):
        m = _MATH_LINE_HARDBREAK.match(line)
        out.append(m.group(1).rstrip() if m else line)
    return "\n".join(out)


def _normalize_inline_math_delimiters(text: str) -> str:
    def bracket_to_display(m: re.Match) -> str:
        inner = m.group(1).strip()
        if re.fullmatch(r"\d+점", inner):
            return m.group(0)
        return f"$$\n{inner}\n$$"

    text = re.sub(
        r"\\\[\s*([\s\S]*?)\s*\\]",
        bracket_to_display,
        text,
    )
    text = re.sub(
        r"\\\(\s*([\s\S]*?)\s*\\\)",
        lambda m: f"${m.group(1).strip()}$",
        text,
    )
    return text


def _normalize_angle_brackets_for_webapp(text: str) -> str:
    """
    DOCX/Pandoc 수식에서 생성되는 \\langle, \\rangle를
    일반 부등호 문자(<, >)로 통일한다.
    """
    text = re.sub(r"\\langle\b", "<", text)
    text = re.sub(r"\\rangle\b", ">", text)
    return text


def _remove_image_size_attributes(text: str) -> str:
    """
    Pandoc 이미지 속성 블록({width="..." height="..."})을 제거한다.
    크기 지정을 하지 않고 기본 렌더 크기를 사용한다.
    """
    return _IMAGE_ATTR_BLOCK.sub(r"\1", text)


def _rewrite_pandoc_image_links(
    text: str,
    media_url_prefix: str,
    media_rename_map: dict[str, str] | None = None,
) -> str:
    """
    Pandoc가 생성한 로컬 이미지 링크를 웹 경로(/images/...)로 바꾼다.
    - http(s), data:, # 링크는 유지
    - media/... 또는 .../media/... 경로만 치환
    - media_rename_map이 있으면 변환 전 파일명 -> .webp 파일명으로 치환한다.
    """
    prefix = media_url_prefix.rstrip("/")
    rename_map = media_rename_map or {}

    def repl(m: re.Match) -> str:
        alt = m.group(1)
        payload = m.group(2).strip()

        if not payload:
            return m.group(0)

        # 경로 + (선택) title 분리
        path_part = payload
        suffix = ""
        quote_i = payload.find(' "')
        if quote_i != -1 and payload.endswith('"'):
            path_part = payload[:quote_i].strip()
            suffix = payload[quote_i:]

        normalized = path_part.replace("\\", "/")
        low = normalized.lower()
        if low.startswith(("http://", "https://", "data:", "#", "/")):
            return m.group(0)

        media_idx = low.find("/media/")
        if media_idx != -1:
            rel_tail = normalized[media_idx + 1 :]
        elif low.startswith("media/"):
            rel_tail = normalized
        else:
            return m.group(0)

        rewritten_tail = rename_map.get(rel_tail, rel_tail)
        web_path = f"{prefix}/{rewritten_tail}"
        return f"![{alt}]({web_path}{suffix})"

    return _MD_IMAGE.sub(repl, text)


def _convert_extracted_media_to_webp(extract_media_dir: Path) -> dict[str, str]:
    """
    Pandoc 추출 이미지(media/*)를 전부 .webp로 변환하고 매핑을 반환한다.
    저장 시 이진 흑·백(임계값은 Otsu 자동)으로 통일한다.
    반환 예: {"media/image1.png": "media/image1.webp"}
    """
    media_root = extract_media_dir / "media"
    if not media_root.exists():
        return {}

    mapping: dict[str, str] = {}
    for p in sorted(media_root.rglob("*")):
        if not p.is_file():
            continue
        rel = p.relative_to(extract_media_dir).as_posix()
        ext = p.suffix.lower()
        if ext == ".webp":
            try:
                with Image.open(p) as im:
                    converted = _to_binary_bw_rgb(im)
                converted.save(p, format="WEBP", lossless=True, method=6)
            except (UnidentifiedImageError, OSError) as e:
                raise RuntimeError(
                    f"이미지 WebP 이진 흑백 변환 실패: {p.name} ({e})"
                ) from e
            mapping[rel] = rel
            continue

        dst = p.with_suffix(".webp")
        dst_rel = dst.relative_to(extract_media_dir).as_posix()
        try:
            with Image.open(p) as im:
                converted = _to_binary_bw_rgb(im)
                converted.save(dst, format="WEBP", lossless=True, method=6)
            p.unlink(missing_ok=True)
            mapping[rel] = dst_rel
        except (UnidentifiedImageError, OSError) as e:
            raise RuntimeError(
                f"이미지 WebP 변환 실패: {p.name} ({e})"
            ) from e

    return mapping


def build_yaml_frontmatter_block(
    title: str,
    summary: str,
    *,
    status: str = "draft",
) -> str:
    """가이드/칼럼 등에 붙일 수 있는 최소 YAML (따옴표 이스케이프)."""
    title_esc = title.replace('"', '\\"')
    summary_esc = summary.replace('"', '\\"')
    return f"""---
title: "{title_esc}"
summary: "{summary_esc}"
status: {status}
---
"""
