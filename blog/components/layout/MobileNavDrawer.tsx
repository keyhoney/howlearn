"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "홈" },
  { href: "/domains", label: "개념별" },
  { href: "/guides", label: "가이드" },
  { href: "/concepts", label: "개념" },
  { href: "/toolkit", label: "툴킷" },
  { href: "/books", label: "도서" },
  { href: "/search", label: "검색" },
  { href: "/about", label: "소개" },
];

export function MobileNavDrawer() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setOpen(false));
  }, [pathname]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors rounded-lg"
        onClick={() => setOpen(true)}
        aria-label="메뉴 열기"
        aria-expanded={open}
      >
        <Menu className="h-6 w-6" />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <div
              className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-[2px] md:hidden"
              style={{ zIndex: 9998 }}
              aria-hidden
              onClick={() => setOpen(false)}
            />
            <div
              className="fixed top-0 right-0 bottom-0 w-[min(280px,85vw)] md:hidden flex flex-col border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-y-auto"
              style={{
                zIndex: 9999,
                boxShadow: "-4px 0 20px rgba(0,0,0,0.08)",
              }}
              role="dialog"
              aria-label="Menu"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-4 py-3 shrink-0">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">메뉴</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  aria-label="메뉴 닫기"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 px-3 py-4">
                <ul className="flex flex-col gap-0.5">
                  {navLinks.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        prefetch={false}
                        className={`block py-3 px-4 min-h-[44px] flex items-center text-base font-medium rounded-lg ${
                          pathname === href || pathname.startsWith(href + "/")
                            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                        }`}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
