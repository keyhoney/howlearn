"use client";

import type { ReactNode } from "react";
import { Info, AlertTriangle, CheckCircle } from "lucide-react";

export type CalloutType = "info" | "warning" | "success";

type CalloutProps = {
  type?: CalloutType;
  title?: string;
  /**
   * RSC Flight 디코딩 이슈(enqueueModel 등)를 피하려면 MDX에서는 body만 쓰는 것을 권장합니다.
   * children은 클라이언트에서만 안전하게 쓰입니다.
   */
  body?: string;
  children?: ReactNode;
};

const styles: Record<CalloutType, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-100",
  warning:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-100",
};

const iconWrap: Record<CalloutType, string> = {
  info: "text-blue-500 dark:text-blue-400",
  warning: "text-amber-500 dark:text-amber-400",
  success: "text-emerald-500 dark:text-emerald-400",
};

/**
 * 타입별 아이콘+배경 콜아웃.
 * MDX(RSC)에서는 body prop만 사용하는 것이 안전합니다.
 */
export function Callout({ type = "info", title, body, children }: CalloutProps) {
  const icons = {
    info: <Info className={`h-5 w-5 ${iconWrap.info}`} aria-hidden />,
    warning: <AlertTriangle className={`h-5 w-5 ${iconWrap.warning}`} aria-hidden />,
    success: <CheckCircle className={`h-5 w-5 ${iconWrap.success}`} aria-hidden />,
  };

  const content = body != null && body !== "" ? body : children;
  if (content == null || content === "") return null;

  return (
    <aside
      className={`my-6 flex gap-3 rounded-xl border p-4 ${styles[type]}`}
      aria-label={title ?? type}
    >
      <div className="mt-0.5 shrink-0">{icons[type]}</div>
      <div className="min-w-0 flex-1">
        {title && <h4 className="mb-1 font-semibold text-inherit">{title}</h4>}
        {typeof content === "string" ? (
          <p className="m-0 text-sm leading-relaxed opacity-90">{content}</p>
        ) : (
          <div className="prose-p:my-0 text-sm leading-relaxed opacity-90 [&_p]:m-0">
            {content}
          </div>
        )}
      </div>
    </aside>
  );
}
