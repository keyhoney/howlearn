import type { ReactNode } from 'react';

export type CalloutTone = 'slate' | 'indigo' | 'cyan' | 'amber' | 'emerald';

const toneBorder: Record<CalloutTone, string> = {
  slate: 'border-l-[var(--card-border)]',
  indigo: 'border-l-[var(--accent)]',
  cyan: 'border-l-[var(--info)]',
  amber: 'border-l-[var(--warning)]',
  emerald: 'border-l-[var(--success)]',
};

const toneLabel: Record<CalloutTone, string> = {
  slate: 'text-[var(--fg-muted)]',
  indigo: 'text-[var(--accent)]',
  cyan: 'text-[var(--info)]',
  amber: 'text-[var(--warning)]',
  emerald: 'text-[var(--success)]',
};

type CalloutShellProps = {
  children: ReactNode;
  label: string;
  ariaLabel?: string;
  tone?: CalloutTone;
  className?: string;
};

export function CalloutShell({
  children,
  label,
  ariaLabel,
  tone = 'slate',
  className = '',
}: CalloutShellProps) {
  return (
    <aside
      className={`app-mdx-card-muted my-8 border-l-4 p-5 md:p-6 ${toneBorder[tone]} ${className}`}
      aria-label={ariaLabel ?? label}
    >
      <p className={`app-mdx-kicker ${toneLabel[tone]}`}>{label}</p>
      {children}
    </aside>
  );
}
