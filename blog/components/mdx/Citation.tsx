import React from "react";

export interface CitationProps {
  /** 참고 문헌 번호 (1-based). 하단 참고 문헌 목록의 ref-1, ref-2 … 와 대응합니다. */
  number?: number | string;
  /** @deprecated number 사용 권장. 단일 문자 prop(n)은 일부 MDX 환경에서 전달이 누락될 수 있음. */
  n?: number | string;
  /** RSC/MDX에서 number prop이 유실될 때 사용. 예: <Citation>2</Citation> */
  children?: React.ReactNode;
}

/**
 * 문장 끝에 붙이는 번호 인용. 클릭 시 글 하단 참고 문헌(ref-n)으로 스크롤 이동.
 * 사용: <Citation number={1} /> 또는 <Citation>2</Citation> (RSC에서 number가 빠질 때)
 */
export function Citation(props: CitationProps) {
  const fromChildren =
    typeof props.children === "string"
      ? props.children.trim()
      : typeof props.children === "number"
        ? String(props.children)
        : undefined;
  const raw = props.number ?? props.n ?? fromChildren;
  const num = Math.max(1, Math.floor(Number(raw)) || 1);
  const id = `ref-${num}`;

  return (
    <a
      href={`#${id}`}
      id={`cite-${num}`}
      className="ml-0.5 text-indigo-600 dark:text-indigo-400 no-underline hover:underline focus:outline-none focus:underline"
      style={{ fontSize: "0.85em", verticalAlign: "super", lineHeight: 0 }}
      aria-label={`참고 문헌 ${num}로 이동`}
      title={`참고 문헌 ${num}`}
    >
      [{num}]
    </a>
  );
}
