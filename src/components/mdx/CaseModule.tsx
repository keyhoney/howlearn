import { User } from 'lucide-react';

type CaseType =
  | 'fictional'
  | 'parent'
  | 'beforeAfter'
  | 'classObservation'
  | 'studentConsulting'
  | 'parentConsulting'
  | string;

type CaseModuleProps = {
  type?: CaseType;
  title?: string;
  subjectProfile?: string;
  before?: string;
  intervention?: string;
  after?: string;
  quote?: string;
};

const typeLabels: Record<string, string> = {
  fictional: '가상 사례',
  parent: '부모 사례',
  beforeAfter: '전후 비교',
  classObservation: '수업 관찰',
  studentConsulting: '학생 상담',
  parentConsulting: '학부모 상담',
};

export function CaseModule({
  type = 'fictional',
  title,
  subjectProfile,
  before,
  intervention,
  after,
  quote,
}: CaseModuleProps) {
  const label = typeLabels[type] ?? '사례';
  const hasProfile = subjectProfile && subjectProfile.trim() !== '';

  return (
    <aside className="app-mdx-card my-8 p-6 sm:p-7" aria-label={label}>
      <div className="mb-3 flex flex-wrap items-baseline gap-2 gap-y-1">
        <span className="app-mdx-kicker">{label}</span>
        {title && (
          <h4 className="app-mdx-title m-0 text-base sm:text-lg">
            {title}
          </h4>
        )}
      </div>

      {hasProfile && (
        <div className="mb-5">
          <div className="app-mdx-body flex items-center gap-2 text-sm">
            <User className="h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden />
            <span>{subjectProfile}</span>
          </div>
          <div className="mt-3 h-px w-full bg-[var(--card-border)]" aria-hidden />
        </div>
      )}

      {!hasProfile && (before || intervention || after) && (
        <div className="mb-5 h-px bg-[var(--card-border)]" aria-hidden />
      )}

      <div className="space-y-5">
        {before && before.trim() !== '' && (
          <div>
            <div className="mb-1.5 text-xs font-bold tracking-wide text-[var(--fg-muted)]">
              이전
            </div>
            <p className="app-mdx-body m-0 text-[15px] leading-7">
              {before}
            </p>
          </div>
        )}

        {intervention && intervention.trim() !== '' && (
          <div className="rounded-md border border-[var(--card-border)] bg-[var(--surface-2)] px-4 py-4">
            <div className="mb-1.5 text-xs font-bold tracking-wide text-[var(--accent)]">
              개입
            </div>
            <p className="m-0 text-[15px] font-medium leading-7 text-[var(--fg)]">
              {intervention}
            </p>
          </div>
        )}

        {after && after.trim() !== '' && (
          <div>
            <div className="mb-1.5 text-xs font-bold tracking-wide text-[var(--success)]">
              이후
            </div>
            <p className="app-mdx-body m-0 text-[15px] leading-7">
              {after}
            </p>
          </div>
        )}

        {quote && quote.trim() !== '' && (
          <blockquote className="app-mdx-body mt-2 border-l-4 border-[var(--card-border)] pl-4 italic">
            &ldquo;{quote}&rdquo;
          </blockquote>
        )}
      </div>
    </aside>
  );
}
