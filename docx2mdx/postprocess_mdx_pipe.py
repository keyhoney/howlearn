"""
표준 입력으로 Markdown/MDX 본문을 받아 웹앱용 후처리 후 표준 출력으로 낸다.

  pandoc ... | python postprocess_mdx_pipe.py > out.mdx

howlearn-astro 루트 또는 docx2mdx 폴더에서 실행하면 된다.
"""

from __future__ import annotations

import sys
from pathlib import Path

_ROOT = Path(__file__).resolve().parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

import converter  # noqa: E402


def main() -> None:
    text = sys.stdin.read()
    sys.stdout.write(converter.postprocess_for_webapp(text))


if __name__ == "__main__":
    main()
