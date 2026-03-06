"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sectionPaths = ["/domains", "/guides", "/blog", "/concepts", "/toolkit", "/books"];

const primaryLinks = [
  { href: "/", label: "홈" },
  { href: "/domains", label: "주제별" },
  { href: "/guides", label: "가이드" },
  { href: "/blog", label: "블로그" },
  { href: "/concepts", label: "개념" },
  { href: "/toolkit", label: "툴킷" },
  { href: "/books", label: "전자책" },
];

const secondaryLinks = [
  { href: "/search", label: "검색" },
  { href: "/about", label: "About" },
];

function NavItem({
  href,
  label,
  active,
  secondary,
}: {
  href: string;
  label: string;
  active: boolean;
  secondary?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={`relative block pb-1 transition focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:ring-offset-2 focus:ring-offset-[var(--background)] rounded ${
          secondary
            ? "text-xs font-medium text-[var(--muted)] hover:opacity-100 hover:text-foreground opacity-90"
            : "text-sm font-medium"
        } ${active ? "text-foreground" : secondary ? "" : "text-[var(--muted)] hover:text-foreground"}`}
      >
        {label}
        {active && !secondary && (
          <span
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--brand-500)]"
            aria-hidden
          />
        )}
      </Link>
    </li>
  );
}

export function NavLinks() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return sectionPaths.includes(href) && pathname.startsWith(href);
  };

  return (
    <ul className="flex flex-wrap items-center gap-6 md:gap-8">
      {primaryLinks.map(({ href, label }) => (
        <NavItem key={href} href={href} label={label} active={isActive(href)} />
      ))}
      <li className="ml-2 h-4 w-px bg-[var(--border)]" aria-hidden />
      {secondaryLinks.map(({ href, label }) => (
        <NavItem key={href} href={href} label={label} active={isActive(href)} secondary />
      ))}
    </ul>
  );
}
