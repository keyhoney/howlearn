import { AssessmentBand, AssessmentTool } from "./types";

export type AssessmentAnswers = Record<string, number | boolean>;

export function normalizeChecklistValue(value: boolean | number): number {
  if (typeof value === "boolean") return value ? 1 : 0;
  return value;
}

export function scoreAssessment(
  tool: AssessmentTool,
  answers: AssessmentAnswers
) {
  const total = tool.items.reduce((sum, item) => {
    const raw = answers[item.id];

    if (tool.mode === "likert") {
      const numeric = typeof raw === "number" ? raw : 0;
      const value = item.reverse ? 6 - numeric : numeric;
      return sum + value;
    }

    const numeric = normalizeChecklistValue(Boolean(raw));
    return sum + numeric;
  }, 0);

  const band =
    tool.bands.find((b) => total >= b.min && total <= b.max) ?? tool.bands[0];

  return {
    score: total,
    band,
  };
}

export function getBandLabel(band: AssessmentBand) {
  return band.label;
}
