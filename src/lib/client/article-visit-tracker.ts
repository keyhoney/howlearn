import {
  enqueueConceptsFromArticle,
  recordConceptVisit,
  recordRecentRead,
  type PendingConcept,
} from './reading-history';

function parseConceptSlugs(raw: string | null): PendingConcept[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => {
        if (typeof item === 'string') return { slug: item, title: item };
        if (item && typeof item === 'object' && 'slug' in item) {
          const slug = String((item as { slug: string }).slug || '').trim();
          const title = String((item as { title?: string }).title || slug).trim();
          return slug ? { slug, title } : null;
        }
        return null;
      })
      .filter((item): item is PendingConcept => Boolean(item));
  } catch {
    return [];
  }
}

function trackArticleVisit(root: HTMLElement): void {
  const url = root.getAttribute('data-article-url') || window.location.pathname;
  const title = root.getAttribute('data-article-title') || document.title;
  const domain = root.getAttribute('data-article-domain') || 'guides';
  const isConcept = domain === 'concepts';
  const slug = root.getAttribute('data-article-slug') || '';

  if (isConcept && slug) {
    recordConceptVisit(slug);
  } else {
    recordRecentRead({ url, title, domain });
    const concepts = parseConceptSlugs(root.getAttribute('data-concept-slugs'));
    if (concepts.length) enqueueConceptsFromArticle(concepts);
  }

}

function initTracker(root: HTMLElement): void {
  if (root.getAttribute('data-article-visit-tracked') === '1') return;

  const fire = () => {
    if (root.getAttribute('data-article-visit-tracked') === '1') return;
    root.setAttribute('data-article-visit-tracked', '1');
    trackArticleVisit(root);
  };

  const articleRoot =
    document.querySelector<HTMLElement>('article[data-reading-progress-root]') ||
    document.querySelector<HTMLElement>('article');

  const onScroll = () => {
    if (!articleRoot) {
      fire();
      return;
    }
    const rect = articleRoot.getBoundingClientRect();
    const scrollY = window.scrollY;
    const rootTop = scrollY + rect.top;
    const scrollable = articleRoot.scrollHeight - window.innerHeight;
    if (scrollable <= 0) {
      fire();
      return;
    }
    const ratio = (scrollY - rootTop) / scrollable;
    if (ratio >= 0.2) fire();
  };

  window.setTimeout(fire, 4000);
  window.addEventListener('scroll', onScroll, { passive: true, once: false });
  window.addEventListener('pagehide', fire, { once: true });
}

export function initArticleVisitTrackers(): void {
  document.querySelectorAll<HTMLElement>('[data-article-visit]').forEach((root) => {
    initTracker(root);
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initArticleVisitTrackers());
  } else {
    initArticleVisitTrackers();
  }
}
