/**
 * MDX에서 전달되는 props가 배열/객체로 올바르지 않을 수 있어
 * 안전하게 배열·문자열로 정규화합니다.
 */

export function toStringArray(
  value: string[] | string | null | undefined
): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value.filter((s): s is string => typeof s === "string");
  if (typeof value === "string") {
    const t = value.trim();
    return t ? t.split(",").map((s) => s.trim()).filter(Boolean) : [];
  }
  return [];
}

export type SourceItem = {
  author: string;
  year?: string;
  title: string;
  source?: string;
  note?: string;
  href?: string;
};

export function toSourceItemsArray(
  value: SourceItem[] | SourceItem | string | null | undefined
): SourceItem[] {
  if (value == null) return [];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as SourceItem[] | SourceItem;
      return toSourceItemsArray(Array.isArray(parsed) ? parsed : parsed);
    } catch {
      return [];
    }
  }
  if (Array.isArray(value)) {
    return value
      .filter((x): x is SourceItem => x != null && typeof x === "object" && "author" in x && "title" in x)
      .map((x) => ({
        author: String(x.author ?? ""),
        ...(x.year != null && x.year !== "" && { year: String(x.year) }),
        title: String(x.title ?? ""),
        ...(x.source != null && { source: String(x.source) }),
        ...(x.note != null && { note: String(x.note) }),
        ...(x.href != null && { href: String(x.href) }),
      }));
  }
  if (typeof value === "object" && value !== null && !Array.isArray(value) && "author" in value && "title" in value) {
    const x = value as SourceItem;
    return [{
      author: String(x.author ?? ""),
      ...(x.year != null && x.year !== "" && { year: String(x.year) }),
      title: String(x.title ?? ""),
      ...(x.source != null && { source: String(x.source) }),
      ...(x.note != null && { note: String(x.note) }),
      ...(x.href != null && { href: String(x.href) }),
    }];
  }
  return [];
}

export type TroubleshootingItem = { problem: string; solution: string };

export function toTroubleshootingItemsArray(
  value: TroubleshootingItem[] | TroubleshootingItem | string | null | undefined
): TroubleshootingItem[] {
  if (value == null) return [];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as TroubleshootingItem[] | TroubleshootingItem;
      return toTroubleshootingItemsArray(Array.isArray(parsed) ? parsed : parsed);
    } catch {
      return [];
    }
  }
  if (Array.isArray(value)) {
    return value
      .filter((x): x is TroubleshootingItem => x != null && typeof x === "object" && "problem" in x && "solution" in x)
      .map((x) => ({ problem: String(x.problem), solution: String(x.solution) }));
  }
  if (typeof value === "object" && value !== null && !Array.isArray(value) && "problem" in value && "solution" in value) {
    const v = value as TroubleshootingItem;
    return [{ problem: String(v.problem), solution: String(v.solution) }];
  }
  return [];
}
