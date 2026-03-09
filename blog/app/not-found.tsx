import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400" aria-hidden>
        404
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
        요청하신 주소에 해당하는 페이지가 없거나 이동했을 수 있습니다.
        <br className="hidden sm:inline" />
        홈으로 돌아가거나 지식 검색을 이용해 보세요.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-indigo-600 dark:bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-400 transition-colors"
        >
          <Home className="w-4 h-4 mr-2" aria-hidden />
          홈으로
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center justify-center rounded-full bg-white dark:bg-slate-700 px-6 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
        >
          <Search className="w-4 h-4 mr-2" aria-hidden />
          지식 검색
        </Link>
      </div>
    </div>
  );
}
