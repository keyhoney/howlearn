import type { ReactNode } from "react";

type ConceptAnchorLinkProps = {
  /** 개념 슬러그. 같은 페이지의 RelatedConcepts 블록에 id="concept-{slug}"로 연결됩니다. */
  slug: string;
  children: ReactNode;
  className?: string;
};

/**
 * 본문 안에서 개념어(한글·영문)에 걸어, 같은 글 하단의 「관련 개념」 블록 내 해당 슬러그 위치로 스크롤 이동하는 링크.
 * RelatedConcepts 컴포넌트가 각 슬러그에 id="concept-{slug}"를 부여하므로, 한 번만 RelatedConcepts를 두고 본문에서는 이 컴포넌트로 네비게이션하면 됩니다.
 */
export function ConceptAnchorLink({
  slug,
  children,
  className,
}: ConceptAnchorLinkProps) {
  const href = `#concept-${slug}`;
  return (
    <a
      href={href}
      className={
        className ??
        "font-medium text-[#4F39F6] underline underline-offset-2 decoration-2 decoration-dotted hover:text-[#6350f7] dark:text-[#4F39F6] dark:hover:text-[#7c6cf7]"
      }
    >
      {children}
    </a>
  );
}
