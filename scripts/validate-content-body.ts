import fs from 'node:fs/promises';
import path from 'node:path';
import { glob } from 'node:fs/promises';

const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content');

const THRESHOLDS = {
  default: { warn: 1200, error: 800 },
  book: { warn: 1500, error: 1000 },
} as const;

function stripMdxBody(raw: string): string {
  const withoutFrontmatter = raw.replace(/^---[\s\S]*?---\s*/, '');
  return withoutFrontmatter
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_`~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function collectionType(dirName: string): keyof typeof THRESHOLDS | 'default' {
  if (dirName === 'books') return 'book';
  return 'default';
}

async function main() {
  const warnings: string[] = [];
  const errors: string[] = [];

  for await (const entry of glob('**/*.{md,mdx}', { cwd: CONTENT_ROOT })) {
    const fullPath = path.join(CONTENT_ROOT, entry);
    const raw = await fs.readFile(fullPath, 'utf8');
    if (!/status:\s*published/m.test(raw)) continue;

    const dirName = entry.split(/[\\/]/)[0] ?? '';
    const thresholds = THRESHOLDS[collectionType(dirName)] ?? THRESHOLDS.default;
    const length = stripMdxBody(raw).length;

    if (length < thresholds.error) {
      errors.push(`${entry}: body ${length} chars (< ${thresholds.error})`);
    } else if (length < thresholds.warn) {
      warnings.push(`${entry}: body ${length} chars (< ${thresholds.warn})`);
    }
  }

  if (warnings.length > 0) {
    console.log(`content-body validation warnings: ${warnings.length}`);
    for (const warning of warnings.slice(0, 20)) {
      console.log(`- ${warning}`);
    }
    if (warnings.length > 20) {
      console.log(`- ...and ${warnings.length - 20} more warnings`);
    }
  }

  if (errors.length > 0) {
    console.error('content-body validation failed');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log('content-body validation passed');
}

main().catch((error) => {
  console.error('content-body validation failed unexpectedly');
  console.error(error);
  process.exit(1);
});
