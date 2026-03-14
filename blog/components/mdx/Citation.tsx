import React from "react";

export interface CitationProps {
  /** 참고 문헌 번호 (1-based). 하단 참고 문헌 목록의 ref-1, ref-2 … 와 대응합니다. */
  n: number;
}

/**
 * 문장 끝에 붙이는 번호 인용. 클릭 시 글 하단 참고 문헌(ref-n)으로 스크롤 이동.
 * 사용: <Citation n={1} />
 */
export function Citation({ n }: CitationProps) {
  const num = Math.max(1, Math.floor(Number(n)) || 1);
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
