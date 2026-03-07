'use client';

import { AssessmentItem } from '@/lib/assessments/types';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';

interface ChecklistQuestionProps {
  item: AssessmentItem;
  value: number | null;
  onChange: (value: number) => void;
}

export function ChecklistQuestion({ item, value, onChange }: ChecklistQuestionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-slate-900">{item.text}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onChange(1)}
          className={`
            relative p-6 rounded-xl border-2 text-center transition-all duration-200
            flex flex-col items-center justify-center gap-3
            ${
              value === 1
                ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-slate-50'
            }
          `}
        >
          <div className={`p-3 rounded-full ${value === 1 ? 'bg-emerald-100' : 'bg-slate-100'}`}>
            <Check className={`w-6 h-6 ${value === 1 ? 'text-emerald-600' : 'text-slate-400'}`} />
          </div>
          <span className="text-lg font-semibold">예 (Yes)</span>
          {value === 1 && (
            <motion.div
              layoutId="checklist-selection"
              className="absolute inset-0 border-2 border-emerald-600 rounded-xl"
              initial={false}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>

        <button
          onClick={() => onChange(0)}
          className={`
            relative p-6 rounded-xl border-2 text-center transition-all duration-200
            flex flex-col items-center justify-center gap-3
            ${
              value === 0
                ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:border-rose-300 hover:bg-slate-50'
            }
          `}
        >
          <div className={`p-3 rounded-full ${value === 0 ? 'bg-rose-100' : 'bg-slate-100'}`}>
            <X className={`w-6 h-6 ${value === 0 ? 'text-rose-600' : 'text-slate-400'}`} />
          </div>
          <span className="text-lg font-semibold">아니오 (No)</span>
          {value === 0 && (
            <motion.div
              layoutId="checklist-selection"
              className="absolute inset-0 border-2 border-rose-600 rounded-xl"
              initial={false}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      </div>
    </div>
  );
}
