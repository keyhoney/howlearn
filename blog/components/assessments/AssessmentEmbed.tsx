import { getAssessmentBySlug } from '@/lib/assessments/registry';
import { AssessmentRenderer } from './AssessmentRenderer';

interface AssessmentEmbedProps {
  slug: string;
}

export function AssessmentEmbed({ slug }: AssessmentEmbedProps) {
  const assessment = getAssessmentBySlug(slug);

  if (!assessment) {
    return (
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-center">
        해당 평가 도구를 찾을 수 없습니다: <code>{slug}</code>
      </div>
    );
  }

  return (
    <div className="my-10">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{assessment.title}</h2>
        <p className="text-slate-600">{assessment.description}</p>
      </div>
      <AssessmentRenderer assessment={assessment} />
    </div>
  );
}
