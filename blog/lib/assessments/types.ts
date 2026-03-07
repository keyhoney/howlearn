export type Audience = "student" | "parent";
export type Mode = "likert" | "checklist";

export type AssessmentItem = {
  id: string;
  text: string;
  reverse?: boolean;
};

export type AssessmentBand = {
  min: number;
  max: number;
  label: string;
  summary: string;
  actions: string[];
};

export type AssessmentTool = {
  slug: string;
  title: string;
  description: string;
  audience: Audience;
  mode: Mode;
  category: "test" | "checklist";
  items: AssessmentItem[];
  bands: AssessmentBand[];
  disclaimer: string;
  exampleResult?: {
    score: number;
    label: string;
    summary: string;
  };
};
