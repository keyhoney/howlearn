import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { renderOgPng, type OgVisualTheme } from './og-image/render-og-png';

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, 'src', 'content');
const OUTPUT_ROOT = path.join(ROOT, 'public', 'og', 'auto');

type CollectionSpec = {
  dir: string;
  type: 'guides' | 'columns' | 'concepts' | 'books';
  theme: OgVisualTheme;
};

const COLLECTIONS: CollectionSpec[] = [
  {
    dir: 'guides',
    type: 'guides',
    theme: {
      label: '학부모 가이드',
      siteName: 'HowLearn',
      gradient: ['#1d4ed8', '#312e81'],
      accent: '#bfdbfe',
    },
  },
  {
    dir: 'columns',
    type: 'columns',
    theme: {
      label: '학습 칼럼',
      siteName: 'HowLearn',
      gradient: ['#047857', '#134e4a'],
      accent: '#a7f3d0',
    },
  },
  {
    dir: 'concepts',
    type: 'concepts',
    theme: {
      label: '학습 과학',
      siteName: 'HowLearn',
      gradient: ['#6d28d9', '#312e81'],
      accent: '#ddd6fe',
    },
  },
  {
    dir: 'books',
    type: 'books',
    theme: {
      label: '도서 추천',
      siteName: 'HowLearn',
      gradient: ['#b45309', '#7c2d12'],
      accent: '#fde68a',
    },
  },
];

async function listMdxFiles(dir: string): Promise<string[]> {
  const { readdir } = await import('node:fs/promises');
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isFile() && /\.mdx?$/.test(e.name)).map((e) => path.join(dir, e.name));
}

async function generateForCollection(spec: CollectionSpec) {
  const dir = path.join(CONTENT_ROOT, spec.dir);
  const files = await listMdxFiles(dir);
  const outDir = path.join(OUTPUT_ROOT, spec.type);
  await mkdir(outDir, { recursive: true });

  let count = 0;
  for (const file of files) {
    const raw = await readFile(file, 'utf8');
    const { data } = matter(raw.replace(/^\uFEFF/, ''));
    if (data.status === 'draft') continue;

    const title = typeof data.title === 'string' ? data.title.trim() : '';
    if (!title) continue;

    const slug = path.basename(file).replace(/\.mdx?$/, '');
    const outPath = path.join(outDir, `${slug}.png`);
    const png = await renderOgPng(title, spec.theme);
    await writeFile(outPath, png);
    count++;
  }

  return count;
}

async function generateDefault() {
  const png = await renderOgPng('학습 과학 기반 가이드와 칼럼', {
    label: 'HowLearn',
    siteName: '학습 과학',
    gradient: ['#1e3a8a', '#0f172a'],
    accent: '#93c5fd',
  });
  await writeFile(path.join(ROOT, 'public', 'og-default.png'), png);
}

async function main() {
  let total = 0;
  for (const spec of COLLECTIONS) {
    const count = await generateForCollection(spec);
    console.log(`og: ${spec.type} ${count} images`);
    total += count;
  }
  await generateDefault();
  console.log(`og: generated ${total} content images + default`);
}

main().catch((error) => {
  console.error('generate-og-images failed');
  console.error(error);
  process.exit(1);
});
