export type ArticleMetaInput = {
  author?: string;
  publishedAt?: Date;
  updatedAt?: Date;
  datePublished?: Date;
  dateModified?: Date;
  dateReviewed?: Date;
};

export type ResolvedArticleMeta = {
  author: string;
  publishedAt?: Date;
  updatedAt?: Date;
  reviewedAt?: Date;
};

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function resolveArticleMeta(data: ArticleMetaInput): ResolvedArticleMeta {
  const author = (data.author ?? '하우런').trim() || '하우런';
  const publishedAt = data.publishedAt ?? data.datePublished;
  const updatedRaw = data.updatedAt ?? data.dateModified;
  const reviewedRaw = data.dateReviewed;

  const updatedAt =
    updatedRaw && publishedAt && isSameCalendarDay(updatedRaw, publishedAt)
      ? undefined
      : updatedRaw;

  const reviewedAt =
    reviewedRaw && publishedAt && isSameCalendarDay(reviewedRaw, publishedAt)
      ? undefined
      : reviewedRaw;

  return {
    author,
    publishedAt,
    updatedAt,
    reviewedAt,
  };
}

export function formatArticleDate(value: Date): string {
  return value.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
