import { SITE_TITLE, SITE_URL } from '../consts';
import { PRIMARY_AUTHOR, getAuthorImageUrl, getAuthorProfileUrl, resolveAuthorName } from './author';

type Crumb = { name: string; item: string };

export function buildBreadcrumbJsonLd(items: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

export function buildArticleJsonLd(params: {
  title: string;
  description: string;
  path: string;
  image?: string;
  datePublished?: Date;
  dateModified?: Date;
  author?: string;
}) {
  const url = new URL(params.path, SITE_URL).toString();
  const authorName = resolveAuthorName(params.author);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: params.title,
    description: params.description,
    image: new URL(params.image ?? '/og-default.png', SITE_URL).toString(),
    datePublished: params.datePublished?.toISOString(),
    dateModified: (params.dateModified ?? params.datePublished)?.toISOString(),
    author: {
      '@type': 'Person',
      name: authorName,
      jobTitle: PRIMARY_AUTHOR.title,
      url: getAuthorProfileUrl(),
      image: getAuthorImageUrl(),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_TITLE,
      url: SITE_URL,
    },
    mainEntityOfPage: url,
  };
}

export function buildFaqJsonLd(faq: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildLearningResourceJsonLd(params: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: params.title,
    description: params.description,
    url: new URL(params.path, SITE_URL).toString(),
    inLanguage: 'ko',
    educationalLevel: 'secondary',
    learningResourceType: 'StudyGuide',
    keywords: (params.keywords ?? []).join(', '),
  };
}

export function buildPersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: PRIMARY_AUTHOR.name,
    jobTitle: PRIMARY_AUTHOR.title,
    description: PRIMARY_AUTHOR.summary,
    url: getAuthorProfileUrl(),
    image: getAuthorImageUrl(),
    worksFor: {
      '@type': 'Organization',
      name: SITE_TITLE,
      url: SITE_URL,
    },
  };
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_TITLE,
    url: SITE_URL,
    description:
      '인지과학과 학습 연구를 바탕으로 학부모 가이드, 학습 과학 개념, 수학 학습 칼럼을 제공하는 학습 플랫폼',
    founder: {
      '@type': 'Person',
      name: PRIMARY_AUTHOR.name,
      url: getAuthorProfileUrl(),
      image: getAuthorImageUrl(),
    },
  };
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_TITLE,
    url: SITE_URL,
    description: '학습 과학 기반 가이드, 개념 해설, 수학 학습 칼럼',
    inLanguage: 'ko',
  };
}
