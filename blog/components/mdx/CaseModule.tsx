import { User } from "lucide-react";

type CaseType =
  | "fictional"
  | "parent"
  | "beforeAfter"
  | "classObservation"
  | "studentConsulting"
  | "parentConsulting"
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
  fictional: "가상 사례",
  parent: "부모 사례",
  beforeAfter: "전후 비교",
  classObservation: "수업 관찰",
  studentConsulting: "학생 상담",
  parentConsulting: "학부모 상담",
};

/** 시안 색상 (이미지 스펙) */
const C = {
  cardBg: "#FFFFFF",
  tagBg: "#F0F2F5",
  tagText: "#4A4A4A",
  titleText: "#1A1A1A",
  bodyText: "#4A4A4A",
  purple: "#805AD5",
  beforeLabel: "#A0AEC0",
  line: "#E2E8F0",
  interventionBg: "#EDF2F7",
  afterLabel: "#48BB78",
} as const;

/**
 * 사례 카드 — 시안 색상 그대로 + subjectProfile 아래 얇은 구분선
 */
export function CaseModule({
  type = "fictional",
  title,
  subjectProfile,
  before,
  intervention,
  after,
  quote,
}: CaseModuleProps) {
  const label = typeLabels[type] ?? "사례";
  const hasProfile = subjectProfile && subjectProfile.trim() !== "";

  return (
    <aside
      className="my-8 rounded-xl p-6 shadow-sm sm:p-7"
      style={{
        backgroundColor: C.cardBg,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
      }}
      aria-label={label}
    >
      {/* 태그 + 제목 */}
      <div className="mb-3 flex flex-wrap items-baseline gap-2 gap-y-1">
        <span
          className="inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-medium"
          style={{ backgroundColor: C.tagBg, color: C.tagText }}
        >
          {label}
        </span>
        {title && (
          <h4
            className="m-0 text-base font-bold sm:text-lg"
            style={{ color: C.titleText }}
          >
            {title}
          </h4>
        )}
      </div>

      {/* 프로필: 아이콘 #805AD5, 글자 #4A4A4A */}
      {hasProfile && (
        <div className="mb-5">
          <div className="flex items-center gap-2 text-sm" style={{ color: C.bodyText }}>
            <User
              className="h-4 w-4 shrink-0"
              style={{ color: C.purple }}
              aria-hidden
            />
            <span>{subjectProfile}</span>
          </div>
          {/* 프로필 바로 아래 얇은 선 (시안 #E2E8F0) */}
          <div
            className="mt-3 w-full"
            style={{ height: 1, backgroundColor: C.line }}
            aria-hidden
          />
        </div>
      )}

      {/* 프로필 없을 때도 본문 전 구분선이 필요하면 여기에 넣을 수 있음 */}
      {!hasProfile && (before || intervention || after) && (
        <div className="mb-5" style={{ height: 1, backgroundColor: C.line }} aria-hidden />
      )}

      <div className="space-y-5">
        {before && before.trim() !== "" && (
          <div>
            <div
              className="mb-1.5 text-xs font-bold tracking-wide"
              style={{ color: C.beforeLabel }}
            >
              이전
            </div>
            <p className="m-0 text-[15px] leading-7" style={{ color: C.bodyText }}>
              {before}
            </p>
          </div>
        )}

        {/* INTERVENTION 박스 배경 #EDF2F7, 라벨·본문 모두 #805AD5 */}
        {intervention && intervention.trim() !== "" && (
          <div className="rounded-lg px-4 py-4" style={{ backgroundColor: C.interventionBg }}>
            <div
              className="mb-1.5 text-xs font-bold tracking-wide"
              style={{ color: C.purple }}
            >
              개입
            </div>
            <p className="m-0 text-[15px] font-medium leading-7" style={{ color: C.purple }}>
              {intervention}
            </p>
          </div>
        )}

        {after && after.trim() !== "" && (
          <div>
            <div
              className="mb-1.5 text-xs font-bold tracking-wide"
              style={{ color: C.afterLabel }}
            >
              이후
            </div>
            <p className="m-0 text-[15px] leading-7" style={{ color: C.bodyText }}>
              {after}
            </p>
          </div>
        )}

        {quote && quote.trim() !== "" && (
          <blockquote
            className="mt-2 border-l-4 pl-4 italic"
            style={{ borderColor: C.line, color: C.bodyText }}
          >
            &ldquo;{quote}&rdquo;
          </blockquote>
        )}
      </div>
    </aside>
  );
}
