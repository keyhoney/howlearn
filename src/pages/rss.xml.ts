import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '../consts';
import { getDiscoverableContent } from '../lib/content-utils';
import {
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  resolveOgImageUrl,
  toAbsoluteOgImageUrl,
  type OgContentType,
} from '../lib/og-image';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function ogImageMimeType(url: string): string {
  if (/\.jpe?g($|\?)/i.test(url)) return 'image/jpeg';
  if (/\.webp($|\?)/i.test(url)) return 'image/webp';
  return 'image/png';
}

function mediaContentTag(imageUrl: string): string {
  const url = escapeXml(imageUrl);
  const type = ogImageMimeType(imageUrl);
  return `<media:content url="${url}" medium="image" type="${type}" width="${OG_IMAGE_WIDTH}" height="${OG_IMAGE_HEIGHT}"/>`;
}

/** guides, concepts, columns (published) — books·problems·essay-problems는 제외 */
export const GET: APIRoute = async (context) => {
  const site = String(context.site ?? SITE_URL);
  const items = await getDiscoverableContent();
  const feedItems = items
    .map((item) => {
      const imageUrl = toAbsoluteOgImageUrl(
        resolveOgImageUrl({
          type: item.collection as OgContentType,
          slug: item.id,
          coverImage: item.data.coverImage,
          ogImage: item.data.ogImage,
        }),
        site,
      );
      return {
        title: item.data.title,
        description: item.data.summary,
        pubDate: item.data.publishedAt ?? item.data.updatedAt ?? new Date(),
        link: `/${item.collection}/${item.id}`,
        customData: mediaContentTag(imageUrl),
      };
    })
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf())
    .slice(0, 100);

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site,
    xmlns: {
      media: 'http://search.yahoo.com/mrss/',
    },
    items: feedItems,
  });
};
