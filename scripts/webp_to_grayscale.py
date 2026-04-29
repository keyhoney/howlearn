"""
`public/images` 아래의 모든 .webp를 제자리에서 이진 흑·백(픽셀은 #000 또는 #FFF만)으로 다시 저장한다.
임계값은 기본적으로 Otsu 자동. 고정값을 쓰려면 `--threshold`를 지정한다.

사용 (프로젝트 루트 howlearn-astro에서):

  python scripts/webp_to_grayscale.py
  python scripts/webp_to_grayscale.py --threshold 180

의존: Pillow (docx2mdx와 동일)
  pip install Pillow
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image, UnidentifiedImageError

_ROOT = Path(__file__).resolve().parent.parent
_docx2mdx = _ROOT / "docx2mdx"
if str(_docx2mdx) not in sys.path:
    sys.path.insert(0, str(_docx2mdx))

from converter import _to_binary_bw_rgb  # noqa: E402


def webp_to_blackwhite_inplace(path: Path, *, threshold: int | None = None) -> None:
    with Image.open(path) as im:
        out = _to_binary_bw_rgb(im, threshold=threshold)
        # 손실 압축은 이진 픽셀 주변에 회색을 만들 수 있어 무손실로 저장
        out.save(path, format="WEBP", lossless=True, method=6)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="WebP를 순수 흑·백(이진)으로 제자리 변환"
    )
    parser.add_argument(
        "root",
        nargs="?",
        default="public/images",
        type=Path,
        help="검색 루트 (기본: public/images)",
    )
    parser.add_argument(
        "--threshold",
        type=int,
        default=None,
        help="고정 임계값 0~255 (미지정 시 Otsu 자동)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="변환하지 않고 대상 파일만 출력",
    )
    args = parser.parse_args()
    root: Path = args.root
    thr: int | None = args.threshold
    if thr is not None and not 0 <= thr <= 255:
        print("--threshold 는 0~255 여야 합니다.", file=sys.stderr)
        return 1

    if not root.is_dir():
        print(f"폴더가 없습니다: {root.resolve()}", file=sys.stderr)
        return 1

    paths = sorted(root.rglob("*.webp"))
    if not paths:
        print(f".webp 파일 없음: {root.resolve()}")
        return 0

    ok = 0
    for p in paths:
        if args.dry_run:
            print(p.as_posix())
            ok += 1
            continue
        try:
            webp_to_blackwhite_inplace(p, threshold=thr)
            ok += 1
            print(f"OK {p.as_posix()}")
        except (UnidentifiedImageError, OSError, ValueError) as e:
            print(f"FAIL {p.as_posix()}: {e}", file=sys.stderr)

    print(f"완료 {ok}/{len(paths)}")
    return 0 if ok == len(paths) else 2


if __name__ == "__main__":
    raise SystemExit(main())
