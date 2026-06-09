import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type ConceptLinkMeta = {
  title: string;
  shortDefinition: string;
  englishName?: string;
};

export type ConceptLinkRegistry = Record<string, ConceptLinkMeta>;

type ConceptEntryLike = {
  id: string;
  data: {
    title: string;
    shortDefinition?: string;
    englishName?: string;
  };
};

/** `/concepts/foo`, `/concept/foo`, 상대 경로 등에서 slug 추출 */
export function parseConceptHref(href: string): string | null {
  if (!href || href.startsWith('//') || /^https?:/i.test(href)) return null;
  const normalized = href.replace(/^\/+|\/+$/g, '');
  const match = normalized.match(/^(?:concepts?)\/([^/?#]+)/i);
  return match?.[1] ?? null;
}

export function buildConceptLinkRegistry(
  concepts: ConceptEntryLike[],
): ConceptLinkRegistry {
  const registry: ConceptLinkRegistry = {};
  for (const entry of concepts) {
    const shortDefinition = (entry.data.shortDefinition ?? '').trim();
    if (!shortDefinition) continue;
    registry[entry.id] = {
      title: entry.data.title,
      shortDefinition,
      englishName: entry.data.englishName,
    };
  }
  return registry;
}

export type ConceptMention = {
  slug: string;
  title: string;
  shortDefinition?: string;
  englishName?: string;
  published: boolean;
};

/** 본문·FAQ 등 텍스트에서 `/concepts/{slug}` 및 RelatedConcepts slugs 추출 (등장 순, 중복 제거) */
export function extractConceptSlugsFromText(text: string): string[] {
  const ordered: string[] = [];
  const seen = new Set<string>();

  const addSlug = (raw: string) => {
    const slug = raw.trim().replace(/^['"]|['"]$/g, '');
    if (!slug || seen.has(slug)) return;
    seen.add(slug);
    ordered.push(slug);
  };

  const linkPattern = /\/concepts?\/([a-z0-9][a-z0-9-]*)/gi;
  let match: RegExpExecArray | null;
  while ((match = linkPattern.exec(text)) !== null) {
    addSlug(match[1]);
  }

  const slugsPropPattern = /slugs\s*=\s*\{?\s*\[([^\]]*)\]/gi;
  while ((match = slugsPropPattern.exec(text)) !== null) {
    const inner = match[1];
    const parts = inner.match(/"([^"]+)"|'([^']+)'|\b[a-z0-9][a-z0-9-]*\b/gi);
    if (!parts) continue;
    for (const part of parts) {
      addSlug(part.replace(/^["']|["']$/g, ''));
    }
  }

  return ordered;
}

export function buildConceptMentions(
  text: string,
  registry: ConceptLinkRegistry,
  options?: { excludeSlugs?: string[] },
): ConceptMention[] {
  const exclude = new Set(options?.excludeSlugs ?? []);
  return extractConceptSlugsFromText(text)
    .filter((slug) => !exclude.has(slug))
    .map((slug) => {
      const meta = registry[slug];
      if (meta) {
        return {
          slug,
          title: meta.title,
          shortDefinition: meta.shortDefinition,
          englishName: meta.englishName,
          published: true,
        };
      }
      return {
        slug,
        title: slug.replace(/-/g, ' '),
        published: false,
      };
    });
}

export function loadConceptLinkRegistrySync(
  contentDir = path.join(process.cwd(), 'src/content/concepts'),
): ConceptLinkRegistry {
  if (!fs.existsSync(contentDir)) return {};

  const registry: ConceptLinkRegistry = {};
  const files = fs
    .readdirSync(contentDir)
    .filter((name) => name.endsWith('.mdx') || name.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(raw);
    if (data.status !== 'published') continue;

    const slug = String(data.slug ?? file.replace(/\.(mdx|md)$/, ''));
    const shortDefinition = String(
      data.shortDefinition ?? data.description ?? data.summary ?? '',
    ).trim();
    if (!shortDefinition) continue;

    registry[slug] = {
      title: String(data.title ?? slug),
      shortDefinition,
      englishName: data.englishName ? String(data.englishName) : undefined,
    };
  }

  return registry;
}
