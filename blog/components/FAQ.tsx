"use client";

import { useState } from "react";
import type { FAQItem } from "@/lib/faq";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useFaqFromContext } from "@/components/context/FaqContext";

interface FAQProps {
  /** FAQ 항목 배열. RSC/MDX에서는 비워두고 frontmatter faq + FaqProvider 사용 권장. */
  items?: FAQItem[] | string | null;
  /** 첫 번째 항목을 기본 열림으로 할지 (기본: true) */
  defaultOpenFirst?: boolean;
}

function parseItems(items: FAQItem[] | string | null | undefined): FAQItem[] {
  if (items == null) return [];
  if (Array.isArray(items)) {
    return items.filter(
      (x): x is FAQItem =>
        x != null && typeof x === "object" && "question" in x && "answer" in x
    );
  }
  if (typeof items === "string") {
    try {
      const trimmed = items
        .trim()
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'");
      if (!trimmed) return [];
      // 속성값이 줄바꿈에서 잘렸을 수 있음: 줄바꿈/연속 공백 제거 후 재시도
      let parsed: FAQItem[] | FAQItem;
      try {
        parsed = JSON.parse(trimmed) as FAQItem[] | FAQItem;
      } catch {
        const compact = trimmed.replace(/\s+/g, " ").trim();
        parsed = JSON.parse(compact) as FAQItem[] | FAQItem;
      }
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      return arr.filter(
        (x): x is FAQItem =>
          x != null && typeof x === "object" && "question" in x && "answer" in x
      );
    } catch {
      return [];
    }
  }
  return [];
}

export function FAQ({ items, defaultOpenFirst = true }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenFirst ? 0 : null);
  const fromContext = useFaqFromContext();
  const parsed = parseItems(items);
  const list = parsed.length > 0 ? parsed : (fromContext ?? []);

  if (list.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {list.map((item, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-900/50"
        >
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 rounded-2xl"
            aria-expanded={openIndex === idx}
            aria-controls={`faq-answer-${idx}`}
            id={`faq-question-${idx}`}
          >
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
              {item.question}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0 transition-transform duration-300 ${openIndex === idx ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>

          <AnimatePresence>
            {openIndex === idx && (
              <motion.div
                id={`faq-answer-${idx}`}
                role="region"
                aria-labelledby={`faq-question-${idx}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
