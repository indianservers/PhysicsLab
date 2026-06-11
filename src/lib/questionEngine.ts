import { ExperimentDefinition } from "../types";
import { LearningLevel, learningLevelProfiles } from "./learningLevels";
import { commonMistakesForExperiment } from "./commonMistakes";

export type QuestionType = "Conceptual" | "Numerical" | "Graph interpretation" | "Prediction" | "Error spotting" | "Real-world application" | "Viva voce";

export interface AdaptiveQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  answer: string;
  level: LearningLevel;
}

export function generateAdaptiveQuestions(experiment: ExperimentDefinition, level: LearningLevel, values: number[] = []) {
  const profile = learningLevelProfiles[level];
  const firstFormula = experiment.formulae[0];
  const mainInput = values[0] ?? "the first variable";
  const base: AdaptiveQuestion[] = [
    {
      id: `${experiment.id}-concept`,
      type: "Conceptual",
      prompt: `What main idea does ${experiment.title} demonstrate?`,
      answer: experiment.theory,
      level,
    },
    {
      id: `${experiment.id}-prediction`,
      type: "Prediction",
      prompt: `If ${mainInput} is increased while other variables stay fixed, what should you check first?`,
      answer: "Predict the trend, change only that variable, then compare the main output and graph slope/shape.",
      level,
    },
    {
      id: `${experiment.id}-formula`,
      type: "Numerical",
      prompt: firstFormula ? `Which formula applies here, and what does its first variable mean?` : `Which measured quantity should be recorded first?`,
      answer: firstFormula ? `${firstFormula.expression}; ${firstFormula.variables[0]?.symbol ?? "the first variable"} means ${firstFormula.variables[0]?.name ?? "the first listed quantity"}.` : experiment.observationColumns[0] ?? "Record the independent variable first.",
      level,
    },
    {
      id: `${experiment.id}-graph`,
      type: "Graph interpretation",
      prompt: "What graph feature would show the relationship most clearly?",
      answer: "Look for slope, curvature, intercept, peak, or area depending on the chosen variables.",
      level,
    },
    {
      id: `${experiment.id}-error`,
      type: "Error spotting",
      prompt: `Spot the likely mistake: ${commonMistakesForExperiment(experiment)[0] ?? "Units were mixed."}`,
      answer: "Correct it by checking units, assumptions, and changing one variable at a time.",
      level,
    },
    ...experiment.vivaQuestions.slice(0, 4).map((item, index): AdaptiveQuestion => ({
      id: `${experiment.id}-viva-${index}`,
      type: "Viva voce",
      prompt: item.prompt,
      answer: item.answer,
      level,
    })),
    {
      id: `${experiment.id}-real`,
      type: "Real-world application",
      prompt: `Where would ${experiment.title.toLowerCase()} appear outside the classroom?`,
      answer: "Connect the same relationship to a real device, measurement, engineering design, or natural event.",
      level,
    },
  ];
  return base.slice(0, profile.questionCount);
}
