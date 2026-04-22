'use client';

import ReactMarkdown, { type Components } from 'react-markdown';
import { AssessmentEmbed } from '@/components/assessments/AssessmentEmbed';
import Link from 'next/link';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { slugify, extractTextFromNode } from '@/lib/headings';

interface MarkdownRendererProps {
  content: string;
}

const components: Components = {
  h2: ({ children, ...props }) => {
    const id = slugify(extractTextFromNode(children));
    return <h2 id={id} {...props}>{children}</h2>;
  },
  h3: ({ children, ...props }) => {
    const id = slugify(extractTextFromNode(children));
    return <h3 id={id} {...props}>{children}</h3>;
  },
  a: ({ href, children, ...props }) => {
    if (href?.startsWith('/')) {
      return (
        <Link href={href} prefetch={false} {...props}>
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
