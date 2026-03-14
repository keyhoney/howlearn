"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

interface DocCTAProps {
  /** CTA 인용 문구 */
  text: string;
  /** 공유 버튼 라벨 */
  buttonLabel: string;
}

export function DocCTA({ text, buttonLabel }: DocCTAProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData: ShareData = { title: document.title, url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") console.warn("Share failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Copy failed:", err);
      }
    }
  };

  return (
    <aside
      className="mt-9 rounded-[2.5rem] p-7 md:p-11 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-200 dark:border-slate-700 bg-[#f5f5f0] dark:bg-slate-800/60"
      aria-label="공유 유도"
    >
      <p className="text-2xl md:text-3xl font-serif text-[#3a3a2a] dark:text-slate-200 mb-6 whitespace-pre-line leading-relaxed italic">
        &quot;{text}&quot;
      </p>
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center justify-center gap-2 bg-[#5A5A40] dark:bg-slate-600 text-white font-serif py-3 px-8 rounded-full hover:bg-[#4a4a30] dark:hover:bg-slate-500 transition-colors tracking-wide text-lg active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
      >
        {copied ? (
          <Check className="w-5 h-5 text-[#d4d4c8] dark:text-slate-300" aria-hidden />
        ) : (
          <Share2 className="w-5 h-5" aria-hidden />
        )}
        {copied ? "복사되었습니다" : buttonLabel}
      </button>
    </aside>
  );
}
