import { useEffect, useId, useRef, useState } from 'react';
import { parseConceptHref, type ConceptLinkRegistry } from '@/lib/concept-links';

type TooltipState = {
  title: string;
  definition: string;
  englishName?: string;
  top: number;
  left: number;
};

type ConceptTooltipEnhancerProps = {
  registry: ConceptLinkRegistry;
  currentConceptSlug?: string | null;
  articleSelector?: string;
};

function replaceWithSpan(anchor: HTMLAnchorElement, className: string, title?: string) {
  const span = document.createElement('span');
  span.className = className;
  if (title) span.title = title;
  span.textContent = anchor.textContent;
  anchor.replaceWith(span);
}

function readAnchorPosition(anchor: HTMLAnchorElement): Pick<TooltipState, 'top' | 'left'> {
  const rect = anchor.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left + rect.width / 2,
  };
}

export function ConceptTooltipEnhancer({
  registry,
  currentConceptSlug = null,
  articleSelector = 'article[data-concept-tooltip-root]',
}: ConceptTooltipEnhancerProps) {
  const tooltipId = useId();
  const hideTimer = useRef<number | null>(null);
  const activeAnchor = useRef<HTMLAnchorElement | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const clearHideTimer = () => {
    if (hideTimer.current != null) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  useEffect(() => {
    const root = document.querySelector(articleSelector);
    if (!root) return;

    root.querySelectorAll('a[href]').forEach((node) => {
      if (!(node instanceof HTMLAnchorElement)) return;
      const slug = parseConceptHref(node.getAttribute('href') ?? '');
      if (!slug) return;

      if (currentConceptSlug && slug === currentConceptSlug) {
        replaceWithSpan(node, 'hl-concept-self');
        return;
      }

      const meta = registry[slug];
      if (!meta) {
        replaceWithSpan(node, 'hl-concept-unpublished', '콘텐츠 준비 중입니다');
        return;
      }

      node.classList.add('hl-concept-link');
      node.dataset.conceptSlug = slug;
      if (!node.title) node.title = meta.shortDefinition;
    });

    const scheduleHide = () => {
      clearHideTimer();
      hideTimer.current = window.setTimeout(() => {
        activeAnchor.current?.removeAttribute('aria-describedby');
        activeAnchor.current = null;
        setTooltip(null);
      }, 120);
    };

    const showForAnchor = (anchor: HTMLAnchorElement) => {
      const slug = anchor.dataset.conceptSlug ?? parseConceptHref(anchor.getAttribute('href') ?? '');
      if (!slug) return;
      const meta = registry[slug];
      if (!meta) return;

      clearHideTimer();
      activeAnchor.current = anchor;
      anchor.setAttribute('aria-describedby', tooltipId);
      setTooltip({
        title: meta.title,
        definition: meta.shortDefinition,
        englishName: meta.englishName,
        ...readAnchorPosition(anchor),
      });
    };

    const onPointerOver = (event: Event) => {
      const target = (event.target as Element | null)?.closest('a.hl-concept-link');
      if (!(target instanceof HTMLAnchorElement) || !root.contains(target)) return;
      if (event instanceof PointerEvent && event.pointerType === 'touch') return;
      showForAnchor(target);
    };

    const onPointerOut = (event: Event) => {
      const target = (event.target as Element | null)?.closest('a.hl-concept-link');
      if (!(target instanceof HTMLAnchorElement)) return;
      const related = (event as PointerEvent).relatedTarget as Element | null;
      if (related?.closest('[data-concept-tooltip-panel]')) return;
      scheduleHide();
    };

    const onFocusIn = (event: Event) => {
      const target = (event.target as Element | null)?.closest('a.hl-concept-link');
      if (!(target instanceof HTMLAnchorElement) || !root.contains(target)) return;
      showForAnchor(target);
    };

    const onFocusOut = (event: Event) => {
      const related = (event as FocusEvent).relatedTarget as Element | null;
      if (related?.closest('[data-concept-tooltip-panel]')) return;
      scheduleHide();
    };

    const reposition = () => {
      const anchor = activeAnchor.current;
      if (!anchor) return;
      setTooltip((current) =>
        current ? { ...current, ...readAnchorPosition(anchor) } : current,
      );
    };

    root.addEventListener('pointerover', onPointerOver);
    root.addEventListener('pointerout', onPointerOut);
    root.addEventListener('focusin', onFocusIn);
    root.addEventListener('focusout', onFocusOut);
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);

    return () => {
      clearHideTimer();
      activeAnchor.current?.removeAttribute('aria-describedby');
      activeAnchor.current = null;
      root.removeEventListener('pointerover', onPointerOver);
      root.removeEventListener('pointerout', onPointerOut);
      root.removeEventListener('focusin', onFocusIn);
      root.removeEventListener('focusout', onFocusOut);
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [articleSelector, currentConceptSlug, registry, tooltipId]);

  if (!tooltip) return null;

  return (
    <div
      data-concept-tooltip-panel
      id={tooltipId}
      role="tooltip"
      className="hl-concept-tooltip"
      style={{
        position: 'fixed',
        top: tooltip.top,
        left: tooltip.left,
        transform: 'translate(-50%, calc(-100% - 10px))',
        zIndex: 60,
      }}
      onPointerEnter={clearHideTimer}
      onPointerLeave={() => setTooltip(null)}
    >
      <p className="hl-concept-tooltip__kicker">개념</p>
      <p className="hl-concept-tooltip__title">{tooltip.title}</p>
      {tooltip.englishName ? (
        <p className="hl-concept-tooltip__english">{tooltip.englishName}</p>
      ) : null}
      <p className="hl-concept-tooltip__definition">{tooltip.definition}</p>
      <p className="hl-concept-tooltip__hint">클릭하면 개념 글로 이동합니다</p>
    </div>
  );
}
