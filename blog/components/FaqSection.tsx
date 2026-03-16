"use client";

import { useFaqFromContext } from "@/components/context/FaqContext";
import { FAQ } from "@/components/FAQ";

/**
 * MDX에서 "자주 묻는 질문" 섹션을 표시. FaqProvider로 감싼 페이지에서만 데이터를 받으며,
 * FAQ가 있을 때만 렌더. 보통 <BottomSummary /> 바로 위에 둬서 FAQ → BottomSummary 순서가 되게 함.
 */
export function FaqSection() {
  const faqItems = useFaqFromContext();
  if (!faqItems || faqItems.length === 0) return null;

  return (
    <section className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-700 not-prose">
      <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 scroll-mt-24 mb-4">
        자주 묻는 질문
      </h2>
      <FAQ items={faqItems} />
    </section>
  );
}
