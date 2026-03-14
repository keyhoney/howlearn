/**
 * 가이드·개념 문서 태그·카테고리 덮어쓰기 + 개념 언급 표 갱신
 *
 * 1단계 (가이드 태그): blog/content/guides, blog/content/concepts 내 모든 MDX
 *   - tags: 본문 [링크텍스트](/concepts/슬러그) 수집 → 태그 표시명으로 덮어씀
 *   - category: 메타데이터의 태그명을 기준으로 하우런_태그체계표.json 참조해 학문명 수집 후 category 덮어씀
 *
 * 2단계 (개념 언급): 동일 MDX에서 ](/concepts/슬러그) 수집 → 하우런_개념_작성.md 표의 "언급 문서 수", "언급된 본문" 갱신
 *
 * 3단계 (문서별 작성률): concept-coverage-table.js 실행 → 문서별_개념_작성률_표.md 생성
 *
 * 실행: node scripts/카테고리, 태그, 개념표 업데이트.js
 * 옵션: --dry-run  실제 파일 쓰기 없이 1단계 변경 예정만 출력 (2단계 표 갱신은 건너뜀)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const GUIDES_DIR = path.join(ROOT, 'blog', 'content', 'guides');
const CONCEPTS_DIR = path.join(ROOT, 'blog', 'content', 'concepts');
const TAG_SCHEMA_PATH = path.join(ROOT, '개발 노트', '1. 임시보관', 'howlearn', 'prompt', '1. 하우런_태그체계표.json');
const TABLE_PATH = path.join(ROOT, '개발 노트', '개념 정리', '하우런_개념_작성.md');

/** [링크텍스트](/concepts/슬러그) 형태 캡처: 그룹1=링크텍스트, 그룹2=슬러그 */
const CONCEPT_LINK_WITH_TEXT_RE = /\[([^\]]*)\]\(\/concepts?\/([a-z0-9-]+)\)/g;
/** 앱 라우트는 /concepts/ 복수. 본문에 /concept/ 단수로 쓴 링크도 집계에 포함 */
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

/** title 값에서 태그용 짧은 이름: " : " 또는 "(" 앞까지. 없으면 전체 */
function labelFromTitle(titleStr) {
  if (!titleStr || typeof titleStr !== 'string') return '';
  const s = titleStr.trim();
  const colon = s.indexOf(' : ');
  const paren = s.indexOf('(');
  let end = s.length;
  if (colon !== -1) end = Math.min(end, colon);
  if (paren !== -1) end = Math.min(end, paren);
  return s.slice(0, end).trim();
}

/** 개념 MDX frontmatter에서 title 추출 (따옴표 감싼 한 줄) */
function getTitleFromFrontmatter(frontmatter) {
  const m = frontmatter.match(/^title:\s*["']([^"']*)["']/m);
  return m ? m[1].trim() : '';
}

/**
 * 개념 디렉터리 스캔 → Map<slug, tagLabel>
 * 개념 파일이 있는 슬러그만 포함.
 */
function buildSlugToLabelMap() {
  const map = new Map();
  if (!fs.existsSync(CONCEPTS_DIR)) return map;
  const files = fs.readdirSync(CONCEPTS_DIR).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));
  for (const file of files) {
    const filePath = path.join(CONCEPTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { frontmatter } = extractFrontmatterAndBody(content);
    const slug = path.basename(file, path.extname(file));
    const title = getTitleFromFrontmatter(frontmatter);
    const label = labelFromTitle(title);
    if (label) map.set(slug, label);
  }
  return map;
}

/** 링크 텍스트에서 태그용 이름 추출: ** 제거 후 "(" 앞까지. 비어 있으면 null */
function labelFromLinkText(linkText) {
  if (!linkText || typeof linkText !== 'string') return null;
  const s = linkText.replace(/\*\*/g, '').trim();
  const paren = s.indexOf('(');
  const label = (paren !== -1 ? s.slice(0, paren) : s).trim();
  return label || null;
}

