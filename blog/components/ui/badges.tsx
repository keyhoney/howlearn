import { DomainSlug } from "@/lib/types";
import { domainInfo } from "@/lib/domains";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function DomainBadge({ domain, className }: { domain: DomainSlug; className?: string }) {
  const info = domainInfo[domain];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border", info.color, className)}>
      {info.name}
    </span>
  );
}

export function TagList({ tags, className }: { tags: string[]; className?: string }) {
  const list = Array.isArray(tags) ? tags : [];
  if (list.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {list.map(tag => (
        <span key={tag} className="inline-flex items-center text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-md px-2 py-1">
          #{tag}
        </span>
      ))}
    </div>
  );
}
