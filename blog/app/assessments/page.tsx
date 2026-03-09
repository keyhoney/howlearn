import { getAllAssessments } from '@/lib/assessments/registry';
import { constructMetadata } from '@/lib/seo';
import { PageTransition } from '@/components/layout/PageTransition';
import Link from 'next/link';
import { ClipboardList, CheckSquare } from 'lucide-react';

export const metadata = constructMetadata({
  title: '평가 도구',
  description: '학생과 학부모를 위한 다양한 자가 진단 및 관찰 체크리스트를 제공합니다.',
  path: '/assessments',
  noindex: true,
});

export default function AssessmentsIndexPage() {
  const assessments = getAllAssessments();

  const studentTests = assessments.filter((a) => a.audience === 'student' && a.mode === 'likert');
  const studentChecklists = assessments.filter((a) => a.audience === 'student' && a.mode === 'checklist');
  const parentChecklists = assessments.filter((a) => a.audience === 'parent');

  const renderSection = (title: string, items: typeof assessments, icon: React.ReactNode) => (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((assessment) => (
          <Link
            key={assessment.slug}
            href={`/assessments/${assessment.slug}`}
            className="group block p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                {assessment.category}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
              {assessment.title}
            </h3>
            <p className="text-slate-600 text-sm line-clamp-2">
              {assessment.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 py-16 sm:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
              평가 및 진단 도구
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              학습 패턴, 경향성을 파악하고 맞춤형 지원을 받기 위한 자기 점검 및 관찰 도구입니다. 
              의료적 진단을 대신하지 않으며, 더 나은 학습 환경을 만들기 위한 참고 자료로 활용해주세요.
            </p>
          </div>

          {renderSection('학생용 테스트 (5점 척도)', studentTests, <ClipboardList className="w-6 h-6" />)}
          {renderSection('학생용 체크리스트 (O/X)', studentChecklists, <CheckSquare className="w-6 h-6" />)}
          {renderSection('학부모용 관찰 체크리스트', parentChecklists, <CheckSquare className="w-6 h-6" />)}
        </div>
      </div>
    </PageTransition>
  );
}
