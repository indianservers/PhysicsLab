import { experiments } from "./experiments";
import { simulationQualityScores } from "./simulationQuality";
import { experimentAccuracyProfiles } from "./accuracyValidation";
import type { ExperimentDefinition } from "../types";

export type LearningFlowStage = "Hook" | "Predict" | "Explore" | "Measure" | "Explain" | "Apply";
export type LearningPriority = "Concept clarity" | "Misconception repair" | "Measurement skill" | "Transfer practice" | "Teacher workflow";

export interface LearningFlowStep {
  stage: LearningFlowStage;
  studentAction: string;
  teacherMove: string;
  evidence: string;
}

export interface LearningStudioProfile {
  experimentId: string;
  title: string;
  category: string;
  classLevel: string;
  difficulty: string;
  learningScore: number;
  classroomScore: number;
  accuracyScore: number;
  readinessScore: number;
  priority: LearningPriority;
  misconception: string;
  repairPrompt: string;
  lessonQuestion: string;
  successEvidence: string;
  flow: LearningFlowStep[];
  teacherChecks: string[];
  studentOutputs: string[];
}

export interface LearningStudioStats {
  profiles: number;
  averageReadiness: number;
  readyLessons: number;
  misconceptionRepairs: number;
  teacherReady: number;
  transferPrompts: number;
}

export const learningStudioProfiles: LearningStudioProfile[] = experiments
  .map(makeLearningProfile)
  .sort((left, right) => right.readinessScore - left.readinessScore || left.title.localeCompare(right.title));

export const learningStudioStats = makeLearningStats(learningStudioProfiles);
export const phase3LessonPacks = makeLessonPacks(learningStudioProfiles);

function makeLearningProfile(experiment: ExperimentDefinition): LearningStudioProfile {
  const quality = simulationQualityScores.find((item) => item.id === experiment.id);
  const accuracy = experimentAccuracyProfiles.find((item) => item.experimentId === experiment.id);
  const learningScore = quality?.dimensions.learning ?? 55;
  const classroomScore = quality?.dimensions.classroom ?? 55;
  const accuracyScore = accuracy?.modelGrade ?? quality?.dimensions.accuracy ?? 55;
  const readinessScore = clamp(Math.round(learningScore * 0.4 + classroomScore * 0.3 + accuracyScore * 0.2 + scoreEvidence(experiment) * 0.1));
  const misconception = firstUseful(experiment.commonMistakes, misconceptionFor(experiment));
  const firstFormula = experiment.formulae[0]?.expression;
  const primaryObservation = experiment.observationColumns[1] ?? "measured value";
  return {
    experimentId: experiment.id,
    title: experiment.title,
    category: experiment.category,
    classLevel: experiment.classLevel,
    difficulty: experiment.difficulty,
    learningScore,
    classroomScore,
    accuracyScore,
    readinessScore,
    priority: priorityFor(experiment, learningScore, classroomScore),
    misconception,
    repairPrompt: repairPromptFor(experiment, misconception),
    lessonQuestion: `How can we use ${experiment.title.toLowerCase()} to predict ${primaryObservation.toLowerCase()} before reading the answer?`,
    successEvidence: `A strong learner can write a prediction, collect ${primaryObservation.toLowerCase()} data, explain the trend, and apply it to a new case.`,
    flow: makeFlow(experiment, firstFormula),
    teacherChecks: makeTeacherChecks(experiment, accuracyScore),
    studentOutputs: makeStudentOutputs(experiment),
  };
}

function makeFlow(experiment: ExperimentDefinition, formula?: string): LearningFlowStep[] {
  const control = experiment.observationColumns[1] ?? experiment.apparatus[0] ?? "input";
  const output = experiment.observationColumns[experiment.observationColumns.length - 1] ?? "result";
  return [
    {
      stage: "Hook",
      studentAction: `Name a real situation where ${experiment.title.toLowerCase()} matters.`,
      teacherMove: `Show the apparatus list and ask which part changes the result most.`,
      evidence: "One everyday example with a reason.",
    },
    {
      stage: "Predict",
      studentAction: `Predict how ${output.toLowerCase()} changes when ${control.toLowerCase()} changes.`,
      teacherMove: "Ask for a written prediction before sliders or visuals move.",
      evidence: "Prediction includes increase, decrease, or no-change language.",
    },
    {
      stage: "Explore",
      studentAction: "Change one variable at a time and keep the others fixed.",
      teacherMove: "Pause after the first visible change and ask what stayed controlled.",
      evidence: "At least two controlled trials.",
    },
    {
      stage: "Measure",
      studentAction: `Record ${experiment.observationColumns.slice(0, 4).join(", ")} with units.`,
      teacherMove: "Check units and ask students to circle the independent variable.",
      evidence: "A table with units and one repeated trial.",
    },
    {
      stage: "Explain",
      studentAction: formula ? `Connect the pattern to ${formula}.` : "Connect the pattern to the stated theory.",
      teacherMove: "Ask students to explain the cause before giving the final rule.",
      evidence: "One sentence linking cause, equation, and observation.",
    },
    {
      stage: "Apply",
      studentAction: "Solve a changed setup or explain a real-world transfer case.",
      teacherMove: "Change the context, not just the numbers.",
      evidence: "Correct transfer answer plus one limitation.",
    },
  ];
}

