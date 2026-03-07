'use client';

import { AssessmentTool, AssessmentBand } from '@/lib/assessments/types';
import { motion } from 'motion/react';
import { ArrowRight, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

interface ResultCardProps {
  assessment: AssessmentTool;
  score: number;
  band: AssessmentBand;
  onRestart: () => void;
}

export function ResultCard({ assessment, score, band, onRestart }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <div className="p-8 sm:p-10 border-b border-slate-100 bg-slate-50/50 text-center">
        <p className="text-sm font-semibold text-indigo-600 tracking-wide uppercase mb-2">
          평가 결과
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
          {band.label}
        </h2>
        <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
          <span className="text-slate-500 mr-2">총점:</span>
          <span className="text-xl font-bold text-slate-900">{score}점</span>
        </div>
      </div>

      <div className="p-8 sm:p-10 space-y-8">
        <section>
          <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full inline-block" />
            결과 해석
          </h3>
          <p className="text-slate-600 leading-relaxed">{band.summary}</p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block" />
            권장 행동
          </h3>
          <ul className="space-y-3">
            {band.actions?.map((advice, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate-600">
                <ArrowRight className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{advice}</span>
              </li>
            ))}
          </ul>
        </section>

        {assessment.disclaimer && (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-sm leading-relaxed">
            <strong>참고:</strong> {assessment.disclaimer}
          </div>
        )}

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium px-4 py-2"
          >
            <RefreshCcw className="w-4 h-4" />
            다시 하기
          </button>
          <Link
            href="/toolkit"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors w-full sm:w-auto"
          >
            다른 툴킷 보기
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
