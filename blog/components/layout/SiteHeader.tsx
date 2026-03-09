import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { site } from "@/lib/site";

const BRAND_LOGO_URL = "https://learninsight.pages.dev/ogprofile/brandlogo.png";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80 transition-colors">
      <div className="container mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-4 md:gap-8">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src={BRAND_LOGO_URL}
              alt={site.name}
              width={144}
              height={36}
              className="h-[29px] w-auto sm:h-[34px] object-contain object-left"
              priority
            />
          </Link>
          <nav className="hidden md:flex items-center gap-5 lg:gap-6" aria-label="주 메뉴">
            <Link href="/domains" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors whitespace-nowrap">학문별</Link>
            <span className="h-4 w-px bg-slate-300 dark:bg-slate-600 shrink-0" aria-hidden />
            <Link href="/guides" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors whitespace-nowrap">가이드</Link>
            <Link href="/concepts" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors whitespace-nowrap">개념</Link>
            <Link href="/blog" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors whitespace-nowrap">블로그</Link>
            <span className="h-4 w-px bg-slate-300 dark:bg-slate-600 shrink-0" aria-hidden />
            <Link href="/toolkit" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors whitespace-nowrap">툴킷</Link>
            <Link href="/books" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors whitespace-nowrap">도서</Link>
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link href="/search" className="flex h-10 w-10 sm:h-auto sm:w-auto min-w-[2.5rem] sm:min-w-0 items-center justify-center gap-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-colors" aria-label="검색">
            <Search className="h-5 w-5" aria-hidden />
            <span className="text-sm font-medium hidden sm:inline">검색</span>
          </Link>
          <ThemeToggle />
          <MobileNavDrawer />
        </div>
      </div>
    </header>
  );
}
