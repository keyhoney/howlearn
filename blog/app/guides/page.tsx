import { getContentByType, filterContentByQuery, paginateContent, getAvailableTagsForDomain, isAllowedPerPage } from "@/lib/content";
import { ContentHub } from "@/components/shared/ContentHub";
import { constructMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const PATHNAME = "/guides";
const TITLE = "가이드";
const DESCRIPTION = "학습과학의 핵심 개념을 체계적으로 정리한 에버그린 문서입니다.";

type SearchParams = Promise<{ page?: string; perPage?: string; q?: string; domain?: string; tag?: string }>;

function parseParams(sp: Awaited<SearchParams>) {
  const page = Math.max(1, parseInt(sp?.page ?? "1", 10) || 1);
  const rawPer = parseInt(sp?.perPage ?? "12", 10) || 12;
  const perPage = isAllowedPerPage(rawPer) ? rawPer : 12;
  return { page, perPage, q: sp?.q?.trim() ?? "", domain: sp?.domain ?? "", tag: sp?.tag ?? "" };
}

function buildCanonicalQuery(params: Awaited<SearchParams>, page: number): string {
  const p = new URLSearchParams();
  if (params?.q) p.set("q", params.q);
  if (params?.domain) p.set("domain", params.domain);
  if (params?.tag) p.set("tag", params.tag);
  p.set("page", String(page));
  p.set("perPage", params?.perPage ?? "12");
  const s = p.toString();
  return s ? `?${s}` : "";
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { page, perPage } = parseParams(params);
  const full = await getContentByType("guide");
  const filtered = filterContentByQuery(full, { q: params?.q, domain: params?.domain, tag: params?.tag });
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const base = site.url;
  const links: { rel: string; url: string }[] = [];
  if (page > 1) links.push({ rel: "prev", url: `${base}${PATHNAME}${buildCanonicalQuery(params, page - 1)}` });
  if (page < totalPages) links.push({ rel: "next", url: `${base}${PATHNAME}${buildCanonicalQuery(params, page + 1)}` });
  return {
    ...constructMetadata({ title: TITLE, description: DESCRIPTION, path: `${PATHNAME}${buildCanonicalQuery(params, page)}` }),
    ...(links.length > 0 && { links }),
  };
}

export default async function GuidesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { page, perPage, q, domain, tag } = parseParams(params);
  const full = await getContentByType("guide");
  const filtered = filterContentByQuery(full, { q: q || undefined, domain: domain || undefined, tag: tag || undefined });
  const { items, totalCount, totalPages } = paginateContent(filtered, page, perPage);
  const availableTags = getAvailableTagsForDomain(full, domain || undefined);

  return (
    <ContentHub
      title={TITLE}
      description={DESCRIPTION}
      content={items}
      type="guide"
      pagination={{
        totalCount,
        page,
        perPage,
        totalPages,
        pathname: PATHNAME,
      }}
      availableTags={availableTags}
    />
  );
}
