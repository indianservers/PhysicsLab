import type { LearningLevel } from "../../lib/learningLevels";

export type ExperimentMode = "Beginner" | "Normal" | "Advanced" | "Teacher";

export const experimentModes: ExperimentMode[] = ["Beginner", "Normal", "Advanced", "Teacher"];

export function learningLevelForMode(mode: ExperimentMode, fallback: LearningLevel): LearningLevel {
  if (mode === "Beginner") return "Simple";
  if (mode === "Normal") return fallback === "Simple" ? "Foundation" : fallback;
  if (mode === "Advanced") return "Undergraduate";
  return "Exam";
}

export function modeFromLearningLevel(level: LearningLevel): ExperimentMode {
  if (level === "Simple") return "Beginner";
  if (level === "Undergraduate" || level === "Research") return "Advanced";
  return "Normal";
}
