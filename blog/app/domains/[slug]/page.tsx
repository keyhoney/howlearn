import { notFound } from "next/navigation";
import { domainInfo } from "@/lib/domains";
import { DomainSlug } from "@/lib/types";
import { getContentByDomain } from "@/lib/content";
import { ContentCard } from "@/components/cards/ContentCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { constructMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return Object.keys(domainInfo).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!Object.keys(domainInfo).includes(slug)) return {};
  const info = domainInfo[slug as DomainSlug];
  return constructMetadata({
    title: `${info.name} 도메인 탐색`,
    description: info.description,
  });
}

export default async function DomainDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (!Object.keys(domainInfo).includes(slug)) {
    notFound();
  }

  const domain = slug as DomainSlug;
  const info = domainInfo[domain];
  const content = await getContentByDomain(domain);

  // Group content by type
  const guides = content.filter(c => c.type === "guide");
  const concepts = content.filter(c => c.type === "concept");
  const blogs = content.filter(c => c.type === "blog");
  const toolkits = content.filter(c => c.type === "toolkit");
  const books = content.filter(c => c.type === "book");

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <Link href="/domains" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        모든 도메인 보기
      </Link>

      <div className="mb-16">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border mb-6 ${info.color}`}>
          Domain
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{info.name}</h1>
        <p className="mt-4 text-xl text-slate-600 max-w-3xl leading-relaxed">{info.description}</p>
        <div className="mt-6 text-sm text-slate-500 font-medium">
          총 {content.length}개의 관련 콘텐츠
        </div>
      </div>

      {content.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <h3 className="text-lg font-medium text-slate-900">아직 이 도메인에 등록된 콘텐츠가 없습니다.</h3>
          <p className="mt-2 text-slate-500">곧 새로운 콘텐츠가 업데이트될 예정입니다.</p>
        </div>
      ) : (
        <div className="space-y-20">
          {guides.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-8 border-b border-slate-200 pb-4">핵심 가이드</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {guides.map(item => <ContentCard key={item.id} content={item} />)}
              </div>
            </section>
          )}

          {concepts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-8 border-b border-slate-200 pb-4">주요 개념</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {concepts.map(item => <ContentCard key={item.id} content={item} />)}
              </div>
            </section>
          )}

          {toolkits.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-8 border-b border-slate-200 pb-4">실천 툴킷</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {toolkits.map(item => <ContentCard key={item.id} content={item} />)}
              </div>
            </section>
          )}

          {blogs.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-8 border-b border-slate-200 pb-4">관련 블로그</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map(item => <ContentCard key={item.id} content={item} />)}
              </div>
            </section>
          )}

          {books.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-8 border-b border-slate-200 pb-4">추천 도서</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {books.map(item => <ContentCard key={item.id} content={item} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
