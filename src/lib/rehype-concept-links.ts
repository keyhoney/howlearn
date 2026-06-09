import type { Element, Root } from 'hast';
import { visit } from 'unist-util-visit';
import { parseConceptHref, type ConceptLinkRegistry } from './concept-links';

const UNPUBLISHED_CLASS = 'hl-concept-unpublished';
const LINK_CLASS = 'hl-concept-link';

function appendClass(node: Element, className: string) {
  const existing = node.properties?.className;
  if (Array.isArray(existing)) {
    if (!existing.includes(className)) existing.push(className);
    return;
  }
  if (typeof existing === 'string') {
    node.properties ??= {};
    node.properties.className = existing.includes(className)
      ? existing
      : `${existing} ${className}`.trim();
    return;
  }
  node.properties ??= {};
  node.properties.className = className;
}

function getHref(node: Element): string | null {
  const href = node.properties?.href;
  if (typeof href === 'string') return href;
  if (Array.isArray(href) && typeof href[0] === 'string') return href[0];
  return null;
}

/**
 * MDX 본문의 `/concepts/{slug}` 링크에 메타데이터·스타일을 부여한다.
 * 미발행 개념은 클릭 불가 span으로 변환한다.
 */
export function rehypeConceptLinks(options: { registry: ConceptLinkRegistry }) {
  const { registry } = options;

  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'a') return;

      const href = getHref(node);
      if (!href) return;

      const slug = parseConceptHref(href);
      if (!slug) return;

      const meta = registry[slug];
      if (!meta) {
        node.tagName = 'span';
        delete node.properties?.href;
        appendClass(node, UNPUBLISHED_CLASS);
        node.properties ??= {};
        node.properties.title = '콘텐츠 준비 중입니다';
        return;
      }

      appendClass(node, LINK_CLASS);
      node.properties ??= {};
      node.properties['data-concept-slug'] = slug;
      node.properties['data-concept-title'] = meta.title;
      node.properties['data-concept-def'] = meta.shortDefinition;
      if (!node.properties.title) {
        node.properties.title = meta.shortDefinition;
      }
    });
  };
}
