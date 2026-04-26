import React from 'react';
import { tinaField, useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';

interface ConceptInlineViewProps {
  query: string;
  variables: Record<string, unknown>;
  data: {
    concepts: {
      title: string;
      summary: string;
      shortDefinition: string;
      englishName?: string | null;
      body?: unknown;
      tags?: Array<string | null> | null;
      publishedAt?: string | null;
      _sys?: { filename?: string | null } | null;
    };
  };
}

export default function ConceptInlineView(props: ConceptInlineViewProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  const concept = data?.concepts;
  if (!concept) return null;
  const field = (key: 'title' | 'shortDefinition' | 'summary' | 'body') => tinaField(concept as any, key);

  return (
    <>
      <header className="app-card mb-8 p-6">
        <p className="text-sm font-medium text-[var(--accent)]">
          <a href="/concepts" className="hover:underline">개념</a>
          <span className="mx-2 text-[var(--fg-muted)] opacity-50">/</span>
          <span className="text-[var(--fg-muted)]">{concept?._sys?.filename ?? ''}</span>
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--fg)]" data-tina-field={field('title')}>
          {concept.title}
        </h1>
        {concept.englishName && <p className="mt-1 text-sm italic text-[var(--fg-muted)]">{concept.englishName}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          {concept.publishedAt && <span className="app-chip">{new Date(concept.publishedAt).toLocaleDateString('ko-KR')}</span>}
          {concept.tags?.slice(0, 3).map((t) => t ? <span key={t} className="app-chip">#{t}</span> : null)}
        </div>
        <p className="mt-5 rounded-sm border border-[color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface-2))] px-4 py-3 text-base leading-relaxed text-[var(--fg)]">
          <span className="font-semibold text-[var(--accent)]">짧은 정의</span>
          <span className="mt-1 block whitespace-pre-wrap" data-tina-field={field('shortDefinition')}>
            {concept.shortDefinition}
          </span>
        </p>
        <p className="mt-4 text-base leading-relaxed text-[var(--fg-muted)]" data-tina-field={field('summary')}>
          {concept.summary}
        </p>
      </header>

      <div
        className="prose prose-book dark:prose-invert prose-headings:tracking-tight max-w-none app-card p-6"
        data-tina-field={field('body')}
      >
        <TinaMarkdown content={concept.body as any} />
      </div>
    </>
  );
}
