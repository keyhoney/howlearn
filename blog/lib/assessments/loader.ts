import studentTests from "@/data/assessments/student-tests.json";
import studentChecklists from "@/data/assessments/student-checklists.json";
import parentChecklists from "@/data/assessments/parent-checklists.json";
import { AssessmentTool } from "./types";

const allAssessments: AssessmentTool[] = [
  ...(studentTests as AssessmentTool[]),
  ...(studentChecklists as AssessmentTool[]),
  ...(parentChecklists as AssessmentTool[]),
];

/** slug 중복 시 뒤쪽(나중에 spread된 항목)이 덮어씀 */
const bySlug = new Map<string, AssessmentTool>();
for (const tool of allAssessments) {
  bySlug.set(tool.slug, tool);
}

export function getAllAssessments(): AssessmentTool[] {
  return allAssessments;
}

export function getAssessmentBySlug(slug: string): AssessmentTool | undefined {
  return bySlug.get(slug);
}
