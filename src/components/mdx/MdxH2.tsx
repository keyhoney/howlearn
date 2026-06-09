import React, { type ComponentProps, type ReactNode } from 'react';
import {
  BookOpen,
  Brain,
  Compass,
  HelpCircle,
  Lightbulb,
  MessageCircle,
  Sparkles,
  Target,
  type LucideIcon,
} from 'lucide-react';
import { extractTextFromNode, slugify } from '@/lib/headings';

export const H2_ICON_NAMES = [
  'sparkles',
  'lightbulb',
  'bookOpen',
  'target',
  'messageCircle',
  'brain',
  'compass',
  'helpCircle',
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
  helpCircle: HelpCircle,
};

const H2_ICONS_ORDER: LucideIcon[] = [
  Sparkles,
  Lightbulb,
  BookOpen,
  Target,
  MessageCircle,
  Brain,
  Compass,
  HelpCircle,
];

const ICON_ALIAS: Record<string, MdxH2IconName> = {
  sparkles: 'sparkles',
  lightbulb: 'lightbulb',
  bookopen: 'bookOpen',
  bookOpen: 'bookOpen',
  target: 'target',
  messagecircle: 'messageCircle',
  messageCircle: 'messageCircle',
  brain: 'brain',
  compass: 'compass',
  helpcircle: 'helpCircle',
  helpCircle: 'helpCircle',
  'help-circle': 'helpCircle',
};

function normalizeIconName(name: string): MdxH2IconName | null {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  if (lower in ICON_ALIAS) return ICON_ALIAS[lower];
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
  return H2_ICONS_ORDER[iconIndexForText(text || 'default')];
}

export type MdxH2Props = ComponentProps<'h2'> & {
  children?: ReactNode;
  icon?: string;
  badge?: string;
};

export function MdxH2({ children, icon, badge, ...props }: MdxH2Props) {
  const text = extractTextFromNode(children);
  const id = text ? slugify(text) : undefined;
  const Icon = resolveIcon(icon, text || 'default');
  const hasBadgeText = Boolean(badge && badge.trim());

  return (
    <div className="not-prose my-8 flex w-full flex-col items-center gap-3 text-center">
      <div
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--card-border)] bg-[var(--surface-2)] px-3 py-1.5 text-sm font-medium text-[var(--fg)]"
        aria-hidden={!hasBadgeText}
        {...(hasBadgeText ? { 'aria-label': badge } : {})}
      >
        {React.createElement(Icon, {
          className: 'h-4 w-4 shrink-0 text-[var(--accent)]',
        })}
        {hasBadgeText ? <span className="whitespace-nowrap">{badge!.trim()}</span> : null}
      </div>
      <h2
        {...props}
        id={id}
        className="app-mdx-title w-full text-balance text-center text-xl font-bold tracking-tight sm:text-2xl md:text-[1.65rem]"
      >
        {children}
      </h2>
    </div>
  );
}
