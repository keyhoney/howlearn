import { buildContentListCardHtml } from '../content-list-card-html';
import type { ContentListCardType, SerializedContentListItem } from '../content-list-serialize';

type ContentListPageConfig = {
  basePath: string;
  cardType: ContentListCardType;
  items: SerializedContentListItem[];
  countSuffix: string;
  showTagFilter?: boolean;
};

const PER_PAGE_OPTIONS = [12, 24, 48] as const;

function normalizedIncludes(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

function parsePage(raw: string | null): number {
  const page = Number.parseInt(raw ?? '1', 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

function parsePerPage(raw: string | null): number {
  const perPage = Number.parseInt(raw ?? '12', 10);
  return PER_PAGE_OPTIONS.includes(perPage as (typeof PER_PAGE_OPTIONS)[number]) ? perPage : 12;
}

function sortByDate(items: SerializedContentListItem[]): SerializedContentListItem[] {
  return [...items].sort((a, b) => {
    const da = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const db = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return db - da;
  });
}

function filterItems(
  items: SerializedContentListItem[],
  q: string,
  tag: string,
): SerializedContentListItem[] {
  return items.filter((item) => {
    if (tag && !(item.tags ?? []).includes(tag)) return false;
    if (!q) return true;

    const keywords = [
      item.title,
      item.summary,
      item.description,
      item.shortDefinition,
      item.englishName,
      ...(item.tags ?? []),
      ...(item.domains ?? []),
      ...(item.categories ?? []),
    ]
      .filter(Boolean)
      .join(' ');

    return normalizedIncludes(keywords, q);
  });
}

function paginateItems(items: SerializedContentListItem[], page: number, perPage: number) {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    currentPage,
    totalPages,
    totalItems,
    perPage,
  };
}

function attachPreserveQueryLinks(listQuery: string) {
  if (!listQuery) return;
  document.querySelectorAll('a[data-preserve-list-state-link]').forEach((anchor) => {
    if (!(anchor instanceof HTMLAnchorElement)) return;
    const href = anchor.getAttribute('href');
    if (!href || href.includes('?')) return;
    anchor.setAttribute('href', `${href}${listQuery}`);
  });
}

function renderPagination(
  root: HTMLElement,
  basePath: string,
  currentPage: number,
  totalPages: number,
  perPage: number,
) {
  const render = () => {
    if (typeof window.__howlearnRenderAppPagination !== 'function') return false;
    window.__howlearnRenderAppPagination(root, {
      basePath,
      currentPage,
      totalPages,
      perPage,
    });
    return true;
  };

  if (render()) return;
  let retries = 0;
  const tick = () => {
    if (render()) return;
    retries += 1;
    if (retries < 20) window.setTimeout(tick, 50);
  };
  tick();
}

export function initContentListPage(config: ContentListPageConfig) {
  const listRoot = document.getElementById('content-list-results');
  const countEl = document.querySelector('[data-content-list-count]');
  const paginationRoot = document.getElementById('content-list-pagination');
  const tagChip = document.querySelector('[data-content-list-tag-chip]');
  if (!listRoot || !countEl || !paginationRoot) return;

  const params = new URLSearchParams(window.location.search);
  const q = params.get('q') ?? '';
  const tag = config.showTagFilter ? (params.get('tag') ?? '') : '';
  const page = parsePage(params.get('page'));
  const perPage = parsePerPage(params.get('perPage'));

  const filtered = sortByDate(filterItems(config.items, q, tag));
  const paged = paginateItems(filtered, page, perPage);
  const listQuery = window.location.search || '';

  listRoot.innerHTML = paged.items
    .map((item) => buildContentListCardHtml(item, config.basePath, config.cardType, listQuery))
    .join('');

  countEl.textContent = `총 ${paged.totalItems}${config.countSuffix}`;
  if (tagChip instanceof HTMLElement) {
    tagChip.textContent = tag ? `선택 태그: ${tag}` : '';
    tagChip.classList.toggle('hidden', !tag);
  }

  renderPagination(paginationRoot, config.basePath, paged.currentPage, paged.totalPages, perPage);
  attachPreserveQueryLinks(listQuery);

  const form = document.querySelector('[data-content-filter-form]');
  if (form instanceof HTMLFormElement) {
    form.addEventListener('submit', () => {
      if (form.querySelector('input[name="page"]')) return;
      const pageField = document.createElement('input');
      pageField.type = 'hidden';
      pageField.name = 'page';
      pageField.value = '1';
      form.appendChild(pageField);
    });
  }
}
