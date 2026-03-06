"use client";

import { trackOutboundClick } from "@/lib/analytics";

type OutboundLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  label?: string;
};

/**
 * 외부 링크(서점 등) 클릭 시 GA4 outbound_click 이벤트 전송
 */
export function OutboundLink({
  href,
  label,
  children,
  ...props
}: OutboundLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      onClick={() => trackOutboundClick(href, label)}
    >
      {children}
    </a>
  );
}
