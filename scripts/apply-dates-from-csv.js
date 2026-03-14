/**
 * 발행일.csv 내용을 blog/content/guides, blog/content/concepts MDX frontmatter에 덮어쓴다.
 * date, datePublished, dateModified, dateReviewed를 제거한 뒤 datePublished·dateModified·dateReviewed만 설정한다. (date는 쓰지 않음)
 */
const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.join(__dirname, "..");
const CSV_PATH = path.join(
  REPO_ROOT,
  "개발 노트",
  "1. 임시보관",
  "변환 전 개념 보관",
  "발행일.csv"
);
const GUIDES_DIR = path.join(REPO_ROOT, "blog", "content", "guides");
const CONCEPTS_DIR = path.join(REPO_ROOT, "blog", "content", "concepts");

const DATE_KEYS = ["date", "datePublished", "dateModified", "dateReviewed"];

function parseCsv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split(/\r?\n/).filter((line) => line.trim());
  const rows = [];
  for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split(",").map((p) => p.trim());
    if (parts.length < 5) continue;
    if (i === 0 && parts[0] === "구분") continue; // skip header
    const type = parts[0];
    const filename = parts[1];
    const datePublished = parts[2].replace(/:$/, "") || parts[2];
    const dateModified = parts[3].replace(/:$/, "") || parts[3];
    const dateReviewed = parts[4].replace(/:$/, "") || parts[4];
    rows.push({
      type,
      filename,
      datePublished,
      dateModified,
      dateReviewed,
    });
  }
  return rows;
}

function getContentDir(type) {
  return type === "가이드" ? GUIDES_DIR : CONCEPTS_DIR;
}

function processFile(filePath, dates) {
  const raw = fs.readFileSync(filePath, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { changed: false };

  const [, frontmatter, body] = match;
  const lines = frontmatter.split(/\r?\n/);
  const newLines = [];
  let inserted = false;

  for (const line of lines) {
    const keyMatch = line.match(/^(\w+):/);
    const key = keyMatch ? keyMatch[1] : null;
    if (key && DATE_KEYS.includes(key)) continue;
    newLines.push(line);
    if (!inserted && key && (key === "slug" || key === "status")) {
      newLines.push(`datePublished: ${dates.datePublished}`);
      newLines.push(`dateModified: ${dates.dateModified}`);
      newLines.push(`dateReviewed: ${dates.dateReviewed}`);
      inserted = true;
    }
  }

  if (!inserted) {
    newLines.unshift(`dateReviewed: ${dates.dateReviewed}`);
    newLines.unshift(`dateModified: ${dates.dateModified}`);
    newLines.unshift(`datePublished: ${dates.datePublished}`);
  }

  const newFront = newLines.join("\n");
  const newRaw = `---\n${newFront}\n---\n${body}`;
  if (newRaw === raw) return { changed: false };

  fs.writeFileSync(filePath, newRaw, "utf8");
  return { changed: true };
}

function main() {
  const rows = parseCsv(CSV_PATH);
  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    const dir = getContentDir(row.type);
    const filePath = path.join(dir, row.filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`파일 없음: ${filePath}`);
      skipped++;
      continue;
    }
    const result = processFile(filePath, {
      datePublished: row.datePublished,
      dateModified: row.dateModified,
      dateReviewed: row.dateReviewed,
    });
    if (result.changed) {
      updated++;
      console.log(`  ${row.type} ${row.filename}`);
    }
  }

  console.log(`\n완료: ${updated}개 수정, ${skipped}개 파일 없음(건너뜀).`);
}

main();
