import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

export type CalloutType = 'info' | 'warning' | 'success';

type CalloutProps = {
  type?: CalloutType;
  title?: string;
  body?: string;
  children?: ReactNode;
};

const styles: Record<CalloutType, string> = {
  info: 'app-mdx-status-info',
  warning: 'app-mdx-status-warning',
  success: 'app-mdx-status-success',
};

const iconWrap: Record<CalloutType, string> = {
  info: 'text-[color:var(--info)]',
  warning: 'text-[color:var(--warning)]',
  success: 'text-[color:var(--success)]',
};

export function Callout({ type = 'info', title, body, children }: CalloutProps) {
  const icons = {
    info: <Info className={`h-5 w-5 ${iconWrap.info}`} aria-hidden />,
    warning: <AlertTriangle className={`h-5 w-5 ${iconWrap.warning}`} aria-hidden />,
    success: <CheckCircle className={`h-5 w-5 ${iconWrap.success}`} aria-hidden />,
  };

  const content = body != null && body !== '' ? body : children;
  if (content == null || content === '') return null;

  return (
    <aside
      className={`my-6 flex gap-3 rounded-lg border p-4 ${styles[type]}`}
      aria-label={title ?? type}
    >
      <div className="mt-0.5 shrink-0">{icons[type]}</div>
      <div className="min-w-0 flex-1">
        {title && <h4 className="mb-1 font-semibold text-inherit">{title}</h4>}
        {typeof content === 'string' ? (
          <p className="m-0 text-sm leading-relaxed">{content}</p>
        ) : (
          <div className="text-sm leading-relaxed prose-p:my-0 [&_p]:m-0">
            {content}
          </div>
        )}
      </div>
    </aside>
  );
}