/** 슬러그를 읽기 쉬운 표시로: feedforward → Feedforward, self-regulated-learning → Self-regulated learning */
function humanizeSlug(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/**
 * 본문에서 개념 링크 수집 → Map<slug, label>
 * label: 링크 텍스트에서 "(" 앞까지 추출. 동일 슬러그가 여러 번 나오면 첫 번째 링크 텍스트 사용.
 */
function extractConceptSlugAndLabels(body) {
  const map = new Map();
  let match;
  CONCEPT_LINK_WITH_TEXT_RE.lastIndex = 0;
  while ((match = CONCEPT_LINK_WITH_TEXT_RE.exec(body)) !== null) {
    const linkText = match[1];
    const slug = match[2];
    if (map.has(slug)) continue;
    const label = labelFromLinkText(linkText);
    map.set(slug, label || humanizeSlug(slug));
  }
  return map;
}

/**
 * frontmatter 문자열에서 tags: ... 블록을 새 태그 목록으로 교체.
 * 기존 tags가 있으면 블록 전체 교체, 없으면 맨 뒤에 추가.
 */
function replaceTagsInFrontmatter(frontmatter, newTagLabels) {
  const lines = frontmatter.split(/\r?\n/);
  const newBlock = ['tags:', ...newTagLabels.map((l) => `  - ${l}`)].join('\n');

  let i = 0;
  const out = [];
  let replaced = false;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    const isTagsKey = trimmed === 'tags:' || /^tags\s*:\s*$/.test(trimmed);
    if (isTagsKey && !replaced) {
      out.push(newBlock);
      i += 1;
      while (i < lines.length && /^\s+-\s+/.test(lines[i])) i += 1;
      replaced = true;
      continue;
    }
    out.push(line);
    i += 1;
  }
  if (!replaced) {
    if (out.length > 0 && !out[out.length - 1].endsWith('\n')) out.push('');
    out.push(newBlock);
  }
  return out.join('\n');
}

/**
 * frontmatter 문자열에서 category: ... 블록을 새 학문명 목록으로 교체.
 * 기존 category가 있으면 블록 전체 교체, 없으면 맨 뒤에 추가.
 */
function replaceCategoryInFrontmatter(frontmatter, newCategories) {
  const lines = frontmatter.split(/\r?\n/);
  const newBlock = ['category:', ...newCategories.map((c) => `  - ${c}`)].join('\n');

  let i = 0;
  const out = [];
  let replaced = false;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    const isCategoryKey = trimmed === 'category:' || /^category\s*:\s*$/.test(trimmed);
    if (isCategoryKey && !replaced) {
      out.push(newBlock);
      i += 1;
      while (i < lines.length && /^\s+-\s+/.test(lines[i])) i += 1;
      replaced = true;
      continue;
    }
    out.push(line);
    i += 1;
  }
  if (!replaced) {
    if (out.length > 0 && !out[out.length - 1].endsWith('\n')) out.push('');
    out.push(newBlock);
  }
  return out.join('\n');
}

/**
 * 하우런_태그체계표.json 로드 → Map<태그명, Set<학문명>>
 * 학문명이 "발달심리학;신경과학"처럼 세미콜론으로 묶인 경우 각각 분리해 Set에 넣음 (중복 제거).
 */
function loadTagToCategoriesMap() {
  const map = new Map();
  if (!fs.existsSync(TAG_SCHEMA_PATH)) return map;
  const data = JSON.parse(fs.readFileSync(TAG_SCHEMA_PATH, 'utf8'));
  const rows = data.rows || [];
  for (const row of rows) {
    const tag = row.태그명;
    const cat = row.학문명;
    if (!tag || !cat) continue;
    if (!map.has(tag)) map.set(tag, new Set());
    const parts = String(cat).split(';').map((s) => s.trim()).filter(Boolean);
    for (const p of parts) map.get(tag).add(p);
  }
  return map;
}

/**
 * 태그명 목록으로부터 학문명 목록 생성 (중복 제거, 정렬)
 */
function getCategoriesFromTagLabels(tagLabels, tagToCategories) {
  const set = new Set();
  for (const tag of tagLabels) {
    const cats = tagToCategories.get(tag);
    if (cats) for (const c of cats) set.add(c);
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'ko'));
}

/**
 * 한 MDX 내용에 대해 tags·category 갱신 결과 반환
 * @returns {{ newFrontmatter: string, tagLabels: string[], categories: string[] }}
 */
