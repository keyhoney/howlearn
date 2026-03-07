import { getAllAssessments, getAssessmentBySlug } from "./loader";

export { getAllAssessments, getAssessmentBySlug };

export const assessmentRegistry = {
  all: getAllAssessments,
  bySlug: getAssessmentBySlug,
};
