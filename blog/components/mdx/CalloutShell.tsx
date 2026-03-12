import type { ReactNode } from "react";

export type CalloutTone = "slate" | "indigo" | "cyan" | "amber" | "emerald";

const toneBorder: Record<CalloutTone, string> = {
  slate: "border-l-slate-300 dark:border-l-slate-500",
  indigo: "border-l-indigo-600 dark:border-l-indigo-500",
  cyan: "border-l-cyan-500 dark:border-l-cyan-500",
  amber: "border-l-amber-500 dark:border-l-amber-500",
  emerald: "border-l-emerald-500 dark:border-l-emerald-500",
};

const toneLabel: Record<CalloutTone, string> = {
  slate: "text-slate-500 dark:text-slate-400",
  indigo: "text-indigo-600 dark:text-indigo-400",
  cyan: "text-cyan-700 dark:text-cyan-400",
  amber: "text-amber-800 dark:text-amber-400",
  emerald: "text-emerald-800 dark:text-emerald-400",
};

type CalloutShellProps = {
  children: ReactNode;
  /** 상단 소제목 (uppercase 라벨) */
  label: string;
  ariaLabel?: string;
  tone?: CalloutTone;
  className?: string;
};

/**
 * MDX 콜아웃 공통 래퍼: rounded, border, padding, 다크모드 통일
 */
export function CalloutShell({
  children,
  label,
  ariaLabel,
  tone = "slate",
  className = "",
}: CalloutShellProps) {
  return (
    <aside
      className={`my-8 rounded-xl border border-slate-200 dark:border-slate-600 border-l-4 bg-slate-50/80 dark:bg-slate-800/80 p-5 shadow-sm md:p-6 ${toneBorder[tone]} ${className}`}
      aria-label={ariaLabel ?? label}
    >
      <p className={`text-xs font-semibold uppercase tracking-wider ${toneLabel[tone]}`}>
        {label}
      </p>
      {children}
    </aside>
  );
}
