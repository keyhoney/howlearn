'use client';

import { useCallback, useEffect, useState } from 'react';
import { toStringArray } from '@/lib/mdx-props';

type CheckboxChecklistProps = {
  title?: string;
  items?: string[] | string | null;
  storageKey?: string;
};

function storageKeySafe(key: string): string {
  return `howlearn-checklist-${key.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

export function CheckboxChecklist({
  title = '오늘 적용해 볼 것',
  items,
  storageKey,
}: CheckboxChecklistProps) {
  const list = toStringArray(items);
  const key = storageKey ? storageKeySafe(storageKey) : null;

  const [checked, setChecked] = useState<boolean[]>(() => {
    if (list.length === 0) return [];
    if (key && typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw) as boolean[];
          if (Array.isArray(parsed) && parsed.length === list.length) return parsed;
        }
      } catch {
        // ignore
      }
    }
    return list.map(() => false);
  });

  useEffect(() => {
    if (!key || list.length === 0) return;
    try {
      localStorage.setItem(key, JSON.stringify(checked));
    } catch {
      // ignore
    }
  }, [key, checked, list.length]);

  const toggle = useCallback(
    (index: number) => {
      setChecked((prev) => {
        if (prev.length !== list.length) return list.map(() => false);
        const next = [...prev];
        if (index >= 0 && index < next.length) next[index] = !next[index];
        return next;
      });
    },
    [list]
  );

  if (list.length === 0) return null;

  const safeChecked = checked.length === list.length ? checked : list.map(() => false);

  return (
    <aside
      className="app-mdx-card my-8 p-6"
      aria-label="실천 체크리스트"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="app-mdx-kicker">
          체크리스트
        </span>
        {title && <h3 className="app-mdx-title font-bold">{title}</h3>}
      </div>
      <div className="space-y-3">
        {list.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className="flex w-full cursor-pointer items-start gap-3 rounded-md border border-transparent px-1 py-1 text-left transition-colors hover:border-[var(--card-border)] hover:bg-[var(--surface-2)]"
          >
            <span
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border transition-colors ${
                safeChecked[i]
                  ? 'border-[var(--accent)] bg-[var(--accent)]'
                  : 'border-[var(--card-border)] bg-[var(--surface-1)]'
              }`}
            >
              {safeChecked[i] && (
                <span className="text-sm text-white" aria-hidden>
                  ✓
                </span>
              )}
            </span>
            <span
              className={`text-[15.5px] leading-7 text-[var(--fg)] md:text-[17px] md:leading-8 ${
                safeChecked[i] ? 'line-through opacity-60' : ''
              }`}
            >
              {item}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-4 text-sm font-medium text-[var(--accent)]">
        {safeChecked.filter(Boolean).length} / {list.length} 완료
      </div>
    </aside>
  );
}
