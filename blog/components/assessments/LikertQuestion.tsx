'use client';

import { AssessmentItem } from '@/lib/assessments/types';
import { likertLabels } from '@/lib/assessments/labels';
import { motion } from 'motion/react';

interface LikertQuestionProps {
  item: AssessmentItem;
  value: number | null;
  onChange: (value: number) => void;
}

export function LikertQuestion({ item, value, onChange }: LikertQuestionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-slate-900">{item.text}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {likertLabels.map((label) => {
          const isSelected = value === label.value;
          return (
            <button
              key={label.value}
              onClick={() => onChange(label.value)}
              className={`
                relative p-4 rounded-xl border-2 text-center transition-all duration-200
                flex flex-col items-center justify-center gap-2
                ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
                }
              `}
            >
              <span className="text-lg font-semibold">{label.value}</span>
              <span className="text-xs font-medium">{label.label}</span>
              {isSelected && (
                <motion.div
                  layoutId="likert-selection"
                  className="absolute inset-0 border-2 border-indigo-600 rounded-xl"
                  initial={false}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
