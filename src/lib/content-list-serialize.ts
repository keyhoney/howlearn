import type { AnyContentEntry, ContentDomain } from './content-utils';
import { estimateReadingMinutes } from './reading-time';
import {
  resolveLatestRevision,
  resolvePublishedAt,
  type ArticleMetaInput,
  type RevisionKind,
} from './article-meta';

export type ContentListCardType = 'article' | 'concept';

export type SerializedContentListItem = {
  id: string;
  title: string;
  summary?: string;
  description?: string;
  shortDefinition?: string;
  englishName?: string;
  categories?: string[];
  tags?: string[];
  domains?: string[];
  publishedAt?: string;
  latestRevisionAt?: string;
  latestRevisionKind?: RevisionKind;
  readingMinutes?: number;
};

function serializeRevisionFields(data: ArticleMetaInput) {
  const publishedAt = resolvePublishedAt(data);
  const latestRevision = resolveLatestRevision(data, publishedAt);

  return {
    publishedAt: publishedAt?.toISOString(),
    latestRevisionAt: latestRevision?.date.toISOString(),
    latestRevisionKind: latestRevision?.kind,
  };
}

export function serializeContentListItems(
  items: AnyContentEntry[],
  domain: ContentDomain,
): SerializedContentListItem[] {
  return items
    .filter((item) => item.collection === domain)
    .map((item) => {
      const data = item.data as Record<string, unknown>;
      const summary =
        typeof data.summary === 'string'
          ? data.summary
          : typeof data.description === 'string'
            ? data.description
            : undefined;
      const revisionFields = serializeRevisionFields(item.data);

      return {
        id: item.id,
        title: item.data.title,
        summary,
        description: typeof data.description === 'string' ? data.description : undefined,
        shortDefinition:
          typeof data.shortDefinition === 'string' ? data.shortDefinition : undefined,
        englishName: typeof data.englishName === 'string' ? data.englishName : undefined,
        categories: item.data.categories ?? [],
        tags: item.data.tags ?? [],
        domains: item.data.domains ?? [],
        ...revisionFields,
        readingMinutes: item.body ? estimateReadingMinutes(item.body) : undefined,
      };
    });
}
