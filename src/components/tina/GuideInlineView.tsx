import React from 'react';
import { tinaField, useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';

interface GuideInlineViewProps {
  query: string;
  variables: Record<string, unknown>;
  data: {
    guides: {
      title: string;
      intro?: string | null;
      body?: unknown;
      tags?: Array<string | null> | null;
      publishedAt?: string | null;
      _sys?: { filename?: string | null } | null;
    };
  };
}

export default function GuideInlineView(props: GuideInlineViewProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  const guide = data?.guides;
  if (!guide) return null;
  const field = (key: 'title' | 'intro' | 'body') => tinaField(guide as any, key);

  return (
    <>
      <div data-inline-marker="guide-react-inline" className="sr-only">guide-inline-active</div>
      <header className="app-card mb-8 p-6">
        <p className="text-sm font-medium text-[var(--accent)]">
          <a href="/guides" className="hover:underline">가이드</a>
          <span className="mx-2 text-[var(--fg-muted)] opacity-50">/</span>
          <span className="text-[var(--fg-muted)]">{guide?._sys?.filename ?? ''}</span>
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--fg)]" data-tina-field={field('title')}>
          {guide.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {guide.publishedAt && <span className="app-chip">{new Date(guide.publishedAt).toLocaleDateString('ko-KR')}</span>}
          {guide.tags?.slice(0, 3).map((t) => t ? <span key={t} className="app-chip">#{t}</span> : null)}
        </div>
        {guide.intro && (
          <p className="mt-5 text-base leading-relaxed text-[var(--fg-muted)]" data-tina-field={field('intro')}>
            {guide.intro}
          </p>
        )}
      </header>

      <div
        className="prose prose-book dark:prose-invert prose-headings:tracking-tight max-w-none app-card p-6"
        data-tina-field={field('body')}
      >
        <TinaMarkdown content={guide.body as any} />
      </div>
    </>
  );
}
