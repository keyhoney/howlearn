/**
 * 가이드·개념 문서 태그·카테고리 덮어쓰기
 *
 * 대상: blog/content/guides, blog/content/concepts 내 모든 MDX
 *
 * 1) tags: 본문 [링크텍스트](/concepts/슬러그) 수집 → 태그 표시명으로 덮어씀
 * 2) category: 메타데이터의 태그명을 기준으로 하우런_태그체계표.json을 참조해
 *    각 태그에 해당하는 학문명을 수집하고, 중복 제거 후 category에 덮어씀
 *
 * 실행: node scripts/update-guide-tags-from-concepts.js
 * 옵션: --dry-run  실제 파일 쓰기 없이 변경 예정만 출력
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const GUIDES_DIR = path.join(ROOT, 'blog', 'content', 'guides');
const CONCEPTS_DIR = path.join(ROOT, 'blog', 'content', 'concepts');
const TAG_SCHEMA_PATH = path.join(ROOT, '개발 노트', '1. 임시보관', 'howlearn', 'prompt', '1. 하우런_태그체계표.json');

/** [링크텍스트](/concepts/슬러그) 형태 캡처: 그룹1=링크텍스트, 그룹2=슬러그 */
const CONCEPT_LINK_WITH_TEXT_RE = /\[([^\]]*)\]\(\/concepts?\/([a-z0-9-]+)\)/g;

function extractFrontmatterAndBody(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: '', body: content };
  return { frontmatter: match[1], body: match[2] };
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

function main() {
  const dryRun = process.argv.includes('--dry-run');
  const slugToLabelFromConcepts = buildSlugToLabelMap();
  const tagToCategories = loadTagToCategoriesMap();

  const guideResult = processDir(GUIDES_DIR, 'guides', slugToLabelFromConcepts, tagToCategories, dryRun);
  const conceptResult = processDir(CONCEPTS_DIR, 'concepts', slugToLabelFromConcepts, tagToCategories, dryRun);

  const totalUpdated = guideResult.updated + conceptResult.updated;
  const totalSkipped = guideResult.skipped + conceptResult.skipped;

  if (dryRun) {
    console.log(`[dry-run] guides: ${guideResult.updated} updated, ${guideResult.skipped} skipped. concepts: ${conceptResult.updated} updated, ${conceptResult.skipped} skipped.`);
  } else {
    console.log(`Done. guides: ${guideResult.updated} updated, ${guideResult.skipped} skipped. concepts: ${conceptResult.updated} updated, ${conceptResult.skipped} skipped.`);
  }
}

main();
