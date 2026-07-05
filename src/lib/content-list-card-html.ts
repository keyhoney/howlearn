import {
  resolveArticleListCardMeta,
  resolveConceptCardMeta,
  type ArticleListCardInput,
  type ConceptCardInput,
} from './card-meta';
import { getCategoryBadgeClass } from './category-badge';
import { formatReadingTime } from './reading-time';
import { formatArticleDateShort, getRevisionKindLabel } from './article-meta';
import type { ContentListCardType, SerializedContentListItem } from './content-list-serialize';

function escapeHtml(text: string): string {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const ARROW_SVG =
  '<svg class="app-card-arrow h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clip-rule="evenodd"></path></svg>';

function formatPublishedAt(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return formatArticleDateShort(date);
}

function buildListDatesHtml(item: SerializedContentListItem): string {
  const publishedHtml = item.publishedAt
    ? `<time datetime="${escapeHtml(item.publishedAt)}">${escapeHtml(formatPublishedAt(item.publishedAt))}</time>`
    : '';
  const revisionHtml =
    item.latestRevisionAt && item.latestRevisionKind
      ? `<time datetime="${escapeHtml(item.latestRevisionAt)}" class="text-[0.7rem] leading-tight"><span class="font-sans font-medium">${escapeHtml(getRevisionKindLabel(item.latestRevisionKind))}</span> ${escapeHtml(formatPublishedAt(item.latestRevisionAt))}</time>`
      : '';

  if (!publishedHtml && !revisionHtml) return '';

  return `<div class="flex shrink-0 flex-col items-end gap-0.5 text-right font-mono text-xs text-[var(--fg-muted)]">${publishedHtml}${revisionHtml}</div>`;
}

function hasListDates(item: SerializedContentListItem): boolean {
  return Boolean(item.publishedAt || item.latestRevisionAt);
}

function buildReadingTimeHtml(minutes?: number): string {
  if (minutes == null) return '';
  return `<span class="app-card-footer-reading app-reading-time" title="예상 읽기 시간">${escapeHtml(formatReadingTime(minutes))}</span>`;
}

function buildArticleCardHtml(
  item: SerializedContentListItem,
  basePath: string,
  listQuery: string,
): string {
  const input: ArticleListCardInput = {
    title: item.title,
    summary: item.summary,
    description: item.description,
    categories: item.categories,
    tags: item.tags,
    domains: item.domains,
    publishedAt: item.publishedAt ? new Date(item.publishedAt) : undefined,
  };
  const meta = resolveArticleListCardMeta(input);
  const hasHeaderRow = meta.headerBadges.length > 0 || hasListDates(item);
  const hasFooterMeta = meta.footerTags.length > 0 || item.readingMinutes != null;
  const href = `${basePath}/${encodeURIComponent(item.id)}${listQuery}`;

  const headerBadgesHtml = meta.headerBadges
    .map(
      (badge) =>
        `<span class="app-badge ${escapeHtml(getCategoryBadgeClass(badge))}">${escapeHtml(badge)}</span>`,
    )
    .join('');
  const footerTagsHtml = meta.footerTags
    .map(
      (tag) =>
        `<span class="app-chip app-card-footer-tag max-w-full truncate">#${escapeHtml(tag)}</span>`,
    )
    .join('');
  const readingSeparator =
    meta.footerTags.length > 0 && item.readingMinutes != null
      ? '<span class="hidden text-[var(--fg-muted)] opacity-40 sm:inline" aria-hidden="true">·</span>'
      : '';

  return `
    <li>
      <a href="${href}" data-preserve-list-state-link class="app-card app-card-interactive flex h-full flex-col p-5 text-[var(--fg)]">
        ${
          hasHeaderRow
            ? `<div class="flex flex-wrap items-start justify-between gap-2">
                ${meta.headerBadges.length > 0 ? `<div class="flex flex-wrap gap-1.5">${headerBadgesHtml}</div>` : '<span aria-hidden="true"></span>'}
                ${hasListDates(item) ? buildListDatesHtml(item) : ''}
              </div>`
            : ''
        }
        <h2 class="text-lg font-semibold text-[var(--fg)]${hasHeaderRow ? ' mt-3' : ''}">${escapeHtml(meta.displayTitle)}</h2>
        ${meta.excerpt ? `<p class="mt-2 text-sm text-[var(--fg-muted)] line-clamp-3 leading-relaxed">${escapeHtml(meta.excerpt)}</p>` : ''}
        <div class="mt-auto flex items-end justify-between gap-3 pt-4">
          ${
            hasFooterMeta
              ? `<div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">${footerTagsHtml}${readingSeparator}${buildReadingTimeHtml(item.readingMinutes)}</div>`
              : '<span aria-hidden="true"></span>'
          }
          <span class="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[var(--accent)]">
            자세히 보기
            ${ARROW_SVG}
          </span>
        </div>
      </a>
    </li>
  `;
}

function buildConceptCardHtml(item: SerializedContentListItem, listQuery: string): string {
  const input: ConceptCardInput = {
    title: item.title,
    englishName: item.englishName,
    categories: item.categories,
    tags: item.tags,
    shortDefinition: item.shortDefinition,
    publishedAt: item.publishedAt ? new Date(item.publishedAt) : undefined,
  };
  const meta = resolveConceptCardMeta(input);
  const hasHeaderRow = meta.headerBadges.length > 0 || hasListDates(item);
  const hasFooterMeta = meta.footerTags.length > 0 || item.readingMinutes != null;
  const href = `/concepts/${encodeURIComponent(item.id)}${listQuery}`;

  const headerBadgesHtml = meta.headerBadges
    .map(
      (badge) =>
        `<span class="app-badge ${escapeHtml(getCategoryBadgeClass(badge))}">${escapeHtml(badge)}</span>`,
    )
    .join('');
  const footerTagsHtml = meta.footerTags
    .map(
      (tag) =>
        `<span class="app-chip app-card-footer-tag max-w-full truncate">#${escapeHtml(tag)}</span>`,
    )
    .join('');
  const readingSeparator =
    meta.footerTags.length > 0 && item.readingMinutes != null
      ? '<span class="hidden text-[var(--fg-muted)] opacity-40 sm:inline" aria-hidden="true">·</span>'
      : '';

  return `
    <li>
      <a href="${href}" data-preserve-list-state-link class="app-card app-card-interactive flex h-full flex-col p-5 text-[var(--fg)]">
        ${
          hasHeaderRow
            ? `<div class="flex flex-wrap items-start justify-between gap-2">
                ${meta.headerBadges.length > 0 ? `<div class="flex flex-wrap gap-1.5">${headerBadgesHtml}</div>` : '<span aria-hidden="true"></span>'}
                ${hasListDates(item) ? buildListDatesHtml(item) : ''}
              </div>`
            : ''
        }
        <h2 class="text-lg font-semibold text-[var(--fg)]${hasHeaderRow ? ' mt-3' : ''}">${escapeHtml(meta.displayTitle)}</h2>
        ${meta.englishName ? `<p class="mt-0.5 text-sm italic text-[var(--fg-muted)]">${escapeHtml(meta.englishName)}</p>` : ''}
        ${meta.excerpt ? `<p class="mt-2 text-sm text-[var(--fg-muted)] line-clamp-3 leading-relaxed">${escapeHtml(meta.excerpt)}</p>` : ''}
        <div class="mt-auto flex items-end justify-between gap-3 pt-4">
          ${
            hasFooterMeta
              ? `<div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">${footerTagsHtml}${readingSeparator}${buildReadingTimeHtml(item.readingMinutes)}</div>`
              : '<span aria-hidden="true"></span>'
          }
          <span class="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[var(--accent)]">
            자세히 보기
            ${ARROW_SVG}
          </span>
        </div>
      </a>
    </li>
  `;
}

export function buildContentListCardHtml(
  item: SerializedContentListItem,
  basePath: string,
  cardType: ContentListCardType,
  listQuery: string,
): string {
  return cardType === 'concept'
    ? buildConceptCardHtml(item, listQuery)
    : buildArticleCardHtml(item, basePath, listQuery);
}
