import { readFileSync, existsSync } from "fs";
import { join } from "path";

/**
 * 개념 스텁 페이지 제목용 슬러그 → 한글/영문 라벨.
 *
 * 읽는 순서 (blog/data/ 아래, 레포에 포함 가능):
 * 1. 1. 하우런_태그체계표.json — 개발 노트에 있는 원본과 동일 파일을 복사해 두면 됨 (rows[].슬러그/태그명/영문 내용)
 * 2. concept-slug-labels.json — 슬러그만 추린 경량 맵 (generate-concept-slug-labels.js 산출물)
 *
 * 둘 다 없으면 슬러그 휴먼라이즈로 폴백.
 */

const TAG_TABLE_FILENAME = "1. 하우런_태그체계표.json";
const SLIM_FILENAME = "concept-slug-labels.json";

type TagRow = { 태그명?: string; "영문 내용"?: string; 슬러그?: string };
type TagJson = { rows?: TagRow[] };
type SlugLabelsFile = Record<string, { tagName: string; english?: string }>;

let cachedMap: Map<string, { tagName: string; english: string }> | null = null;

function dataDir(): string {
  return join(process.cwd(), "data");
}

function buildMapFromRows(rows: TagRow[]): Map<string, { tagName: string; english: string }> {
  const map = new Map<string, { tagName: string; english: string }>();
  for (const row of rows) {
    const slug = row.슬러그?.trim();
    const tagName = row.태그명?.trim();
    if (!slug || !tagName) continue;
    const english = (row["영문 내용"] ?? "").trim();
    if (!map.has(slug)) map.set(slug, { tagName, english });
  }
  return map;
}

function loadSlugMap(): Map<string, { tagName: string; english: string }> | null {
  if (cachedMap) return cachedMap;

  const dir = dataDir();

  // 1) 원본 태그체계표 JSON (개발 노트 파일을 blog/data/에 복사한 경우)
  const tagTablePath = join(dir, TAG_TABLE_FILENAME);
  if (existsSync(tagTablePath)) {
    try {
      const raw = readFileSync(tagTablePath, "utf8");
      const data = JSON.parse(raw) as TagJson;
      const rows = data.rows ?? [];
      cachedMap = buildMapFromRows(rows);
      return cachedMap;
    } catch {
      // fall through
    }
  }

  // 2) 경량 맵만 있는 경우
  const slimPath = join(dir, SLIM_FILENAME);
  if (existsSync(slimPath)) {
    try {
      const raw = readFileSync(slimPath, "utf8");
      const data = JSON.parse(raw) as SlugLabelsFile;
      const map = new Map<string, { tagName: string; english: string }>();
      for (const [slug, v] of Object.entries(data)) {
        if (!slug || !v?.tagName) continue;
        map.set(slug, {
          tagName: String(v.tagName).trim(),
          english: String(v.english ?? "").trim(),
        });
      }
      cachedMap = map;
      return cachedMap;
    } catch {
      // fall through
    }
  }

  return null;
}

/** 슬러그로 한글 태그명·영문 조회. 없으면 null */
export function getConceptLabelFromTagTable(slug: string): {
  tagName: string;
  english: string;
} | null {
  const map = loadSlugMap();
  if (!map) return null;
  return map.get(slug) ?? null;
}

/** 스텁/메타용 표시 제목. 데이터 있으면 한글(영문), 없으면 슬러그 휴먼라이즈 */
export function getConceptStubDisplayTitle(slug: string): string {
  const fromTable = getConceptLabelFromTagTable(slug);
  if (fromTable) {
    if (fromTable.english)
      return `${fromTable.tagName} (${fromTable.english})`;
    return fromTable.tagName;
  }
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
