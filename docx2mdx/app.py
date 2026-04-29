"""
DOCX → MDX 본문 변환기 (Streamlit)

howlearn-astro: Pandoc으로 Word 본문을 Markdown(+KaTeX용 $ / $$)으로 옮긴다.
`src/content/**/*.mdx`는 빌드 시 \\frac→\\dfrac 및 ①~⑤ 한 줄이 자동 정규화된다.

실행 (howlearn-astro 루트):
  pip install -r docx2mdx/requirements.txt
  streamlit run docx2mdx/app.py
"""

from __future__ import annotations

import re
import tempfile
from datetime import datetime
from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components

from converter import (
    build_yaml_frontmatter_block,
    docx_to_markdown_pandoc,
    pandoc_available,
)
from preview_html import build_preview_body_fragment, preview_shell_document

_YAML_FM = re.compile(r"^---\s*\n[\s\S]*?\n---\s*\n")


def _body_for_preview(full: str) -> str:
    m = _YAML_FM.match(full)
    return full[m.end() :] if m else full


def _safe_slug(name: str) -> str:
    return re.sub(r"[^A-Za-z0-9._-]+", "-", name).strip("-") or "docx"


def _make_media_export_target(uploaded_name: str) -> tuple[Path, str]:
    project_root = Path(__file__).resolve().parent.parent
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    stem = _safe_slug(Path(uploaded_name).stem)
    rel = Path("images") / "docx2mdx" / f"{stem}-{stamp}"
    return project_root / "public" / rel, "/" + rel.as_posix()


st.set_page_config(page_title="DOCX → MDX (howlearn-astro)", layout="wide")
st.title("DOCX → MDX")
st.caption(
    "howlearn-astro 본문용 — Pandoc 변환 · 수식 `$` / `$$` · 빌드 시 remark-math / rehype-katex"
)

with st.sidebar:
    st.subheader("Pandoc")
    if pandoc_available():
        st.success("PATH에서 Pandoc을 찾았습니다.")
    else:
        st.error("Pandoc을 PATH에 두거나 설치해 주세요.")
        st.markdown("[설치 안내](https://pandoc.org/installing.html)")

    st.subheader("Frontmatter (선택)")
    use_fm = st.checkbox("YAML 머리말 붙이기", value=False)
    fm_title = st.text_input("title", disabled=not use_fm)
    fm_summary = st.text_input("summary", disabled=not use_fm)
    fm_status = st.selectbox("status", ["draft", "published"], disabled=not use_fm)
    st.subheader("이미지")
    extract_images = st.checkbox("DOCX 이미지 추출", value=True)

uploaded = st.file_uploader("DOCX", type=["docx"])

if not uploaded:
    st.info("`.docx` 파일을 선택하세요.")
    st.stop()

if not pandoc_available():
    st.error("Pandoc이 없어 변환할 수 없습니다.")
    st.stop()

suffix = Path(uploaded.name).suffix
with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
    tmp.write(uploaded.getvalue())
    tmp_path = Path(tmp.name)

try:
    try:
        media_dir = None
        media_prefix = None
        if extract_images:
            media_dir, media_prefix = _make_media_export_target(uploaded.name)
        body = docx_to_markdown_pandoc(
            tmp_path,
            extract_media_dir=media_dir,
            media_url_prefix=media_prefix,
        )
    except RuntimeError as e:
        st.error(str(e))
        st.stop()

    prefix = ""
    if use_fm and fm_title.strip() and fm_summary.strip():
        prefix = build_yaml_frontmatter_block(
            fm_title.strip(),
            fm_summary.strip(),
            status=fm_status,
        )

    display_default = prefix + body
    st.subheader("변환 결과 (편집 가능)")
    edited = st.text_area(
        "MDX 본문",
        value=display_default,
        height=520,
        label_visibility="collapsed",
        key=f"mdx_body__{uploaded.name}__{uploaded.size}",
    )

    preview_source = _body_for_preview(edited)

    st.subheader("미리보기 (사이트와 유사)")
    preview_h = min(1800, max(420, 400 + len(preview_source or "") // 2))
    components.html(
        preview_shell_document(build_preview_body_fragment(preview_source)),
        height=preview_h,
        scrolling=True,
    )

    if extract_images and media_dir is not None and media_prefix is not None:
        st.caption(f"이미지 저장 위치: `{media_dir}`")
        st.caption(f"MDX 참조 경로: `{media_prefix}/media/...`")

finally:
    tmp_path.unlink(missing_ok=True)
