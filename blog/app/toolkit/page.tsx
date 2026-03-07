import { getContentByType } from "@/lib/content";
import { ContentHub } from "@/components/shared/ContentHub";
import { constructMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";

export const metadata = constructMetadata({
  title: "툴킷",
  description: "이론을 실제 행동으로 옮길 수 있도록 돕는 체크리스트, 템플릿, 워크시트입니다.",
});

export default async function ToolkitPage() {
  const content = await getContentByType("toolkit");
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">툴킷</h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl">
          이론을 실제 행동으로 옮길 수 있도록 돕는 체크리스트, 템플릿, 워크시트입니다.
        </p>
      </div>

      <div className="mb-16 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
          <ClipboardList className="w-48 h-48 text-indigo-600" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            새로운 기능
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            평가 및 진단 도구 (30종)
          </h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            학생의 학습 패턴, 집중력, 시험 불안 등을 점검할 수 있는 자가 진단 테스트와 학부모용 관찰 체크리스트를 새롭게 제공합니다.
          </p>
          <Link
            href="/assessments"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            평가 도구 바로가기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <ContentHub 
        title="일반 툴킷" 
        description="다운로드 가능한 템플릿과 워크시트" 
        content={content} 
        type="toolkit" 
        hideHeader
      />
    </div>
  );
}
