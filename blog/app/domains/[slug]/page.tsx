import { notFound } from "next/navigation";
import { domainInfo } from "@/lib/domains";
import { DomainSlug } from "@/lib/types";
import type { ContentType } from "@/lib/types";
import { getContentByDomain, paginateContent, isAllowedPerPage } from "@/lib/content";
import { ContentCard } from "@/components/cards/ContentCard";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { DomainContentTypeFilter } from "@/components/shared/DomainContentTypeFilter";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const PATHNAME_PREFIX = "/domains";

const VALID_TYPES: (ContentType | "")[] = ["guide", "concept", "toolkit", "book", ""];

type SearchParams = Promise<{ page?: string; perPage?: string; type?: string }>;

function parseParams(sp: Awaited<SearchParams>) {
  const page = Math.max(1, parseInt(sp?.page ?? "1", 10) || 1);
  const rawPer = parseInt(sp?.perPage ?? "12", 10) || 12;
  const perPage = isAllowedPerPage(rawPer) ? rawPer : 12;
  const typeParam = (sp?.type ?? "").trim().toLowerCase();
  const type: ContentType | undefined = VALID_TYPES.includes(typeParam as ContentType | "")
    ? (typeParam ? (typeParam as ContentType) : undefined)
    : undefined;
  return { page, perPage, type };
}

function buildCanonicalQuery(page: number, perPage: number, type?: string): string {
  const p = new URLSearchParams();
  p.set("page", String(page));
  p.set("perPage", String(perPage));
  if (type) p.set("type", type);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export async function generateStaticParams() {
  return Object.keys(domainInfo).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  if (!Object.keys(domainInfo).includes(slug)) return {};
  const sp = await searchParams;
  const { page, perPage, type } = parseParams(sp);
  const info = domainInfo[slug as DomainSlug];
  const path = `${PATHNAME_PREFIX}/${slug}${buildCanonicalQuery(page, perPage, type || undefined)}`;
  const content = await getContentByDomain(slug as DomainSlug);
  const filtered = type ? content.filter((c) => c.type === type) : content;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const base = site.url;
  const links: { rel: string; url: string }[] = [];
  if (page > 1)
    links.push({
      rel: "prev",
      url: `${base}${PATHNAME_PREFIX}/${slug}${buildCanonicalQuery(page - 1, perPage, type || undefined)}`,
    });
  if (page < totalPages)
    links.push({
      rel: "next",
      url: `${base}${PATHNAME_PREFIX}/${slug}${buildCanonicalQuery(page + 1, perPage, type || undefined)}`,
    });
  return {
    ...constructMetadata({
      title: `${info.name} 도메인 탐색`,
      description: info.description,
      path,
    }),
    ...(links.length > 0 && { links }),
  };
}

export default async function DomainDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  if (!Object.keys(domainInfo).includes(slug)) {
    notFound();
  }

  const domain = slug as DomainSlug;
  const info = domainInfo[domain];
  const { page, perPage, type } = parseParams(sp);
  const content = await getContentByDomain(domain);
  const filtered = type ? content.filter((c) => c.type === type) : content;
  const { items, totalCount, totalPages } = paginateContent(filtered, page, perPage);
  const pathname = `${PATHNAME_PREFIX}/${slug}`;

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <Link
        href="/domains"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        모든 도메인 보기
      </Link>

      <div className="mb-10">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border mb-6 ${info.color}`}
        >
          Domain
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {info.name}
        </h1>
        <p className="mt-4 text-xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          {info.description}
        </p>
        <div className="mt-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
          총 {totalCount}개의 관련 콘텐츠
        </div>
      </div>

      {content.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
            아직 이 도메인에 등록된 콘텐츠가 없습니다.
          </h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">곧 새로운 콘텐츠가 업데이트될 예정입니다.</p>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <DomainContentTypeFilter domainSlug={slug} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {items.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>

          {totalPages > 1 && (
            <PaginationBar
              pathname={pathname}
              currentPage={page}
              totalPages={totalPages}
              totalCount={totalCount}
              perPage={perPage}
              preserveParams
            />
          )}
        </>
      )}
    </div>
  );
}
