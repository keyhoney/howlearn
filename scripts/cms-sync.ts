import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

type ContentType = 'guide' | 'concept' | 'book' | 'column';

type ContentItem = {
  id: string;
  type: ContentType;
  slug: string;
  title: string;
  summary: string;
  status: 'draft' | 'published';
  body: string;
  tags: string[];
  domains: string[];
  categories: string[];
  relatedContentIds: string[];
  publishedAt?: string;
};

type CmsBundle = {
  generatedAt: string;
  count: number;
  items: ContentItem[];
};

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, 'src', 'content');
const OUTPUT_DIR = path.join(ROOT, 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'content-index.json');
const CMS_OUTPUT_DIR = path.join(OUTPUT_DIR, 'cms');

const COLLECTIONS: Array<{ dir: string; type: ContentType }> = [
  { dir: 'guides', type: 'guide' },
  { dir: 'concepts', type: 'concept' },
  { dir: 'books', type: 'book' },
  { dir: 'columns', type: 'column' },
];

function ensureStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === 'string')
    .map((v) => v.trim())
    .filter(Boolean);
}

function normalizeStatus(value: unknown): 'draft' | 'published' {
  return value === 'draft' ? 'draft' : 'published';
}

async function readContentFiles(dirPath: string): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const nested = await readContentFiles(fullPath);
      files.push(...nested);
      continue;
    }

    if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function toIsoDate(value: unknown): string | undefined {
  if (!value) return undefined;
  const date = new Date(String(value));
  if (Number.isNaN(date.valueOf())) return undefined;
  return date.toISOString();
}

async function main() {
  const groupedItems: Record<ContentType, ContentItem[]> = {
    guide: [],
    concept: [],
    book: [],
    column: [],
  };

  for (const { dir, type } of COLLECTIONS) {
    const dirPath = path.join(CONTENT_ROOT, dir);
    let files: string[] = [];
    try {
      files = await readContentFiles(dirPath);
    } catch {
      continue;
    }

    for (const filePath of files) {
      const raw = await fs.readFile(filePath, 'utf8');
      const parsed = matter(raw);
      const slug = path
        .relative(dirPath, filePath)
        .replace(/\\/g, '/')
        .replace(/\.(md|mdx)$/i, '');

      const title =
        typeof parsed.data.title === 'string' ? parsed.data.title.trim() : '';
      const summary =
        typeof parsed.data.summary === 'string' ? parsed.data.summary.trim() : '';

      const item: ContentItem = {
        id: `${type}-${slug}`,
        type,
        slug,
        title,
        summary,
        status: normalizeStatus(parsed.data.status),
        body: parsed.content ?? '',
        tags: ensureStringArray(parsed.data.tags),
        domains: ensureStringArray(parsed.data.domains),
        categories: ensureStringArray(parsed.data.categories),
        relatedContentIds: ensureStringArray(parsed.data.relatedContentIds),
        publishedAt: toIsoDate(parsed.data.publishedAt),
      };

      groupedItems[type].push(item);
    }
  }

  const allItems = [
    ...groupedItems.guide,
    ...groupedItems.concept,
    ...groupedItems.book,
    ...groupedItems.column,
  ];

  const bundle = (items: ContentItem[]): CmsBundle => ({
    generatedAt: new Date().toISOString(),
    count: items.length,
    items,
  });

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(CMS_OUTPUT_DIR, { recursive: true });

  await Promise.all([
    fs.writeFile(
      path.join(CMS_OUTPUT_DIR, 'guides.json'),
      JSON.stringify(bundle(groupedItems.guide), null, 2),
      'utf8',
    ),
    fs.writeFile(
      path.join(CMS_OUTPUT_DIR, 'concepts.json'),
      JSON.stringify(bundle(groupedItems.concept), null, 2),
      'utf8',
    ),
    fs.writeFile(
      path.join(CMS_OUTPUT_DIR, 'books.json'),
      JSON.stringify(bundle(groupedItems.book), null, 2),
      'utf8',
    ),
  ]);

  await fs.writeFile(
    OUTPUT_FILE,
    JSON.stringify(bundle(allItems), null, 2),
    'utf8',
  );

  console.log(`cms-sync complete: ${allItems.length} items -> ${OUTPUT_FILE}`);
  console.log(`cms-sync bundle files written -> ${CMS_OUTPUT_DIR}`);
}

main().catch((error) => {
  console.error('cms-sync failed');
  console.error(error);
  process.exit(1);
});
