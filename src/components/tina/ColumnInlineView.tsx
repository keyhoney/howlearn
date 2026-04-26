import React from 'react';
import { tinaField, useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';

interface ColumnInlineViewProps {
  query: string;
  variables: Record<string, unknown>;
  data: {
    columns: {
      title: string;
      summary: string;
      body?: unknown;
      tags?: Array<string | null> | null;
      publishedAt?: string | null;
      _sys?: { filename?: string | null } | null;
    };
  };
}

export default function ColumnInlineView(props: ColumnInlineViewProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  const column = data?.columns;
  if (!column) return null;
  const field = (key: 'title' | 'summary' | 'body') => tinaField(column as any, key);

  return (
    <>
      <header className="not-prose app-card mb-8 p-6">
        <p className="text-sm font-medium text-[var(--accent)]">
          <a href="/columns" className="hover:underline">칼럼</a>
          <span className="mx-2 text-[var(--fg-muted)] opacity-50">/</span>
          <span className="text-[var(--fg-muted)]">{column?._sys?.filename ?? ''}</span>
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--fg)]" data-tina-field={field('title')}>
          {column.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {column.publishedAt && <span className="app-chip">{new Date(column.publishedAt).toLocaleDateString('ko-KR')}</span>}
          {column.tags?.slice(0, 3).map((t) => t ? <span key={t} className="app-chip">#{t}</span> : null)}
        </div>
        <p className="mt-6 text-lg leading-relaxed text-[var(--fg-muted)]" data-tina-field={field('summary')}>
          {column.summary}
        </p>
      </header>

      <div
        className="prose prose-book dark:prose-invert prose-headings:tracking-tight max-w-none app-card p-6"
        data-tina-field={field('body')}
      >
        <TinaMarkdown content={column.body as any} />
      </div>
    </>
  );
}
