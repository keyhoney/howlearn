"use client";

import { useState } from "react";

type OxQuizProps = {
  question: string;
  /** true = O가 정답 */
  correctIsO: boolean;
  /** 정답 선택 후 표시 */
  explanation: string;
};

/**
 * 참여 모듈: OX 퀴즈 (ParticipationModule 톤: indigo 박스 + 원형 O/X 버튼)
 */
export function OxQuiz({ question, correctIsO, explanation }: OxQuizProps) {
  const [picked, setPicked] = useState<"O" | "X" | null>(null);
  const correct = picked !== null && (picked === "O") === correctIsO;

  return (
    <aside
      className="my-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-6 shadow-sm dark:border-indigo-900/50 dark:bg-indigo-950/40"
      aria-label="OX 퀴즈"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded bg-indigo-100 px-2 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-900/60 dark:text-indigo-300">
          OX 퀴즈
        </span>
      </div>
      <p className="mb-6 text-center text-lg font-bold text-indigo-900 dark:text-indigo-100">
        Q. {question}
      </p>
      <div className="mb-6 flex justify-center gap-4" role="group" aria-label="답 선택">
        {(["O", "X"] as const).map((choice) => {
          const isSelected = picked === choice;
          const isCorrectChoice =
            picked !== null &&
            ((choice === "O" && correctIsO) || (choice === "X" && !correctIsO));
          return (
            <button
              key={choice}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setPicked(choice)}
              className={`flex h-20 w-20 items-center justify-center rounded-full border-2 text-3xl font-black transition-all dark:border-indigo-800 ${
                isSelected
                  ? isCorrectChoice
                    ? "scale-110 bg-emerald-600 text-white shadow-lg dark:bg-emerald-600"
                    : "scale-110 bg-rose-600 text-white shadow-lg dark:bg-rose-600"
                  : "border-indigo-100 bg-white text-indigo-300 hover:border-indigo-300 hover:text-indigo-500 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-500 dark:hover:border-indigo-600"
              }`}
            >
              {choice}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div
          className={`rounded-xl p-4 text-left dark:text-inherit ${
            correct
              ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100"
              : "bg-red-100 text-red-900 dark:bg-rose-900/40 dark:text-rose-100"
          }`}
        >
          <div className="mb-2 font-bold">
            {correct ? "정답입니다!" : "아쉽지만 틀렸습니다."}
          </div>
          <p className="text-sm leading-relaxed">{explanation}</p>
        </div>
      )}
    </aside>
  );
}
