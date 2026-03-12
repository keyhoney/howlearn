/**
 * 개념 앵커 → 본문 열 정리
 * - guides, concepts 내 모든 MDX에서 ](/concepts/슬러그) 수집
 * - 하우런_개념_작성.md 표: 5열(슬러그) 다음에 "언급 횟수" 열 추가, 6열(언급된 본문), 마지막 열(개념 작성 여부: O/공란)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const GUIDES_DIR = path.join(ROOT, 'blog', 'content', 'guides');
const CONCEPTS_DIR = path.join(ROOT, 'blog', 'content', 'concepts');
const TABLE_PATH = path.join(ROOT, '개발 노트', '개념 정리', '하우런_개념_작성.md');

const CONCEPT_LINK_RE = /\]\(\/concepts\/([a-z0-9-]+)\)/g;

function extractFrontmatterAndBody(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: '', body: content };
  return { frontmatter: match[1], body: match[2] };
}

function getSlugFromFrontmatter(frontmatter) {
  const m = frontmatter.match(/^slug:\s*["']?([^"'\s]+)["']?/m);
  return m ? m[1].trim() : null;
}

/** Returns unique slugs and total count per slug from body */
function extractConceptSlugsAndCount(body) {
  const slugs = new Set();
  const countBySlug = new Map();
  let match;
  CONCEPT_LINK_RE.lastIndex = 0;
  while ((match = CONCEPT_LINK_RE.exec(body)) !== null) {
    const slug = match[1];
    slugs.add(slug);
    countBySlug.set(slug, (countBySlug.get(slug) || 0) + 1);
  }
  return { slugs, countBySlug };
}

/**
 * Scan MDX dir; type is 'guides' | 'concepts' → docRef prefix guides/ or concepts/
 * Returns { docRefs: Map<conceptSlug, Set<"guides/slug">>, counts: Map<conceptSlug, number> }
 */
function scanMdxDir(dir, type) {
  const docRefs = new Map();
  const counts = new Map();
  if (!fs.existsSync(dir)) return { docRefs, counts };
  const prefix = type === 'guides' ? 'guides' : 'concepts';
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));
  for (const file of files) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { frontmatter, body } = extractFrontmatterAndBody(content);
    const docSlug = getSlugFromFrontmatter(frontmatter) || path.basename(file, path.extname(file));
    const docRef = `${prefix}/${docSlug}`;
    const { slugs, countBySlug } = extractConceptSlugsAndCount(body);
    for (const cs of slugs) {
      if (!docRefs.has(cs)) docRefs.set(cs, new Set());
      docRefs.get(cs).add(docRef);
    }
    for (const [cs, n] of countBySlug) {
      counts.set(cs, (counts.get(cs) || 0) + n);
    }
  }
  return { docRefs, counts };
}

function mergeDocRefs(a, b) {
  const out = new Map(a);
  for (const [k, set] of b) {
    if (!out.has(k)) out.set(k, new Set());
    for (const v of set) out.get(k).add(v);
  }
  return out;
}

function mergeCounts(a, b) {
  const out = new Map(a);
  for (const [k, n] of b) {
    out.set(k, (out.get(k) || 0) + n);
  }
  return out;
}

/** List concept slugs that have a file (filename without extension) in concepts dir */
function getConceptWrittenSlugs() {
  const set = new Set();
  if (!fs.existsSync(CONCEPTS_DIR)) return set;
  const files = fs.readdirSync(CONCEPTS_DIR).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));
  for (const f of files) {
    set.add(path.basename(f, path.extname(f)));
  }
  return set;
}

function parseTable(content) {
  const lines = content.split(/\r?\n/);
  const headerRowIndex = lines.findIndex((line) => line.startsWith('|') && line.includes('슬러그') && line.includes('언급된 본문'));
  if (headerRowIndex === -1) throw new Error('Header row not found');
  const dataRows = [];
  for (let i = headerRowIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith('|') || !line.endsWith('|')) continue;
    const cells = line.split('|').map((c) => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
    if (cells.length >= 7) {
      const isSeparator = cells.every((c) => /^-+$/.test(c) || !c);
      if (isSeparator) {
        if (cells.length === 7) {
          const sep = ['---', '---', '---', '---', '---', '---', '---', '---'];
          lines[i] = '| ' + sep.join(' | ') + ' |';
        }
        continue;
      }
      dataRows.push({ index: i, cells });
    }
  }
  return { lines, headerRowIndex, dataRows };
}

function main() {
  const guides = scanMdxDir(GUIDES_DIR, 'guides');
  const concepts = scanMdxDir(CONCEPTS_DIR, 'concepts');

  const conceptToDocs = mergeDocRefs(guides.docRefs, concepts.docRefs);
  const conceptToCount = mergeCounts(guides.counts, concepts.counts);

  const writtenSlugs = getConceptWrittenSlugs();

  const tableContent = fs.readFileSync(TABLE_PATH, 'utf8');
  const { lines, headerRowIndex, dataRows } = parseTable(tableContent);

  const tableSlugs = new Set();
  for (const row of dataRows) {
    const slugCell = row.cells[4];
    if (slugCell) tableSlugs.add(slugCell.trim());
  }

  const unmapped = [];
  for (const slug of conceptToDocs.keys()) {
    if (!tableSlugs.has(slug)) unmapped.push(slug);
  }
  if (unmapped.length) {
    console.log('표에 없는 개념 slug (MDX에만 존재):', unmapped.sort().join(', '));
  }

  const headerCells = lines[headerRowIndex].split('|').map((c) => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
  if (headerCells.length === 7 && !headerCells.includes('언급 횟수')) {
    const newHeader = [...headerCells.slice(0, 5), '언급 횟수', ...headerCells.slice(5)];
    lines[headerRowIndex] = '| ' + newHeader.join(' | ') + ' |';
  }

  const newLines = [...lines];
  for (const row of dataRows) {
    const conceptSlug = row.cells[4].trim();
    const docs = conceptToDocs.get(conceptSlug);
    const count = conceptToCount.get(conceptSlug) || 0;
    const hasWritten = writtenSlugs.has(conceptSlug);

    const cells = row.cells;
    const colCount = String(count);
    const colDocs = docs && docs.size > 0 ? Array.from(docs).sort().join(', ') : '';
    const colWritten = hasWritten ? 'O' : '';

    const newCells = [...cells.slice(0, 5), colCount, colDocs, cells.length >= 7 ? colWritten : ''];
    newLines[row.index] = '| ' + newCells.join(' | ') + ' |';
  }

  fs.writeFileSync(TABLE_PATH, newLines.join('\n'), 'utf8');
  console.log('Updated', TABLE_PATH);
  console.log('Concepts with mentions:', conceptToDocs.size);
  console.log('Concepts written (O):', writtenSlugs.size);
}

main();
