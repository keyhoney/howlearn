/**
 * 개념 작성률 표 생성
 * - blog/content/guides, blog/content/concepts 내 모든 MDX를 스캔
 * - 각 문서에서 ](/concepts/슬러그) 또는 ](/concept/슬러그)로 언급된 개념 수집
 * - 작성된 개념 = concepts 폴더에 해당 슬러그 파일이 있는 경우
 * - 미작성된 개념 = 언급되었으나 concepts 폴더에 파일이 없는 경우
 * - 표: 구분 | 파일명 | 작성된 개념 | 미작성된 개념 | 개념 작성률
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const GUIDES_DIR = path.join(ROOT, 'blog', 'content', 'guides');
const CONCEPTS_DIR = path.join(ROOT, 'blog', 'content', 'concepts');

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

/** 문서 본문에서 언급된 개념 슬러그 목록 (중복 제거) */
function extractConceptSlugs(body) {
  const slugs = new Set();
  let match;
  CONCEPT_LINK_RE.lastIndex = 0;
  while ((match = CONCEPT_LINK_RE.exec(body)) !== null) {
    slugs.add(match[1]);
  }
  return Array.from(slugs);
}

/** concepts 폴더에 파일이 있는 슬러그 집합 */
function getWrittenConceptSlugs() {
  const set = new Set();
  if (!fs.existsSync(CONCEPTS_DIR)) return set;
  const files = fs.readdirSync(CONCEPTS_DIR).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));
  for (const f of files) {
    set.add(path.basename(f, path.extname(f)));
  }
  return set;
}

/**
 * 한 디렉터리 내 MDX 파일들을 스캔하여 문서별 개념 현황 반환
 * @param {string} dir - 디렉터리 경로
 * @param {'가이드'|'개념'} label - 구분 라벨
 * @param {Set<string>} writtenSlugs - 작성된 개념 슬러그 집합
 * @returns {Array<{ label: string, filename: string, written: string[], unwritten: string[], total: number, rate: string }>}
 */
function scanDirForTable(dir, label, writtenSlugs) {
  const rows = [];
  if (!fs.existsSync(dir)) return rows;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));
  for (const file of files) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { body } = extractFrontmatterAndBody(content);
    const slugs = extractConceptSlugs(body);

    const written = slugs.filter((s) => writtenSlugs.has(s));
    const unwritten = slugs.filter((s) => !writtenSlugs.has(s));
    const total = slugs.length;
    const rate =
      total === 0 ? '-' : `${Math.round((written.length / total) * 100)}%`;

    rows.push({
      label,
      filename: file,
      written,
      unwritten,
      total,
      rate,
    });
  }
  return rows;
}

function main() {
  const writtenSlugs = getWrittenConceptSlugs();

  const guideRows = scanDirForTable(GUIDES_DIR, '가이드', writtenSlugs);
  const conceptRows = scanDirForTable(CONCEPTS_DIR, '개념', writtenSlugs);

  const allRows = [...guideRows, ...conceptRows];

  // 개념 작성률 낮은 순 → 같은 비율이면 미작성 개수 많은 순 → 파일명 순
  allRows.sort((a, b) => {
    const aNum = a.total === 0 ? 1 : a.written.length / a.total;
    const bNum = b.total === 0 ? 1 : b.written.length / b.total;
    if (aNum !== bNum) return aNum - bNum;
    if (a.unwritten.length !== b.unwritten.length) return a.unwritten.length - b.unwritten.length;
    return a.filename.localeCompare(b.filename);
  });

  const lines = [];
  lines.push('| 구분 | 파일명 | 작성된 개념 | 미작성된 개념 | 개념 작성률 |');
  lines.push('| --- | --- | --- | --- | --- |');

  for (const row of allRows) {
    const writtenStr = row.written.length ? row.written.sort().join(', ') : '-';
    const unwrittenStr = row.unwritten.length ? row.unwritten.sort().join(', ') : '-';
    lines.push(`| ${row.label} | ${row.filename} | ${writtenStr} | ${unwrittenStr} | ${row.rate} |`);
  }

  const table = lines.join('\n');
  console.log(table);

  const outPath = path.join(ROOT, '개발 노트', '개념 정리', '문서별_개념_작성률_표.md');
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(outPath, table + '\n', 'utf8');
  console.log('\n표 저장:', outPath);
  console.log('총 문서:', allRows.length, '(가이드', guideRows.length, '+ 개념', conceptRows.length, ')');
}

main();
