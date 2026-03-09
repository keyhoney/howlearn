import Link from "next/link";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import { getFeaturedContent, getLatestContent } from "@/lib/content";
import { ContentCard } from "@/components/cards/ContentCard";
import { DomainGrid } from "@/components/shared/DomainGrid";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "홈",
});

export default async function Home() {
  const featuredContent = await getFeaturedContent();
  const latestContent = await getLatestContent(6);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-800/60 py-20 sm:py-32">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/learning/1920/1080?blur=10')] bg-cover bg-center opacity-10 dark:opacity-5" />
        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl">
            HowLearn
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            학습과학 기반 부모 교육을 위한 지식 아카이브입니다. 가이드, 개념, 툴킷, 블로그, 도서를 제공합니다.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/guides"
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 dark:bg-indigo-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400 transition-colors"
            >
              핵심 가이드 보기
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center justify-center rounded-full bg-white dark:bg-slate-700 px-8 py-3.5 text-sm font-semibold text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            >
              <Search className="w-4 h-4 mr-2 text-slate-500 dark:text-slate-400" />
              지식 검색하기
            </Link>
          </div>
        </div>
      </section>

      {/* Knowledge Map (Domains) */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">지식 탐색 지도</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">5가지 학문 분야를 중심으로 학습의 원리를 탐구합니다.</p>
          </div>
          <DomainGrid />
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-700">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">추천 지식 노드</h2>
              <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">가장 핵심이 되는 가이드와 개념을 먼저 읽어보세요.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredContent.map(content => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">최신 업데이트</h2>
              <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">새롭게 추가된 블로그 칼럼과 실천 자료입니다.</p>
            </div>
            <Link href="/blog" className="hidden sm:flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
              전체 보기 <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestContent.map(content => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
          <div className="mt-10 sm:hidden flex justify-center">
            <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
              전체 보기 <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
