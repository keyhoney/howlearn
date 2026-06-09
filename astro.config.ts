import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkDfrac } from './src/lib/remark-dfrac';
import { rehypeKatexSafeOptions } from './src/lib/katex-shared';
import { rehypeImgPerformance } from './src/lib/rehype-img-performance';
import { rehypeConceptLinks } from './src/lib/rehype-concept-links';
import { loadConceptLinkRegistrySync } from './src/lib/concept-links';
import tinaDirective from './astro-tina-directive/register';
import { shouldExcludeFromSitemap } from './src/lib/seo-paths';

const conceptLinkRegistry = loadConceptLinkRegistrySync();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const site =
  (process.env.PUBLIC_SITE_URL || 'https://www.howlearn.kr').replace(/\/+$/, '');

// https://astro.build/config
export default defineConfig({
  site,
  build: {
    // 외부 CSS 링크 대신 HTML에 인라인 → 렌더링 차단(LCP) 완화
    inlineStylesheets: 'always',
  },
  integrations: [
    mdx({
      remarkPlugins: [remarkMath, remarkDfrac],
      rehypePlugins: [
        [rehypeKatex, rehypeKatexSafeOptions],
        rehypeImgPerformance,
        [rehypeConceptLinks, { registry: conceptLinkRegistry }],
      ],
    }),
    sitemap({
      filter: (page) => !shouldExcludeFromSitemap(page),
    }),
    react(),
    tinaDirective(),
  ],
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        tty: path.resolve(__dirname, 'src/shims/tty.ts'),
        util: path.resolve(__dirname, 'src/shims/util.ts'),
      },
    },
    plugins: [tailwindcss()],
  },
});
