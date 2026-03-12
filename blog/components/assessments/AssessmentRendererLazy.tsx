"use client";

import dynamic from "next/dynamic";
import type { AssessmentTool } from "@/lib/assessments/types";

const AssessmentRenderer = dynamic(
  () =>
    import("./AssessmentRenderer").then((mod) => ({
      default: mod.AssessmentRenderer,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        평가 도구를 불러오는 중…
      </div>
    ),
  }
);

type Props = { assessment: AssessmentTool };

/**
 * motion/react 청크가 서버/클라이언트 번들에서 어긋나
 * "Cannot read properties of undefined (reading 'call')" 나는 것을 막기 위해
 * AssessmentRenderer만 클라이언트에서 동적 로드합니다.
 */
export function AssessmentRendererLazy({ assessment }: Props) {
  return <AssessmentRenderer assessment={assessment} />;
}
