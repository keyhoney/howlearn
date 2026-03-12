"use client";

import { useCallback, useEffect, useState } from "react";
import { toStringArray } from "@/lib/mdx-props";

type CheckboxChecklistProps = {
  title?: string;
  items?: string[] | string | null;
  storageKey?: string;
};

function storageKeySafe(key: string): string {
  return `howlearn-checklist-${key.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}

/**
 * 실천 체크리스트 (ParticipationModule 톤: indigo 박스 + 커스텀 체크). storageKey 지정 시 localStorage 저장.
 */
export function CheckboxChecklist({
  title = "오늘 적용해 볼 것",
  items,
  storageKey,
}: CheckboxChecklistProps) {
  const list = toStringArray(items);
  const key = storageKey ? storageKeySafe(storageKey) : null;

  const [checked, setChecked] = useState<boolean[]>(() => {
    if (list.length === 0) return [];
    if (key && typeof window !== "undefined") {
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

  const safeChecked =
    checked.length === list.length ? checked : list.map(() => false);

  return (
    <aside
      className="my-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-6 shadow-sm dark:border-indigo-900/50 dark:bg-indigo-950/40"
      aria-label="실천 체크리스트"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded bg-indigo-100 px-2 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-900/60 dark:text-indigo-300">
          체크리스트
        </span>
        {title && (
          <h3 className="font-bold text-indigo-900 dark:text-indigo-100">{title}</h3>
        )}
      </div>
      <div className="space-y-3">
        {list.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className="flex w-full cursor-pointer items-start gap-3 rounded-lg text-left transition-colors hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30"
          >
            <span
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border transition-colors ${
                safeChecked[i]
                  ? "border-indigo-500 bg-indigo-500 dark:border-indigo-400 dark:bg-indigo-600"
                  : "border-indigo-200 bg-white group-hover:border-indigo-400 dark:border-indigo-700 dark:bg-indigo-950"
              }`}
            >
              {safeChecked[i] && (
                <span className="text-sm text-white" aria-hidden>
                  ✓
                </span>
              )}
            </span>
            <span
              className={`text-[15.5px] leading-7 text-indigo-900 dark:text-indigo-100 md:text-[17px] md:leading-8 ${
                safeChecked[i] ? "line-through opacity-60" : ""
              }`}
            >
              {item}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
        {safeChecked.filter(Boolean).length} / {list.length} 완료
      </div>
    </aside>
  );
}
