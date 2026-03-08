import { getAllAssessments } from "@/lib/assessments/registry";
import type { AssessmentTool } from "@/lib/assessments/types";
import { constructMetadata } from "@/lib/seo";
import Link from "next/link";
import { ClipboardList } from "lucide-react";

export const metadata = constructMetadata({
  title: "툴킷",
  description: "이론을 실제 행동으로 옮길 수 있도록 돕는 체크리스트, 템플릿, 워크시트 및 평가·진단 도구입니다.",
});

function getAssessmentBadgeLabel(tool: AssessmentTool): string {
  if (tool.audience === "parent") return "학부모용";
  if (tool.mode === "likert") return "학생용 테스트";
  return "학생용 체크리스트";
}

export default async function ToolkitPage() {
  const assessments = getAllAssessments();

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          툴킷
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
          이론을 실제 행동으로 옮길 수 있도록 돕는 체크리스트, 템플릿, 워크시트 및 평가·진단 도구입니다.
        </p>
      </div>

      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 rounded-xl">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              평가 및 진단 도구 ({assessments.length}종)
            </h2>
            <p className="mt-1 text-slate-600 dark:text-slate-400 text-sm">
              학생의 학습 패턴, 집중력, 시험 불안 등을 점검할 수 있는 자가 진단 테스트와 학부모용 관찰 체크리스트입니다.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {assessments.map((assessment) => (
            <Link
              key={assessment.slug}
              href={`/assessments/${assessment.slug}`}
              className="group block p-5 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-600 transition-all"
            >
              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors mb-3 block w-fit">
                {getAssessmentBadgeLabel(assessment)}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {assessment.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                {assessment.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
