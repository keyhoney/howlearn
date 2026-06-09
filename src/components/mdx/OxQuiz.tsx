'use client';

import { useState } from 'react';

type OxQuizProps = {
  question: string;
  correctIsO?: boolean | string;
  explanation: string;
};

function toBoolean(v: boolean | string | undefined): boolean {
  if (v === true || v === 'true') return true;
  if (v === false || v === 'false') return false;
  return false;
}

export function OxQuiz({ question, correctIsO, explanation }: OxQuizProps) {
  const [picked, setPicked] = useState<'O' | 'X' | null>(null);
  const isCorrectO = toBoolean(correctIsO);
  const correct = picked !== null && (picked === 'O') === isCorrectO;

  return (
    <aside
      className="app-mdx-card my-8 p-6"
      aria-label="OX 퀴즈"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="app-mdx-kicker">
          OX 퀴즈
        </span>
      </div>
      <p className="app-mdx-title mb-6 text-center text-lg">
        Q. {question}
      </p>
      <div className="mb-6 flex justify-center gap-4" role="group" aria-label="답 선택">
        {(['O', 'X'] as const).map((choice) => {
          const isSelected = picked === choice;
          const isCorrectChoice =
            picked !== null &&
            ((choice === 'O' && isCorrectO) || (choice === 'X' && !isCorrectO));
          return (
            <button
              key={choice}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setPicked(choice)}
              className={`flex h-20 w-20 items-center justify-center rounded-full border-2 text-3xl font-black transition-all ${
                isSelected
                  ? isCorrectChoice
                    ? 'scale-110 border-[var(--success)] bg-[var(--success)] text-white shadow-lg'
                    : 'scale-110 border-[var(--danger)] bg-[var(--danger)] text-white shadow-lg'
                  : 'border-[var(--card-border)] bg-[var(--surface-1)] text-[var(--fg-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
              }`}
            >
              {choice}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div
          className={`app-feedback p-4 text-left ${
            correct
              ? 'app-feedback-success'
              : 'app-feedback-danger'
          }`}
        >
          <div className="mb-2 font-bold">{correct ? '정답입니다!' : '아쉽지만 틀렸습니다.'}</div>
          <p className="text-sm leading-relaxed">{explanation}</p>
        </div>
      )}
    </aside>
  );
}
