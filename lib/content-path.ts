import type { ContentType } from "./content";

export function pathForType(type: ContentType): string {
  return type === "blog" ? "/blog" : `/${type}`;
}

export function fullPath(type: ContentType, slug: string): string {
  return `${pathForType(type)}/${encodeURIComponent(slug)}`;
}
