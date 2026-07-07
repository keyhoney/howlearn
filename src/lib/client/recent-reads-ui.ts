import { getRecentReads } from './reading-history';

const domainLabels: Record<string, string> = {
  guides: '가이드',
  concepts: '개념',
  columns: '칼럼',
  books: '도서',
};

function escapeHtml(text: string): string {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function initRecentReads(): void {
  document.querySelectorAll('[data-recent-reads-root]').forEach((root) => {
    if (!(root instanceof HTMLElement)) return;
    const limit = Number.parseInt(root.dataset.limit ?? '5', 10);
    const items = getRecentReads(Number.isFinite(limit) && limit > 0 ? limit : 5);
    const list = root.querySelector('[data-recent-reads-list]');
    const empty = root.querySelector('[data-recent-reads-empty]');
    if (!(list instanceof HTMLElement)) return;

    if (items.length === 0) {
      root.classList.add('hidden');
      return;
    }

    root.classList.remove('hidden');
    empty?.classList.add('hidden');
    const variant = root.dataset.recentReadsVariant ?? 'default';
    const isSidebar = variant === 'sidebar';
    const linkClass = isSidebar
      ? 'block rounded-sm px-2 py-2 text-sm text-[var(--sidebar-fg)] hover:bg-[var(--sidebar-bg-active)]'
      : 'block rounded-sm px-2 py-2 text-sm text-[var(--fg)] hover:bg-[var(--surface-2)]';
    const labelClass = isSidebar
      ? 'mt-0.5 block text-xs text-[var(--sidebar-fg-muted)]'
      : 'mt-0.5 block text-xs text-[var(--fg-muted)]';

    list.innerHTML = items
      .map((item) => {
        const label = domainLabels[item.domain] ?? '콘텐츠';
        return `<li>
          <a href="${escapeHtml(item.url)}" class="${linkClass}">
            <span class="block truncate font-medium">${escapeHtml(item.title)}</span>
            <span class="${labelClass}">${escapeHtml(label)}</span>
          </a>
        </li>`;
      })
      .join('');
  });
}
