"use client";

import { useState, useCallback } from "react";
import { List, X } from "lucide-react";
import { TableOfContents } from "@/components/TableOfContents";
import type { HeadingItem } from "@/lib/headings";

interface TocFloatingMobileProps {
  headings: HeadingItem[];
}

/**
 * 모바일·태블릿 전용 플로팅 목차 버튼 및 접이식 패널.
 * lg 이상에서는 ContentDetail의 사이드바 TOC가 표시되므로 lg:hidden으로 비노출.
 * position: fixed 사용으로 레이아웃 흐름에 관여하지 않아 CLS를 유발하지 않음.
 */
export function TocFloatingMobile({ headings }: TocFloatingMobileProps) {
  const [open, setOpen] = useState(false);
  const list = Array.isArray(headings) ? headings : [];
  const close = useCallback(() => setOpen(false), []);

  if (list.length === 0) return null;

  return (
    <>
      {/* 플로팅 버튼: 고정 크기(48px)로 CLS 방지, lg에서 숨김 */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[50] flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-lg transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 lg:hidden"
        aria-label="목차 열기"
      >
        <List className="h-5 w-5 text-slate-700 dark:text-slate-300" aria-hidden />
      </button>

      {/* 백드롭 + 패널: open 시에만 렌더하여 접근성·애니메이션 처리 단순화 */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/30 lg:hidden"
            aria-hidden
            onClick={close}
          />
          <aside
            role="dialog"
            aria-label="목차"
            className="fixed inset-y-0 right-0 z-[70] w-[min(320px,85vw)] max-w-full border-l border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 lg:hidden"
            style={{ contain: "layout style paint" }}
          >
            <div className="flex h-full flex-col">
              <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">목차</span>
                <button
                  type="button"
                  onClick={close}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  aria-label="목차 닫기"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
              <div
                className="min-h-0 flex-1 overflow-y-auto px-4 py-4 [&_nav>div>h2]:hidden [&_nav>div]:mt-0"
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('a[href^="#"]')) close();
                }}
              >
                <TableOfContents headings={list} />
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
