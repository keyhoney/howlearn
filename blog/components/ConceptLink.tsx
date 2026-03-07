"use client";

import Link from "next/link";
import { trackConceptClick } from "@/lib/analytics";

interface ConceptLinkProps {
  conceptSlug: string;
  children: React.ReactNode;
  className?: string;
}

export function ConceptLink({
  conceptSlug,
  children,
  className,
}: ConceptLinkProps) {
  const href = `/concepts/${conceptSlug}`;
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackConceptClick(conceptSlug, href)}
    >
      {children}
    </Link>
  );
}
