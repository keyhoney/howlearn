"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { AssessmentTool } from "@/lib/assessments/types";
import { ClipboardList } from "lucide-react";

export type AssessmentCategoryKey = "all" | "student-checklist" | "student-test" | "parent-checklist";

function getCategoryKey(tool: AssessmentTool): Exclude<AssessmentCategoryKey, "all"> {
  if (tool.audience === "parent") return "parent-checklist";
  if (tool.mode === "likert") return "student-test";
  return "student-checklist";
}

function getCategoryLabel(key: Exclude<AssessmentCategoryKey, "all">): string {
  switch (key) {
    case "student-checklist":
      return "학생용 체크리스트";
    case "student-test":
      return "학생용 테스트";
    case "parent-checklist":
      return "학부모용";
    default:
      return key;
  }
}

const CATEGORY_STYLES: Record<Exclude<AssessmentCategoryKey, "all">, { badge: string; card: string }> = {
  "student-checklist": {
    badge:
      "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/50 group-hover:text-indigo-600 dark:group-hover:text-indigo-200",
    card:
      "border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-600 hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20",
  },
  "student-test": {
    badge:
      "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-200",
    card:
      "border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-600 hover:shadow-emerald-100 dark:hover:shadow-emerald-900/20",
  },
  "parent-checklist": {
    badge:
      "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 group-hover:bg-amber-50 dark:group-hover:bg-amber-900/50 group-hover:text-amber-600 dark:group-hover:text-amber-200",
    card:
      "border-slate-200 dark:border-slate-700 hover:border-amber-200 dark:hover:border-amber-600 hover:shadow-amber-100 dark:hover:shadow-amber-900/20",
  },
};

const FILTER_OPTIONS: { value: AssessmentCategoryKey; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "student-checklist", label: "학생용 체크리스트" },
  { value: "student-test", label: "학생용 테스트" },
  { value: "parent-checklist", label: "학부모용" },
];

interface ToolkitAssessmentGridProps {
  assessments: AssessmentTool[];
}

export function ToolkitAssessmentGrid({ assessments }: ToolkitAssessmentGridProps) {
  const [filter, setFilter] = useState<AssessmentCategoryKey>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return assessments;
    return assessments.filter((a) => getCategoryKey(a) === filter);
  }, [assessments, filter]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 mr-1">유형:</span>
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setFilter(opt.value)}
            className={
              "px-4 py-2 rounded-full text-sm font-medium transition-colors " +
              (filter === opt.value
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600")
            }
          >
            {opt.label}
            {opt.value === "all" ? ` (${assessments.length})` : ` (${assessments.filter((a) => getCategoryKey(a) === opt.value).length})`}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filtered.map((assessment) => {
          const key = getCategoryKey(assessment);
          const styles = CATEGORY_STYLES[key];
          return (
            <Link
              key={assessment.slug}
              href={`/assessments/${assessment.slug}`}
              className={`group block p-5 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl border shadow-sm hover:shadow-md transition-all ${styles.card}`}
            >
              <span
                className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 block w-fit transition-colors ${styles.badge}`}
              >
                {getCategoryLabel(key)}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {assessment.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                {assessment.description}
              </p>
            </Link>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400 text-center py-8">
          해당 유형의 도구가 없습니다.
        </p>
      )}
    </>
  );
}
