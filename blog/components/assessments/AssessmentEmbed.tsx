"use client";

import { getAssessmentBySlug } from "@/lib/assessments/registry";
import { AssessmentRendererLazy } from "./AssessmentRendererLazy";

interface AssessmentEmbedProps {
  slug: string;
}

export function AssessmentEmbed({ slug }: AssessmentEmbedProps) {
  const assessment = getAssessmentBySlug(slug);

  if (!assessment) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
        해당 평가 도구를 찾을 수 없습니다: <code>{slug}</code>
      </div>
    );
  }

  return (
    <div className="my-10">
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-2xl font-bold text-slate-900">{assessment.title}</h2>
        <p className="text-slate-600">{assessment.description}</p>
      </div>
      <AssessmentRendererLazy assessment={assessment} />
    </div>
  );
}
