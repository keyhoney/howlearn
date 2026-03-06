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
  asButton,
}: {
  href: string;
  label: string;
  active: boolean;
  secondary?: boolean;
  asButton?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={`relative block transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:ring-offset-2 focus:ring-offset-[var(--background)] rounded ${
          asButton
            ? "rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm font-medium text-foreground no-underline hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
            : secondary
              ? "pb-1 text-xs font-medium text-[var(--muted)] hover:opacity-100 hover:text-foreground opacity-90"
              : `pb-1 text-sm font-medium ${active ? "text-foreground" : "text-[var(--muted)] hover:text-foreground"}`
        } ${active && !secondary && !asButton ? "bg-[var(--brand-500)]/5 px-2 py-1 -mx-2 -my-1 rounded" : ""}`}
      >
        {label}
        {active && !secondary && !asButton && (
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
    <ul className="flex flex-wrap items-center gap-4 md:gap-6">
      {primaryLinks.map(({ href, label }) => (
        <NavItem key={href} href={href} label={label} active={isActive(href)} />
      ))}
      <li className="h-4 w-px bg-[var(--border)]" aria-hidden />
      <NavItem href="/search" label="검색" active={isActive("/search")} asButton />
      {secondaryLinks.filter((l) => l.href !== "/search").map(({ href, label }) => (
        <NavItem key={href} href={href} label={label} active={isActive(href)} secondary />
      ))}
    </ul>
  );
}
