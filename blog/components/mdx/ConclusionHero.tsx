import { Lightbulb } from "lucide-react";

type ConclusionHeroProps = {
  leadLabel?: string;
  line1?: string;
  line2?: string;
  line3?: string;
  line4?: string;
  principle?: string;
};

const yellowStyle = {
  color: "#FDE047",
  textShadow: "0 1px 3px rgba(0,0,0,0.35)",
} as const;

/**
 * 결론부터 말하면 배너 — 세로 여백·타이포를 줄여 전체 높이 약 65% 수준으로 컴팩트하게
 */
export function ConclusionHero({
  leadLabel = "결론부터 말하면",
  line1 = "",
  line2 = "",
  line3,
  line4,
  principle,
}: ConclusionHeroProps) {
  const useFourLineMode =
    line3 != null &&
    line4 != null &&
    line3.trim() !== "" &&
    line4.trim() !== "";

  return (
    <header
      className="my-5 overflow-hidden rounded-2xl px-5 py-6 text-center shadow-lg sm:px-8 sm:py-7"
      style={{ backgroundColor: "#4F39F6" }}
      aria-label="결론 요약"
    >
      <p
        className="mb-3 text-xs font-semibold tracking-wide sm:text-sm"
        style={{ color: "rgba(255,255,255,0.92)" }}
      >
        {leadLabel}
      </p>

      <div className="mx-auto max-w-2xl space-y-1.5">
        {useFourLineMode ? (
          <>
            <p className="text-lg font-bold leading-snug sm:text-xl md:text-[1.35rem] md:leading-tight">
              <span
                style={{
                  color: "#c9d3ff",
                  textDecoration: "line-through",
                  textDecorationColor: "rgba(255,255,255,0.55)",
                }}
              >
                {line1}
              </span>
              <span style={{ color: "#FFFFFF" }}>{line2}</span>
            </p>
            <p className="text-lg font-bold leading-snug sm:text-xl md:text-[1.35rem] md:leading-tight">
              <span style={yellowStyle}>{line3}</span>
              <span style={{ color: "#FFFFFF" }}>{line4}</span>
            </p>
          </>
        ) : (
          <>
            <p
              className="text-lg font-bold leading-snug sm:text-xl md:text-[1.35rem] md:leading-tight"
              style={{ color: "#FFFFFF" }}
            >
              {line1}
            </p>
            <p
              className="text-lg font-bold leading-snug sm:text-xl md:text-[1.35rem] md:leading-tight"
              style={yellowStyle}
            >
              {line2}
            </p>
          </>
        )}
      </div>

      {principle && principle.trim() !== "" && (
        <div className="mt-4 flex justify-center sm:mt-5">
          <div
            className="inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 text-left sm:px-4 sm:py-2"
            style={{
              backgroundColor: "rgba(255,255,255,0.22)",
              borderColor: "rgba(255,255,255,0.35)",
            }}
          >
            <Lightbulb
              className="h-4 w-4 shrink-0 text-amber-300 sm:h-5 sm:w-5"
              style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.2))" }}
              aria-hidden
            />
            <span
              className="text-xs font-semibold sm:text-sm"
              style={{ color: "#FFFFFF" }}
            >
              {principle}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
