"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary";

const baseClasses =
  "inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400 active:scale-[0.98]",
  secondary:
    "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 focus-visible:outline-slate-400 active:scale-[0.98]",
};

type CtaLinkProps = {
  href: string;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
};

export function CtaLink({
  href,
  variant = "primary",
  children,
  className = "",
}: CtaLinkProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (loading) {
      e.preventDefault();
      return;
    }
    const isSameOrigin = href.startsWith("/");
    if (isSameOrigin) {
      e.preventDefault();
      setLoading(true);
      router.push(href);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-busy={loading}
      aria-disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          <span className="ml-2">이동 중...</span>
        </>
      ) : (
        children
      )}
    </a>
  );
}
