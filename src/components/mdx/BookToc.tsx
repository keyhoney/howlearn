import type { ReactNode } from 'react';
import { extractTextFromNode } from '@/lib/headings';

type BookTocProps = {
  children?: ReactNode;
  /** MDX에서 줄바꿈이 유지된 목차 문자열 */
  text?: string;
};

export function BookToc({ children, text }: BookTocProps) {
  const body = (text ?? extractTextFromNode(children)).trim();
  if (!body) return null;

  return (
    <div
      className="app-mdx-card-muted my-8 px-5 py-6 md:px-6 md:py-7"
      aria-label="목차"
    >
      <div className="whitespace-pre-line text-sm leading-relaxed text-[var(--fg-muted)]">
        {body}
      </div>
    </div>
  );
}
