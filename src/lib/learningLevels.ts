export type LearningLevel = "Simple" | "Foundation" | "Exam" | "Undergraduate" | "Research";

export interface LearningLevelProfile {
  id: LearningLevel;
  audience: string;
  explanationDepth: number;
  formulaComplexity: number;
  sliderCount: number;
  graphDetail: "minimal" | "standard" | "exam" | "derivation" | "research";
  showAssumptions: boolean;
  questionCount: number;
  uiDensity: "low" | "medium" | "high";
}

export const learningLevelProfiles: Record<LearningLevel, LearningLevelProfile> = {
  Simple: {
    id: "Simple",
    audience: "Grade 6-8",
    explanationDepth: 1,
    formulaComplexity: 1,
    sliderCount: 1,
    graphDetail: "minimal",
    showAssumptions: false,
    questionCount: 6,
    uiDensity: "low",
  },
  Foundation: {
    id: "Foundation",
    audience: "Grade 9-10",
    explanationDepth: 2,
    formulaComplexity: 2,
    sliderCount: 2,
    graphDetail: "standard",
    showAssumptions: true,
    questionCount: 7,
    uiDensity: "medium",
  },
  Exam: {
    id: "Exam",
    audience: "Grade 11-12",
    explanationDepth: 3,
    formulaComplexity: 3,
    sliderCount: 3,
    graphDetail: "exam",
    showAssumptions: true,
    questionCount: 6,
    uiDensity: "medium",
  },
  Undergraduate: {
    id: "Undergraduate",
    audience: "Undergraduate",
    explanationDepth: 4,
    formulaComplexity: 4,
    sliderCount: 3,
    graphDetail: "derivation",
    showAssumptions: true,
    questionCount: 8,
    uiDensity: "high",
  },
  Research: {
    id: "Research",
    audience: "PhD / Research",
    explanationDepth: 5,
    formulaComplexity: 5,
    sliderCount: 3,
    graphDetail: "research",
    showAssumptions: true,
    questionCount: 10,
    uiDensity: "high",
  },
};

export const learningLevels = Object.keys(learningLevelProfiles) as LearningLevel[];

export function defaultLearningLevelForClass(classLevel: string): LearningLevel {
  if (/phd|research/i.test(classLevel)) return "Research";
  if (/undergraduate/i.test(classLevel)) return "Undergraduate";
  if (/class\s*11|class\s*12|high school/i.test(classLevel)) return "Exam";
  if (/class\s*9|class\s*10/i.test(classLevel)) return "Foundation";
  return "Simple";
}
