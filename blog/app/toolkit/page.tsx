import { getAllAssessments } from "@/lib/assessments/registry";
import { constructMetadata } from "@/lib/seo";
import { ClipboardList } from "lucide-react";
import { ToolkitAssessmentGrid } from "@/components/toolkit/ToolkitAssessmentGrid";

export const metadata = constructMetadata({
  title: "툴킷",
  description: "이론을 실제 행동으로 옮길 수 있도록 돕는 체크리스트, 템플릿, 워크시트 및 평가·진단 도구입니다.",
  path: "/toolkit",
});

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
        <ToolkitAssessmentGrid assessments={assessments} />
      </section>
    </div>
  );
}
