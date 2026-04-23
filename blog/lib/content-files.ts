import type { ContentType } from "./types";

/**
 * Cloudflare Workers 런타임 호환을 위해 유지되는 하위호환 스텁입니다.
 * 런타임 파일시스템(fs) 접근은 사용하지 않습니다.
 */
export function getMdxSlugs(_type: ContentType): string[] {
  return [];
}

/**
 * Cloudflare Workers 런타임 호환을 위해 유지되는 하위호환 스텁입니다.
 * 런타임 파일시스템(fs) 접근은 사용하지 않습니다.
 */
export function getMdxBySlug(
  _type: ContentType,
  _slug: string
): { frontmatter: Record<string, unknown>; content: string } | null {
  return null;
}
