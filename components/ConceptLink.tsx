"use client";

import Link from "next/link";
import { trackConceptClick } from "@/lib/analytics";

type ConceptLinkProps = {
  slug: string;
  children?: React.ReactNode;
  className?: string;
};

/**
 * 개념 사전(/concepts/[slug])으로 연결하는 링크. 클릭 시 concept_click 이벤트 전송.
 */
export function ConceptLink({ slug, children, className }: ConceptLinkProps) {
  const href = `/concepts/${encodeURIComponent(slug)}`;
  return (
    <Link
      href={href}
      className={className ?? "font-medium text-[var(--brand-500)] underline underline-offset-2 transition hover:text-[var(--brand-600)]"}
      onClick={() => trackConceptClick(slug, href)}
    >
      {children ?? slug}
    </Link>
  );
}
