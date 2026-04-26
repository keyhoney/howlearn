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
import { mathMdxHowlearnPlugin } from './src/vite-plugins/math-mdx-howlearn';
import tinaDirective from './astro-tina-directive/register';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const site =
  (process.env.PUBLIC_SITE_URL || 'https://howlearn.pages.dev').replace(/\/+$/, '');

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [
    mdx({
      remarkPlugins: [remarkMath, remarkDfrac],
      rehypePlugins: [[rehypeKatex, rehypeKatexSafeOptions]],
    }),
    sitemap(),
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
    plugins: [tailwindcss(), mathMdxHowlearnPlugin()],
  },
});
