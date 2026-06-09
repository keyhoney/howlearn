export type ConceptCardInput = {
  title: string;
  englishName?: string;
  categories?: string[];
  tags?: string[];
  shortDefinition?: string;
  publishedAt?: Date;
};

export type ArticleListCardInput = {
  title: string;
  summary?: string;
  description?: string;
  categories?: string[];
  tags?: string[];
  domains?: string[];
  publishedAt?: Date;
};

export type ArticleListCardMeta = {
  displayTitle: string;
  excerpt: string;
  headerBadges: string[];
  footerTags: string[];
};

export type GuideCardInput = ArticleListCardInput;
export type GuideCardMeta = ArticleListCardMeta;

const DOMAIN_CATEGORY_LABELS: Record<string, string> = {
  'cognitive-psychology': '인지심리학',
  neuroscience: '신경과학',
  'educational-psychology': '교육심리학',
  'developmental-psychology': '발달심리학',
  'motivation-emotion': '동기 및 정서심리학',
};

function domainsToCategoryLabels(domains?: string[]): string[] {
  return uniqueStrings(
    (domains ?? [])
      .map((slug) => DOMAIN_CATEGORY_LABELS[slug])
      .filter((label): label is string => Boolean(label)),
    2,
  );
}

function resolveArticleCategories(data: ArticleListCardInput): string[] {
  const fromFrontmatter = data.categories ?? [];
  if (fromFrontmatter.length > 0) return fromFrontmatter;
  return domainsToCategoryLabels(data.domains);
}

export type ConceptCardMeta = {
  displayTitle: string;
  englishName?: string;
  excerpt: string;
  headerBadges: string[];
  footerTags: string[];
};

/** `작업 기억: …` 형태 제목에서 개념명만 추출 */
export function parseConceptDisplayTitle(title: string): string {
  const colonIdx = title.indexOf(':');
  if (colonIdx <= 0) return title.trim();
  return title.slice(0, colonIdx).trim();
}

function uniqueStrings(items: string[], max: number): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of items) {
    const trimmed = item.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
    if (result.length >= max) break;
  }
  return result;
}

function resolveListCardBadges(categories: string[], tags: string[]) {
  let headerBadges: string[] = [];

  if (categories.length >= 2) {
    headerBadges = uniqueStrings(categories, 2);
  } else if (categories.length === 1) {
    headerBadges = [categories[0].trim()];
  } else {
    headerBadges = uniqueStrings(tags, 2);
  }

  const headerSet = new Set(headerBadges);
  let footerTags = uniqueStrings(
    tags.filter((t) => !headerSet.has(t.trim())),
    3,
  );

  if (footerTags.length === 0) {
    footerTags = uniqueStrings(
      categories.filter((c) => !headerSet.has(c.trim())),
      3,
    );
  }

  if (footerTags.length === 0) {
    footerTags = uniqueStrings(tags, 3);
  }

  return { headerBadges, footerTags };
}

export function resolveConceptCardMeta(data: ConceptCardInput): ConceptCardMeta {
  const categories = data.categories ?? [];
  const tags = data.tags ?? [];
  const { headerBadges, footerTags } = resolveListCardBadges(categories, tags);

  return {
    displayTitle: parseConceptDisplayTitle(data.title),
    englishName: data.englishName?.trim() || undefined,
    excerpt: (data.shortDefinition ?? '').trim(),
    headerBadges,
    footerTags,
  };
}

export function resolveArticleListCardMeta(data: ArticleListCardInput): ArticleListCardMeta {
  const categories = resolveArticleCategories(data);
  const tags = data.tags ?? [];
  const { headerBadges, footerTags } = resolveListCardBadges(categories, tags);

  return {
    displayTitle: data.title.trim(),
    excerpt: (data.summary ?? data.description ?? '').trim(),
    headerBadges,
    footerTags,
  };
}

/** @deprecated ArticleListCardInput 사용 */
export function resolveGuideCardMeta(data: GuideCardInput): GuideCardMeta {
  return resolveArticleListCardMeta(data);
}
