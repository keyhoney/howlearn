import { notFound } from 'next/navigation';
import { getAssessmentBySlug, getAllAssessments } from '@/lib/assessments/registry';
import { AssessmentRenderer } from '@/components/assessments/AssessmentRenderer';
import { constructMetadata } from '@/lib/seo';
import { PageTransition } from '@/components/layout/PageTransition';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface AssessmentPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const assessments = getAllAssessments();
  return assessments.map((assessment) => ({
    slug: assessment.slug,
  }));
}

export async function generateMetadata({ params }: AssessmentPageProps) {
  const { slug } = await params;
  const assessment = getAssessmentBySlug(slug);

  if (!assessment) {
    return constructMetadata({
      title: 'Assessment Not Found',
      description: 'The requested assessment could not be found.',
      noindex: true,
    });
  }

  return constructMetadata({
    title: assessment.title,
    description: assessment.description,
    noindex: true,
  });
}

export default async function AssessmentPage({ params }: AssessmentPageProps) {
  const { slug } = await params;
  const assessment = getAssessmentBySlug(slug);

  if (!assessment) {
    notFound();
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 py-12 sm:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <Link
              href="/toolkit"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              툴킷으로 돌아가기
            </Link>
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
              {assessment.category}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              {assessment.title}
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {assessment.description}
            </p>
          </div>

          <AssessmentRenderer assessment={assessment} />
        </div>
      </div>
    </PageTransition>
  );
}
