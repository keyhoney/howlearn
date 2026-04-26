import React from 'react';
import { tinaField, useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';

interface BookInlineViewProps {
  query: string;
  variables: Record<string, unknown>;
  data: {
    books: {
      title: string;
      summary: string;
      subtitle?: string | null;
      body?: unknown;
      publishedAt?: string | null;
      purchaseLinks?: Array<{ label: string; href: string } | null> | null;
      _sys?: { filename?: string | null } | null;
    };
  };
}

export default function BookInlineView(props: BookInlineViewProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  const book = data?.books;
  if (!book) return null;
  const field = (key: 'title' | 'subtitle' | 'summary' | 'body') => tinaField(book as any, key);

  return (
    <>
      <header className="not-prose app-card mb-8 p-6">
        <p className="text-sm font-medium text-[var(--accent)]">
          <a href="/books" className="hover:underline">도서</a>
          <span className="mx-2 text-[var(--fg-muted)] opacity-50">/</span>
          <span className="text-[var(--fg-muted)]">{book?._sys?.filename ?? ''}</span>
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--fg)]" data-tina-field={field('title')}>
          {book.title}
        </h1>
        {book.subtitle && (
          <p className="mt-2 text-lg text-[var(--fg-muted)]" data-tina-field={field('subtitle')}>
            {book.subtitle}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {book.publishedAt && <span className="app-chip">{new Date(book.publishedAt).toLocaleDateString('ko-KR')}</span>}
        </div>
        <p className="mt-6 text-lg leading-relaxed text-[var(--fg-muted)]" data-tina-field={field('summary')}>
          {book.summary}
        </p>
        {book.purchaseLinks && book.purchaseLinks.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {book.purchaseLinks.map((link, idx) => (
              link ? (
                <a
                  key={`${link.href}-${idx}`}
                  href={link.href}
                  className="app-btn-outline-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ) : null
            ))}
          </div>
        )}
      </header>

      <div
        className="prose prose-book dark:prose-invert prose-headings:tracking-tight max-w-none app-card p-6"
        data-tina-field={field('body')}
      >
        <TinaMarkdown content={book.body as any} />
      </div>
    </>
  );
}