function makeTeacherChecks(experiment: ExperimentDefinition, accuracyScore: number) {
  const checks = [
    "Prediction is written before simulation changes.",
    "Only one input changes per trial.",
    "Observation table includes units.",
    "Conclusion mentions the original aim.",
  ];
  if (experiment.commonMistakes.length) checks.push(`Misconception check: ${experiment.commonMistakes[0]}`);
  if (accuracyScore < 70) checks.push("Do not present numeric output as validated beyond the stated range.");
  return checks.slice(0, 6);
}

function makeStudentOutputs(experiment: ExperimentDefinition) {
  return [
    "Prediction sentence",
    `${experiment.observationColumns.slice(0, 4).join(" / ")} table`,
    "Pattern explanation",
    "Formula or theory link",
    "One transfer example",
  ];
}

function scoreEvidence(experiment: ExperimentDefinition) {
  let score = 45;
  if (experiment.vivaQuestions.length) score += 12;
  if (experiment.commonMistakes.length >= 2) score += 12;
  if (experiment.observationColumns.length >= 4) score += 12;
  if (experiment.curriculumTags?.classes.length) score += 10;
  if (experiment.formulae.length) score += 9;
  return clamp(score);
}

function priorityFor(experiment: ExperimentDefinition, learningScore: number, classroomScore: number): LearningPriority {
  if (learningScore < 68) return "Concept clarity";
  if (experiment.commonMistakes.length >= 2) return "Misconception repair";
  if (experiment.observationColumns.length >= 4) return "Measurement skill";
  if (classroomScore < 72) return "Teacher workflow";
  return "Transfer practice";
}

function misconceptionFor(experiment: ExperimentDefinition) {
  const category = experiment.category.toLowerCase();
  if (category.includes("optics")) return "Confusing the visible ray picture with the actual measured angle or image distance.";
  if (category.includes("electric")) return "Thinking current is used up instead of conserved through a simple circuit path.";
  if (category.includes("magnet")) return "Treating field direction and force direction as the same thing.";
  if (category.includes("wave")) return "Mixing amplitude, frequency, speed, and wavelength as if they were the same property.";
  if (category.includes("thermo")) return "Treating heat and temperature as identical quantities.";
  if (category.includes("fluid")) return "Confusing force, pressure, density, and depth effects.";
  if (category.includes("modern")) return "Expecting classical intuition to work without checking the quantum rule.";
  return "Changing more than one variable and then claiming a cause-effect conclusion.";
}

function repairPromptFor(experiment: ExperimentDefinition, misconception: string) {
  return `A student says: "${misconception}" Ask them to use ${experiment.title.toLowerCase()} data to prove, repair, or limit that claim.`;
}

function makeLearningStats(profiles: LearningStudioProfile[]): LearningStudioStats {
  const avg = (selector: (profile: LearningStudioProfile) => number) =>
    Math.round(profiles.reduce((sum, profile) => sum + selector(profile), 0) / Math.max(1, profiles.length));
  return {
    profiles: profiles.length,
    averageReadiness: avg((profile) => profile.readinessScore),
    readyLessons: profiles.filter((profile) => profile.readinessScore >= 78).length,
    misconceptionRepairs: profiles.filter((profile) => profile.misconception.length > 0).length,
    teacherReady: profiles.filter((profile) => profile.classroomScore >= 76).length,
    transferPrompts: profiles.length,
  };
}

function makeLessonPacks(profiles: LearningStudioProfile[]) {
  return Object.entries(
    profiles.reduce<Record<string, LearningStudioProfile[]>>((groups, profile) => {
      groups[profile.category] = [...(groups[profile.category] ?? []), profile];
      return groups;
    }, {}),
  )
    .map(([category, items]) => ({
      category,
      count: items.length,
      averageReadiness: Math.round(items.reduce((sum, item) => sum + item.readinessScore, 0) / items.length),
      strongest: [...items].sort((left, right) => right.readinessScore - left.readinessScore).slice(0, 3),
      focus: focusForCategory(category),
    }))
    .sort((left, right) => right.averageReadiness - left.averageReadiness || left.category.localeCompare(right.category));
}

function focusForCategory(category: string) {
  if (category.includes("Optics")) return "Ray tracing, image prediction, and angle measurement.";
  if (category.includes("Electric")) return "Circuit reasoning, proportionality, and safe measurement.";
  if (category.includes("Magnet")) return "Field direction, induction, and cause-effect sequencing.";
  if (category.includes("Wave")) return "Graph reading, frequency-wavelength links, and interference language.";
  if (category.includes("Thermo")) return "Heat, temperature, energy flow, and equilibrium reasoning.";
  if (category.includes("Fluid")) return "Pressure-depth-density comparisons with units.";
  if (category.includes("Modern")) return "Model limits, evidence, and quantum rule application.";
  return "Prediction, controlled variables, and transfer explanation.";
}

function firstUseful(values: string[], fallback: string) {
  return values.find((value) => value.trim().length > 0) ?? fallback;
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
