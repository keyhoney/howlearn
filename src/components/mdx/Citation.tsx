import React from 'react';

export interface CitationProps {
  number?: number | string;
  n?: number | string;
  children?: React.ReactNode;
}

export function Citation(props: CitationProps) {
  const fromChildren =
    typeof props.children === 'string'
      ? props.children.trim()
      : typeof props.children === 'number'
        ? String(props.children)
        : undefined;
  const raw = props.number ?? props.n ?? fromChildren;
  const num = Math.max(1, Math.floor(Number(raw)) || 1);
  const id = `ref-${num}`;

  return (
    <a
      href={`#${id}`}
      id={`cite-${num}`}
      className="ml-0.5 text-[var(--accent)] no-underline hover:underline"
      style={{ fontSize: '0.85em', verticalAlign: 'super', lineHeight: 0 }}
      aria-label={`참고 문헌 ${num}로 이동`}
      title={`참고 문헌 ${num}`}
    >
      [{num}]
    </a>
  );
}
