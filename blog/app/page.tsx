import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";
import { getFeaturedContent, getLatestContent } from "@/lib/content";
import { ContentCard } from "@/components/cards/ContentCard";
import { DomainGrid } from "@/components/shared/DomainGrid";
import { CtaLink } from "@/components/ui/CtaLink";
import { constructMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = constructMetadata({
  title: "홈",
  path: "/",
});

export default async function Home() {
  const featuredContent = await getFeaturedContent();
  const latestContent = await getLatestContent(6);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-800/60 py-14 sm:py-24 lg:py-32">
        <div className="absolute inset-0 opacity-10 dark:opacity-5" role="presentation" aria-hidden="true">
          <Image
            src="https://picsum.photos/seed/learning/1920/1080?blur=10"
            alt=""
            role="presentation"
            fill
            sizes="100vw"
            className="object-cover object-center"
            loading="lazy"
            fetchPriority="low"
          />
        </div>
        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl">
            {(() => {
              const idx = site.name.indexOf("Learn");
              const part1 = idx >= 0 ? site.name.slice(0, idx) : site.name;
              const part2 = idx >= 0 ? site.name.slice(idx) : null;
              return part2 ? (
                <>
                  <span className="text-[#FD9A32]">{part1}</span>
                  <span className="text-[#97D5D4]">{part2}</span>
                </>
              ) : (
                <span>{site.name}</span>
              );
            })()}
          </h1>
          <p className="mx-auto mt-5 sm:mt-6 max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            학습과학 기반 부모 교육을 위한 지식 아카이브입니다. 가이드, 개념, 툴킷, 블로그, 도서를 제공합니다.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <CtaLink href="/guides" variant="primary">
              핵심 가이드 보기
            </CtaLink>
            <CtaLink href="/search" variant="secondary">
              <Search className="w-4 h-4 mr-2 text-slate-500 dark:text-slate-400" />
              지식 검색하기
            </CtaLink>
          </div>
        </div>
      </section>

      {/* Knowledge Map (Domains) */}
      <section className="py-12 sm:py-20 lg:py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 sm:mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">지식 탐색 지도</h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">5가지 학문 분야를 중심으로 학습의 원리를 탐구합니다.</p>
          </div>
          <DomainGrid />
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-12 sm:py-20 lg:py-24 bg-slate-50 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-700">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10 sm:mb-12">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">추천 지식 노드</h2>
              <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">가장 핵심이 되는 가이드와 개념을 먼저 읽어보세요.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredContent.map(content => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="py-12 sm:py-20 lg:py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10 sm:mb-12">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">최신 업데이트</h2>
              <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">새롭게 추가된 블로그 칼럼과 실천 자료입니다.</p>
            </div>
            <Link href="/blog" className="hidden sm:flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
              전체 보기 <ArrowRight className="ml-1 w-4 h-4" aria-hidden />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {latestContent.map(content => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
          <div className="mt-10 sm:hidden flex justify-center">
            <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
              전체 보기 <ArrowRight className="ml-1 w-4 h-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
