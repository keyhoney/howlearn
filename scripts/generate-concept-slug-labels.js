/**
 * 태그체계표 JSON → blog/data/concept-slug-labels.json 생성
 * - 개발 노트는 레포에 없을 수 있음 → 이 스크립트는 로컬에서만 실행 후 생성물을 커밋
 * - 입력: 개발 노트/.../1. 하우런_태그체계표.json (없으면 스킵)
 * - 출력: blog/data/concept-slug-labels.json
 *
 * 사용: node scripts/generate-concept-slug-labels.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT_PATH = path.join(ROOT, "blog", "data", "concept-slug-labels.json");
// blog/data에 원본을 복사해 두었으면 그걸 기본 입력으로 사용
const BLOG_DATA_INPUT = path.join(ROOT, "blog", "data", "1. 하우런_태그체계표.json");
const DEV_NOTE_INPUT = path.join(
  ROOT,
  "개발 노트",
  "1. 임시보관",
  "howlearn",
  "prompt",
  "1. 하우런_태그체계표.json"
);

const inputPath =
  process.argv[2] ||
  (fs.existsSync(BLOG_DATA_INPUT) ? BLOG_DATA_INPUT : DEV_NOTE_INPUT);

if (!fs.existsSync(inputPath)) {
  console.error("입력 파일 없음:", inputPath);
  console.error("태그 JSON 경로를 인자로 주거나, 개발 노트를 클론한 뒤 다시 실행하세요.");
  process.exit(1);
}

const raw = fs.readFileSync(inputPath, "utf8");
const data = JSON.parse(raw);
const rows = data.rows || [];
const out = {};

for (const row of rows) {
  const slug = (row.슬러그 || "").trim();
  const tagName = (row.태그명 || "").trim();
  if (!slug || !tagName) continue;
  if (out[slug]) continue; // 첫 행만 유지
  const english = (row["영문 내용"] || "").trim();
  out[slug] = { tagName, ...(english ? { english } : {}) };
}

const dir = path.dirname(OUT_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), "utf8");
console.log("Wrote", OUT_PATH, "entries:", Object.keys(out).length);
