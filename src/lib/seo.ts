import { SITE_TITLE, SITE_URL } from '../consts';

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
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: params.title,
    description: params.description,
    image: new URL(params.image ?? '/og-default.png', SITE_URL).toString(),
    datePublished: params.datePublished?.toISOString(),
    dateModified: (params.dateModified ?? params.datePublished)?.toISOString(),
    author: {
      '@type': 'Organization',
      name: params.author ?? SITE_TITLE,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_TITLE,
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
