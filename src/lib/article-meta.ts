import { resolveAuthorName } from './author';

export type ArticleMetaInput = {
  author?: string;
  publishedAt?: Date;
  updatedAt?: Date;
  datePublished?: Date;
  dateModified?: Date;
  dateReviewed?: Date;
};

export type RevisionKind = 'updated' | 'reviewed';

export type LatestRevision = {
  date: Date;
  kind: RevisionKind;
};

export type ResolvedArticleMeta = {
  author: string;
  publishedAt?: Date;
  latestRevision?: LatestRevision;
};

export type ResolvedListArticleDates = {
  publishedAt?: Date;
  latestRevision?: LatestRevision;
};

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getRevisionKindLabel(kind: RevisionKind): string {
  return kind === 'reviewed' ? '검토' : '수정';
}

export function resolvePublishedAt(data: ArticleMetaInput): Date | undefined {
  return data.publishedAt ?? data.datePublished;
}

export function resolveLatestRevision(
  data: ArticleMetaInput,
  publishedAt = resolvePublishedAt(data),
): LatestRevision | undefined {
  const updatedRaw = data.updatedAt ?? data.dateModified;
  const reviewedRaw = data.dateReviewed;

  const candidates: LatestRevision[] = [];
  if (updatedRaw) candidates.push({ date: updatedRaw, kind: 'updated' });
  if (reviewedRaw) candidates.push({ date: reviewedRaw, kind: 'reviewed' });

  if (candidates.length === 0) return undefined;

  const latest = candidates.reduce((best, current) => {
    const bestTime = best.date.getTime();
    const currentTime = current.date.getTime();
    if (currentTime > bestTime) return current;
    if (currentTime < bestTime) return best;
    return current.kind === 'reviewed' ? current : best;
  });

  if (publishedAt && isSameCalendarDay(latest.date, publishedAt)) {
    return undefined;
  }

  return latest;
}

export function resolveListArticleDates(data: ArticleMetaInput): ResolvedListArticleDates {
  const publishedAt = resolvePublishedAt(data);
  return {
    publishedAt,
    latestRevision: resolveLatestRevision(data, publishedAt),
  };
}

export function resolveArticleMeta(data: ArticleMetaInput): ResolvedArticleMeta {
  const author = resolveAuthorName(data.author);
  const publishedAt = resolvePublishedAt(data);

  return {
    author,
    publishedAt,
    latestRevision: resolveLatestRevision(data, publishedAt),
  };
}

export function formatArticleDate(value: Date): string {
  return value.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatArticleDateShort(value: Date): string {
  return value.toLocaleDateString('ko-KR');
}
