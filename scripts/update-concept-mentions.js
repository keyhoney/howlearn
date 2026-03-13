/**
 * 개념 앵커 → 본문 열 정리
 * - guides, concepts 내 모든 MDX에서 ](/concepts/슬러그) 또는 ](/concept/슬러그) 수집
 * - 집계: 문서당 슬러그 1회만 (같은 문서에서 동일 슬러그를 여러 번 링크해도 +1)
 * - 하우런_개념_작성.md 표: 5열(슬러그) 다음에 "언급 문서 수" 열(문서당 슬러그 1회 집계), 6열(언급된 본문), 마지막 열(개념 작성 여부: O/공란)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const GUIDES_DIR = path.join(ROOT, 'blog', 'content', 'guides');
const CONCEPTS_DIR = path.join(ROOT, 'blog', 'content', 'concepts');
const TABLE_PATH = path.join(ROOT, '개발 노트', '개념 정리', '하우런_개념_작성.md');

// 앱 라우트는 /concepts/ 복수. 본문에 /concept/ 단수로 쓴 링크도 집계에 포함
const CONCEPT_LINK_RE = /\]\(\/concepts?\/([a-z0-9-]+)\)/g;

function extractFrontmatterAndBody(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: '', body: content };
  return { frontmatter: match[1], body: match[2] };
}

function getSlugFromFrontmatter(frontmatter) {
  const m = frontmatter.match(/^slug:\s*["']?([^"'\s]+)["']?/m);
  return m ? m[1].trim() : null;
}

/** Returns unique slugs in body (same slug repeated in one doc → one entry) */
function extractConceptSlugs(body) {
  const slugs = new Set();
  let match;
  CONCEPT_LINK_RE.lastIndex = 0;
  while ((match = CONCEPT_LINK_RE.exec(body)) !== null) {
    slugs.add(match[1]);
  }
  return slugs;
}

/**
 * Scan MDX dir; type is 'guides' | 'concepts' → docRef prefix guides/ or concepts/
 * counts: 문서 수 기준 — 한 문서에서 같은 슬러그를 여러 번 써도 +1만
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
    const slugs = extractConceptSlugs(body);
    for (const cs of slugs) {
      if (!docRefs.has(cs)) docRefs.set(cs, new Set());
      docRefs.get(cs).add(docRef);
      // 문서당 슬러그 1회만 집계 (중복 링크는 무시)
      counts.set(cs, (counts.get(cs) || 0) + 1);
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

/** Split a table line into cell array (same as parseTable) */
function lineToCells(line) {
  return line
    .split('|')
    .map((c) => c.trim())
    .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
}

/**
 * 정렬 기준:
 * 1) 언급 문서 수 > 0 이고 개념 작성 여부가 빈 행 → 최상단, 그 안에서는 문서 수 내림차순
 * 2) 그 다음: 언급 > 0 이고 이미 O인 행 — 문서 수 내림차순
 * 3) 나머지(언급 0) — 원래 행 순서 유지
 */
function sortDataRowsByMentionsAndWritten(rowLines) {
  const entries = rowLines.map((line, origOrder) => {
    const cells = lineToCells(line);
    const count = parseInt(cells[5], 10);
    const n = Number.isFinite(count) && count > 0 ? count : 0;
    const writtenCell = (cells[7] || '').trim();
    const isWritten = writtenCell === 'O';
    const needWriteFirst = n > 0 && !isWritten;
    return { line, n, needWriteFirst, origOrder };
  });
  entries.sort((a, b) => {
    if (a.needWriteFirst && !b.needWriteFirst) return -1;
    if (!a.needWriteFirst && b.needWriteFirst) return 1;
    if (a.needWriteFirst && b.needWriteFirst) return b.n - a.n;
    const aM = a.n > 0;
    const bM = b.n > 0;
    if (aM && !bM) return -1;
    if (!aM && bM) return 1;
    if (aM && bM) return b.n - a.n;
    return a.origOrder - b.origOrder;
  });
  return entries.map((e) => e.line);
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

  const MENTION_COL = '언급 문서 수';
  const headerCells = lines[headerRowIndex].split('|').map((c) => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
  if (headerCells.length === 7 && !headerCells.includes(MENTION_COL) && !headerCells.includes('언급 횟수')) {
    const newHeader = [...headerCells.slice(0, 5), MENTION_COL, ...headerCells.slice(5)];
    lines[headerRowIndex] = '| ' + newHeader.join(' | ') + ' |';
  } else if (headerCells.includes('언급 횟수')) {
    const idx = headerCells.indexOf('언급 횟수');
    headerCells[idx] = MENTION_COL;
    lines[headerRowIndex] = '| ' + headerCells.join(' | ') + ' |';
  }

  const newLines = [...lines];
  const updatedRowLines = [];
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
    const line = '| ' + newCells.join(' | ') + ' |';
    newLines[row.index] = line;
    updatedRowLines.push(line);
  }

  // 언급은 있는데 개념 미작성(빈 칸)인 행을 위로, 그 안에서는 언급 문서 수 높은 순
  if (dataRows.length > 0) {
    const sortedRowLines = sortDataRowsByMentionsAndWritten(updatedRowLines);
    const firstDataIndex = Math.min(...dataRows.map((r) => r.index));
    for (let i = 0; i < sortedRowLines.length; i++) {
      newLines[firstDataIndex + i] = sortedRowLines[i];
    }
    const needWriteCount = updatedRowLines.filter((_, i) => {
      const cells = lineToCells(updatedRowLines[i]);
      const n = parseInt(cells[5], 10) || 0;
      const written = (cells[7] || '').trim() === 'O';
      return n > 0 && !written;
    }).length;
    if (needWriteCount > 0) {
      console.log('표 행 재정렬: 언급>0 & 미작성', needWriteCount, '건을 상단에 모음 (언급 문서 수 내림차순).');
    }
  }

  fs.writeFileSync(TABLE_PATH, newLines.join('\n'), 'utf8');
  console.log('Updated', TABLE_PATH);
  console.log('Concepts with mentions:', conceptToDocs.size);
  console.log('Concepts written (O):', writtenSlugs.size);
}

main();