function processMdxContent(content, slugToLabelFromConcepts, tagToCategories) {
  const { frontmatter, body } = extractFrontmatterAndBody(content);
  const slugToLabelFromBody = extractConceptSlugAndLabels(body);
  const tagLabels = [];
  for (const [slug, bodyLabel] of slugToLabelFromBody) {
    const label = slugToLabelFromConcepts.get(slug) || bodyLabel;
    tagLabels.push(label);
  }
  tagLabels.sort((a, b) => a.localeCompare(b, 'ko'));
  const categories = getCategoriesFromTagLabels(tagLabels, tagToCategories);
  let newFrontmatter = replaceTagsInFrontmatter(frontmatter, tagLabels);
  newFrontmatter = replaceCategoryInFrontmatter(newFrontmatter, categories);
  return { frontmatter, newFrontmatter, body, tagLabels, categories };
}

/**
 * 한 디렉터리 내 MDX 파일들에 tags·category 덮어쓰기 적용
 * @returns {{ updated: number, skipped: number }}
 */
function processDir(dir, dirLabel, slugToLabelFromConcepts, tagToCategories, dryRun) {
  let updated = 0;
  let skipped = 0;
  if (!fs.existsSync(dir)) {
    console.warn(dirLabel, 'not found:', dir);
    return { updated, skipped };
  }
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));
  for (const file of files) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { frontmatter, newFrontmatter, body, tagLabels, categories } = processMdxContent(
      content,
      slugToLabelFromConcepts,
      tagToCategories
    );
    if (newFrontmatter === frontmatter) {
      skipped += 1;
      continue;
    }
    const newContent = `---\n${newFrontmatter}\n---\n${body}`;
    if (dryRun) {
      console.log(`[${dirLabel}]`, file, '→ tags:', tagLabels.length ? tagLabels : '(none)', '| category:', categories.length ? categories : '(none)');
    } else {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`[${dirLabel}] Updated:`, file);
    }
    updated += 1;
  }
  return { updated, skipped };
}

// ---------- 2단계: 개념 언급 → 하우런_개념_작성.md 표 갱신 ----------

/**
 * Scan MDX dir; type is 'guides' | 'concepts' → docRef prefix guides/ or concepts/
 * counts: 문서 수 기준 — 한 문서에서 같은 슬러그를 여러 번 써도 +1만
 * Returns { docRefs: Map<conceptSlug, Set<"guides/slug">>, counts: Map<conceptSlug, number> }
 */
function scanMdxDirForMentions(dir, type) {
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

function lineToCells(line) {
  return line
    .split('|')
    .map((c) => c.trim())
    .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
}

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

function runConceptMentions() {
  const guides = scanMdxDirForMentions(GUIDES_DIR, 'guides');
  const concepts = scanMdxDirForMentions(CONCEPTS_DIR, 'concepts');

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

function main() {
  const dryRun = process.argv.includes('--dry-run');

  // 1단계: 가이드·개념 태그·카테고리 덮어쓰기
  const slugToLabelFromConcepts = buildSlugToLabelMap();
  const tagToCategories = loadTagToCategoriesMap();

  const guideResult = processDir(GUIDES_DIR, 'guides', slugToLabelFromConcepts, tagToCategories, dryRun);
  const conceptResult = processDir(CONCEPTS_DIR, 'concepts', slugToLabelFromConcepts, tagToCategories, dryRun);

  if (dryRun) {
    console.log(`[dry-run] guides: ${guideResult.updated} updated, ${guideResult.skipped} skipped. concepts: ${conceptResult.updated} updated, ${conceptResult.skipped} skipped.`);
  } else {
    console.log(`Done. guides: ${guideResult.updated} updated, ${guideResult.skipped} skipped. concepts: ${conceptResult.updated} updated, ${conceptResult.skipped} skipped.`);
  }

  // 2단계: 개념 언급 표 갱신 (dry-run이면 건너뜀)
  if (!dryRun) {
    runConceptMentions();
    // 3단계: 문서별 개념 작성률 표 생성 (concept-coverage-table.js)
    require(path.join(__dirname, 'concept-coverage-table.js'));
  }
}

main();
