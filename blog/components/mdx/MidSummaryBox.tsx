import { toStringArray } from "@/lib/mdx-props";

type MidSummaryBoxProps = {
  title?: string;
  /** 요약 bullet 목록. JSON 배열 문자열 또는 배열. (items는 points의 별칭—호환용, 신규 작성 시 points만 사용) */
  points?: string[] | string | null;
  /** @deprecated points만 사용. 기존 MDX 호환용 별칭 */
  items?: string[] | string | null;
  highlight?: string;
};

/**
 * 30초 요약 다크 카드 — 제목이 prose 등에 묻혀 회색으로 보이지 않도록
 * 제목/본문/highlight 모두 color:#fff 인라인으로 고정
 */
export function MidSummaryBox({
  title = "바쁜 부모님을 위한 30초 요약",
  points,
  items,
  highlight,
}: MidSummaryBoxProps) {
  const list = toStringArray(points ?? items);
  if (list.length === 0 && !highlight) return null;

  const textWhite = { color: "#FFFFFF" } as const;
  const textAmber = { color: "#FBBF24" } as const;

  return (
    <aside
      className="my-12 overflow-hidden rounded-2xl px-6 py-8 shadow-lg sm:px-8 sm:py-10"
      style={{
        backgroundColor: "#1A1B2C",
        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.35)",
        color: "#FFFFFF",
      }}
      aria-label="30초 요약"
    >
      {/* 제목: prose h3 색 덮어쓰기 — 인라인 흰색 + 체크용 amber 번개 */}
      <h3
        className="mb-6 flex items-center gap-2 text-left text-lg font-bold sm:text-xl"
        style={textWhite}
      >
        <span className="text-xl leading-none" style={textAmber} aria-hidden>
          ⚡
        </span>
        <span style={textWhite}>{title}</span>
      </h3>

      {list.length > 0 && (
        <ul className="mb-8 list-none space-y-4 p-0">
          {list.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span
                className="mt-0.5 shrink-0 text-base font-semibold"
                style={{ color: "#A78BFA" }}
                aria-hidden
              >
                ✓
              </span>
              <span
                className="text-[15px] leading-7 sm:text-[16px] sm:leading-8"
                style={textWhite}
              >
                {point}
              </span>
            </li>
          ))}
        </ul>
      )}

      {highlight && highlight.trim() !== "" && (
        <div
          className="rounded-xl px-4 py-4 text-center text-[15px] font-medium leading-relaxed sm:py-5 sm:text-[16px]"
          style={{ backgroundColor: "#34384B", color: "#FFFFFF" }}
        >
          {highlight}
        </div>
      )}
    </aside>
  );
}
