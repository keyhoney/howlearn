import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkDfrac } from './src/lib/remark-dfrac';
import { rehypeKatexSafeOptions } from './src/lib/katex-shared';
import { mathMdxHowlearnPlugin } from './src/vite-plugins/math-mdx-howlearn';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://howlearn.pages.dev',
  output: 'server',
  integrations: [
    mdx({
      remarkPlugins: [remarkMath, remarkDfrac],
      rehypePlugins: [[rehypeKatex, rehypeKatexSafeOptions]],
    }),
    sitemap(),
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
  adapter: cloudflare(),
});
