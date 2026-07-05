import fs from 'node:fs/promises';
import path from 'node:path';
import { validateAllLegacyRedirects } from './validate-legacy-redirects';

const DIST_DIR = path.join(process.cwd(), 'dist');

const requiredPaths = [
  'index.html',
  '404.html',
  path.join('guides', 'index.html'),
  path.join('concepts', 'index.html'),
  path.join('books', 'index.html'),
  path.join('columns', 'index.html'),
  path.join('search', 'index.html'),
  'robots.txt',
  'rss.xml',
  'sitemap-index.xml',
  '_redirects',
  ...(process.env.CF_PAGES === '1' || process.env.PUBLIC_ADSENSE_PUBLISHER_ID
    ? (['ads.txt'] as const)
    : []),
  'favicon.png',
  'og-default.png',
  path.join('pagefind', 'pagefind.js'),
];

const GUIDES_INDEX_MARKERS = ['Astro', '학부모 가이드', 'rel="canonical"'] as const;

const GUIDES_STALE_MARKERS = ['learninsight.pages.dev', 'meta-next-size-adjust', '학문별'] as const;

async function exists(filepath: string): Promise<boolean> {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
}

async function validateGuidesIndexHtml(): Promise<void> {
  const guidesPath = path.join(DIST_DIR, 'guides', 'index.html');
  const html = await fs.readFile(guidesPath, 'utf8');

  for (const marker of GUIDES_STALE_MARKERS) {
    if (html.includes(marker)) {
      throw new Error(`guides/index.html contains stale marker: ${marker}`);
    }
  }

  for (const marker of GUIDES_INDEX_MARKERS) {
    if (!html.includes(marker)) {
      throw new Error(`guides/index.html missing required marker: ${marker}`);
    }
  }
}

async function main() {
  const missing: string[] = [];

  for (const rel of requiredPaths) {
    const full = path.join(DIST_DIR, rel);
    if (!(await exists(full))) {
      missing.push(rel);
    }
  }

  if (missing.length > 0) {
    console.error('smoke-check failed: missing build outputs');
    for (const rel of missing) {
      console.error(`- ${rel}`);
    }
    process.exit(1);
  }

  await validateGuidesIndexHtml();
  await validateAllLegacyRedirects(path.join(DIST_DIR, '_redirects'));

  console.log(`smoke-check passed: ${requiredPaths.length} critical outputs verified`);
}

main().catch((error) => {
  console.error('smoke-check failed unexpectedly');
  console.error(error);
  process.exit(1);
});
