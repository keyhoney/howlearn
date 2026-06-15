import fs from 'node:fs/promises';
import path from 'node:path';

type ContentItem = {
  id: string;
  type: string;
  slug: string;
  title: string;
  summary: string;
  status: 'draft' | 'published';
  tags?: string[];
  relatedContentIds?: string[];
};

type ContentIndex = {
  generatedAt: string;
  count: number;
  items: ContentItem[];
};

const FILE = path.join(process.cwd(), 'data', 'content-index.json');

function fail(errors: string[]): never {
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

async function main() {
  let parsed: ContentIndex;
  try {
    const raw = await fs.readFile(FILE, 'utf8');
    parsed = JSON.parse(raw) as ContentIndex;
  } catch (error) {
    console.error(`content-index read failed: ${FILE}`);
    console.error(error);
    process.exit(1);
    return;
  }

  const errors: string[] = [];
  const warnings: string[] = [];
  const ids = new Set<string>();

  if (!Array.isArray(parsed.items)) {
    fail(['items must be an array']);
  }

  if (typeof parsed.count !== 'number' || parsed.count !== parsed.items.length) {
    errors.push(`count mismatch: count=${parsed.count}, items=${parsed.items.length}`);
  }

  for (const item of parsed.items) {
    if (!item.id) errors.push('missing id');
    if (!item.type) errors.push(`missing type: ${item.id}`);
    if (!item.slug) errors.push(`missing slug: ${item.id}`);
    if (item.id && item.type && item.slug && item.id !== `${item.type}-${item.slug}`) {
      errors.push(`invalid id format: ${item.id} (expected ${item.type}-${item.slug})`);
    }
    if (!item.title) errors.push(`missing title: ${item.id}`);
    if (!item.summary) errors.push(`missing summary: ${item.id}`);
    if (!['draft', 'published'].includes(item.status)) {
      errors.push(`invalid status: ${item.id}`);
    }
    if (item.status === 'published') {
      const summaryLength = String(item.summary ?? '').trim().length;
      if (summaryLength > 0 && (summaryLength < 40 || summaryLength > 200)) {
        warnings.push(`summary length outside 40-200 chars: ${item.id} (${summaryLength})`);
      }
      const tags = Array.isArray(item.tags) ? item.tags : [];
      if ((item.type === 'guide' || item.type === 'concept') && tags.length === 0) {
        warnings.push(`published ${item.type} has no tags: ${item.id}`);
      }
      if ((item.type === 'guide' || item.type === 'concept') && tags.length >= 3 && (!item.relatedContentIds || item.relatedContentIds.length === 0)) {
        warnings.push(`published ${item.type} has 3+ tags but no relatedContentIds: ${item.id}`);
      }
    }

    if (ids.has(item.id)) {
      errors.push(`duplicate id: ${item.id}`);
    } else {
      ids.add(item.id);
    }
  }

  for (const item of parsed.items) {
    const refs = Array.isArray(item.relatedContentIds) ? item.relatedContentIds : [];
    for (const ref of refs) {
      if (!ids.has(ref)) {
        errors.push(`broken related reference: ${item.id} -> ${ref}`);
      }
    }
  }

  if (errors.length > 0) {
    fail(errors);
  }

  if (warnings.length > 0) {
    console.log(`content-index validation warnings: ${warnings.length}`);
    for (const warning of warnings.slice(0, 30)) {
      console.log(`- ${warning}`);
    }
    if (warnings.length > 30) {
      console.log(`- ...and ${warnings.length - 30} more warnings`);
    }
  }

  console.log(
    `content-index validation passed: ${parsed.items.length} items (${FILE})`,
  );
}

main().catch((error) => {
  console.error('content-index validation failed');
  console.error(error);
  process.exit(1);
});
