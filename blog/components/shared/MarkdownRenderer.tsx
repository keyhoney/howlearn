'use client';

import ReactMarkdown, { type Components } from 'react-markdown';
import { AssessmentEmbed } from '@/components/assessments/AssessmentEmbed';
import Link from 'next/link';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

const components: Components = {
  a: ({ href, children, ...props }) => {
    if (href?.startsWith('/')) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
  // @ts-expect-error - custom component for raw HTML <assessmentembed>
  assessmentembed: (props: { slug?: string }) => <AssessmentEmbed slug={props.slug} />,
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
