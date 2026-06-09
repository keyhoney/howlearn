export type SearchResultItem = {
  url?: string;
  meta?: { title?: string };
  excerpt?: string;
};

import {
  getContentDomainBadgeClass,
  getContentDomainLabel,
  inferContentDomainFromUrl,
} from './content-domain-badge';

export function inferSearchDomain(url: string): string {
  return inferContentDomainFromUrl(url);
}

function escapeHtml(text: string): string {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function highlightEscapedText(escapedText: string, escapedQuery: string): string {
  if (!escapedQuery) return escapedText;
  // 이미 mark로 감싼 경우가 있으면 중복 래핑을 피하기 위해 간단히 1회만 처리
  if (!escapedText.includes(escapedQuery)) return escapedText;
  return escapedText.replaceAll(escapedQuery, `<mark>${escapedQuery}</mark>`);
}

function sanitizePagefindExcerptHtml(excerpt: string): string {
  // Pagefind excerpt는 기본적으로 HTML 문자열(예: <mark>...</mark>)이다.
  // - <code>/<pre>는 스타일 없이 텍스트만 남기고
  // - <mark>만 유지하고 나머지 태그는 제거한다.
  const raw = String(excerpt || '');
  if (!raw) return '';

  const withoutPre = raw.replace(/<pre\b[^>]*>[\s\S]*?<\/pre>/gi, (m) => {
    // pre 내부는 보통 코드 블록이라 통째로 텍스트만 남긴다.
    return m.replace(/<\/?pre\b[^>]*>/gi, '');
  });
  const withoutCode = withoutPre.replace(/<\/?code\b[^>]*>/gi, '');

  // <mark> 외 태그 제거. (mark의 class 등은 유지)
  const keepMarkOnly = withoutCode.replace(/<(?!\/?mark\b)[^>]+>/gi, '');

  return keepMarkOnly.trim();
}

export function buildSearchResultCardHtml(item: SearchResultItem, query?: string): string {
  const url = item.url || '#';
  const domain = inferSearchDomain(url);
  const badgeClass = getContentDomainBadgeClass(domain);
  const badgeLabel = domain === 'other' ? '기타' : getContentDomainLabel(domain);
  const titleEscaped = escapeHtml(item.meta?.title || url);
  const q = String(query || '').trim();
  const queryEscaped = q.length >= 2 ? escapeHtml(q) : '';
  const title = highlightEscapedText(titleEscaped, queryEscaped);
  const excerpt = sanitizePagefindExcerptHtml(item.excerpt || '');

  return `
    <li>
      <a href="${url}" class="app-card app-card-interactive flex h-full flex-col p-4 sm:p-5 text-[var(--fg)]">
        <div class="flex flex-wrap items-start justify-between gap-2">
          <span class="app-badge ${badgeClass}">${badgeLabel}</span>
        </div>
        <h2 class="mt-3 text-lg font-semibold text-[var(--fg)]">${title}</h2>
        ${
          excerpt
            ? `<p class="mt-2 text-sm text-[var(--fg-muted)] line-clamp-3 leading-relaxed">${excerpt}</p>`
            : ''
        }
        <div class="mt-auto pt-4">
          <span class="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)]">
            자세히 보기
            <svg class="app-card-arrow h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clip-rule="evenodd"></path>
            </svg>
          </span>
        </div>
      </a>
    </li>
  `;
}
