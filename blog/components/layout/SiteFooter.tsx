import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 py-8 sm:py-12 transition-colors">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
          <div className="col-span-2 min-w-0 md:col-span-1">
            <span className="font-bold text-slate-900 dark:text-slate-100 tracking-tight text-base sm:text-lg">{site.name}</span>
            <p className="mt-3 sm:mt-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {site.description}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4 text-sm sm:text-base">탐색</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/domains" prefetch={false} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">학문별</Link></li>
              <li><Link href="/guides" prefetch={false} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">가이드</Link></li>
              <li><Link href="/concepts" prefetch={false} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">개념</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4 text-sm sm:text-base">자료</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/books" prefetch={false} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">도서</Link></li>
              <li><Link href="/toolkit" prefetch={false} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">툴킷</Link></li>
              <li><Link href="/search" prefetch={false} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">검색</Link></li>
              <li><Link href="/rss.xml" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">RSS 피드</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4 text-sm sm:text-base">이용 안내</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/about" prefetch={false} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">소개</Link></li>
              <li><Link href="/privacy" prefetch={false} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">개인정보처리방침</Link></li>
              <li><Link href="/terms" prefetch={false} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">이용약관</Link></li>
              <li><Link href="/cookies" prefetch={false} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">쿠키 정책</Link></li>
              <li><Link href="/disclaimer" prefetch={false} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">면책 조항</Link></li>
              <li><Link href="/contact" prefetch={false} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">문의</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-700 text-center text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} {site.name}. 저작권 소유.
        </div>
      </div>
    </footer>
  );
}
