import conceptSlugLabels from "@/data/concept-slug-labels.json";

/**
 * 개념 스텁 페이지 제목용 슬러그 → 한글/영문 라벨.
 *
 * 읽는 순서 (blog/data/ 아래, 레포에 포함 가능):
 * 1. 1. 하우런_태그체계표.json — 개발 노트에 있는 원본과 동일 파일을 복사해 두면 됨 (rows[].슬러그/태그명/영문 내용)
 * 2. concept-slug-labels.json — 슬러그만 추린 경량 맵 (generate-concept-slug-labels.js 산출물)
 *
 * 둘 다 없으면 슬러그 휴먼라이즈로 폴백.
 */

type SlugLabelsFile = Record<string, { tagName: string; english?: string }>;

let cachedMap: Map<string, { tagName: string; english: string }> | null = null;

function loadSlugMap(): Map<string, { tagName: string; english: string }> | null {
  if (cachedMap) return cachedMap;
  const data = conceptSlugLabels as SlugLabelsFile;
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
