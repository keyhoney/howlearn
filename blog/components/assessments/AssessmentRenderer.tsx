'use client';

import { useState } from 'react';
import { AssessmentTool, AssessmentBand } from '@/lib/assessments/types';
import { scoreAssessment } from '@/lib/assessments/scoring';
import { LikertQuestion } from './LikertQuestion';
import { ChecklistQuestion } from './ChecklistQuestion';
import { ProgressBar } from './ProgressBar';
import { ResultCard } from './ResultCard';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AssessmentRendererProps {
  assessment: AssessmentTool;
}

export function AssessmentRenderer({ assessment }: AssessmentRendererProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const totalSteps = assessment.items.length;
  const currentItem = assessment.items[currentStep];
  const isLastStep = currentStep === totalSteps - 1;
  const canProceed = answers[currentItem.id] !== undefined;

  const handleAnswer = (value: number) => {
    setAnswers((prev) => ({ ...prev, [currentItem.id]: value }));
    
    // Auto-advance after a short delay for better UX
    if (!isLastStep) {
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 400);
    }
  };

  const handleNext = () => {
    if (canProceed && !isLastStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (canProceed && isLastStep) {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setShowResult(false);
  };

  if (showResult) {
    const { score, band } = scoreAssessment(assessment, answers);
    
    if (!band) {
      return (
        <div className="p-6 bg-rose-50 text-rose-600 rounded-xl">
          결과를 계산하는 중 오류가 발생했습니다.
        </div>
      );
    }

    return (
      <ResultCard
        assessment={assessment}
        score={score}
        band={band}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="mb-8">
        <ProgressBar current={currentStep + 1} total={totalSteps} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 min-h-[400px] flex flex-col">
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4 text-sm font-medium text-indigo-600 uppercase tracking-wider">
                Question {currentStep + 1} of {totalSteps}
              </div>
              
              {assessment.mode === 'likert' ? (
                <LikertQuestion
                  item={currentItem}
                  value={answers[currentItem.id] ?? null}
                  onChange={handleAnswer}
                />
              ) : (
                <ChecklistQuestion
                  item={currentItem}
                  value={answers[currentItem.id] ?? null}
                  onChange={handleAnswer}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            이전
          </button>

          {isLastStep ? (
            <button
              onClick={handleSubmit}
              disabled={!canProceed}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
                canProceed
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              결과 보기
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
                canProceed
                  ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm hover:shadow'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              다음
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
