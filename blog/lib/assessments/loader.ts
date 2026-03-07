import studentTests from "@/data/assessments/student-tests.json";
import studentChecklists from "@/data/assessments/student-checklists.json";
import parentChecklists from "@/data/assessments/parent-checklists.json";
import { AssessmentTool } from "./types";

export function getAllAssessments(): AssessmentTool[] {
  return [
    ...(studentTests as AssessmentTool[]),
    ...(studentChecklists as AssessmentTool[]),
    ...(parentChecklists as AssessmentTool[]),
  ];
}

export function getAssessmentBySlug(slug: string): AssessmentTool | undefined {
  return getAllAssessments().find((tool) => tool.slug === slug);
}
