import React, { type ComponentProps, type ReactNode } from "react";
import {
  Sparkles,
  Lightbulb,
  BookOpen,
  Target,
  MessageCircle,
  Brain,
  Compass,
  type LucideIcon,
} from "lucide-react";
import { extractTextFromNode, slugify } from "@/lib/headings";

/** 수동 선택용 아이콘 이름 (대소문자 무관, camelCase 권장) */
export const H2_ICON_NAMES = [
  "sparkles",
  "lightbulb",
  "bookOpen",
  "target",
  "messageCircle",
  "brain",
  "compass",
] as const;

export type MdxH2IconName = (typeof H2_ICON_NAMES)[number];

const ICON_MAP: Record<MdxH2IconName, LucideIcon> = {
  sparkles: Sparkles,
  lightbulb: Lightbulb,
  bookOpen: BookOpen,
  target: Target,
  messageCircle: MessageCircle,
  brain: Brain,
  compass: Compass,
};

const H2_ICONS_ORDER: LucideIcon[] = [
  Sparkles,
  Lightbulb,
  BookOpen,
  Target,
  MessageCircle,
  Brain,
  Compass,
];

/** 별칭: bookopen → bookOpen 등 */
const ICON_ALIAS: Record<string, MdxH2IconName> = {
  sparkles: "sparkles",
  lightbulb: "lightbulb",
  bookopen: "bookOpen",
  bookOpen: "bookOpen",
  target: "target",
  messagecircle: "messageCircle",
  messageCircle: "messageCircle",
  brain: "brain",
  compass: "compass",
};

function normalizeIconName(name: string): MdxH2IconName | null {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  if (lower in ICON_ALIAS) return ICON_ALIAS[lower];
  // camelCase 첫 글자만 대문자인 경우 등
  const asKey = trimmed as MdxH2IconName;
  if (asKey in ICON_MAP) return asKey;
  return null;
}

function iconIndexForText(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(h) % H2_ICONS_ORDER.length;
}

function resolveIcon(iconProp: string | undefined, text: string): LucideIcon {
  if (iconProp) {
    const key = normalizeIconName(iconProp);
    if (key) return ICON_MAP[key];
  }
  return H2_ICONS_ORDER[iconIndexForText(text || "default")];
}

export type MdxH2Props = ComponentProps<"h2"> & {
  children?: ReactNode;
  /** 7종 중 하나: sparkles | lightbulb | bookOpen | target | messageCircle | brain | compass (대소문자 무관) */
  icon?: string;
  /** 배지에 표시할 텍스트 (예: 관점의 전환) */
  badge?: string;
};

/**
 * MDX ## — 좌측 정렬 + 상단 연보라 배지(아이콘 ± 텍스트)
 * - `## 제목`만 쓰면 아이콘은 제목 해시로 자동 선택
 * - 수동 지정: `<MdxH2 icon="brain" badge="관점의 전환">제목</MdxH2>`
 */
export function MdxH2({ children, icon, badge, ...props }: MdxH2Props) {
  const text = extractTextFromNode(children);
  const id = text ? slugify(text) : undefined;
  const Icon = resolveIcon(icon, text || "default");
  const hasBadgeText = Boolean(badge && badge.trim());

  return (
    <div className="not-prose my-8 flex w-full flex-col items-start text-left">
      <div
        className="mb-3 inline-flex items-center gap-1.5 rounded-lg border border-violet-200/80 bg-violet-100/90 px-3 py-1.5 text-sm font-medium text-violet-900 dark:border-violet-800/60 dark:bg-violet-950/50 dark:text-violet-100"
        aria-hidden={!hasBadgeText}
        {...(hasBadgeText ? { "aria-label": badge } : {})}
      >
        {React.createElement(Icon, {
          className: "h-4 w-4 shrink-0 text-violet-700 dark:text-violet-300",
        })}
        {hasBadgeText ? (
          <span className="whitespace-nowrap">{badge!.trim()}</span>
        ) : null}
      </div>
      <h2
        {...props}
        id={id}
        className="w-full max-w-3xl text-balance text-left text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl md:text-[1.65rem]"
      >
        {children}
      </h2>
    </div>
  );
}
