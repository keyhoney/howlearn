import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '../consts';
import { getAllContent } from '../lib/content-utils';

export const GET: APIRoute = async (context) => {
  const items = await getAllContent();
  const feedItems = items
    .map((item) => ({
      title: item.data.title,
      description: item.data.summary,
      pubDate: item.data.publishedAt ?? item.data.updatedAt ?? new Date(),
      link: `/${item.collection}/${item.id}`,
    }))
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf())
    .slice(0, 100);

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site ?? SITE_URL,
    items: feedItems,
  });
};
