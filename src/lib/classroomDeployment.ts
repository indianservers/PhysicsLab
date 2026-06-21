import { experiments } from "./experiments";
import { simulationQualityScores } from "./simulationQuality";
import { learningStudioProfiles } from "./learningStudio";
import { simulationDepthProfiles } from "./simulationDepth";
import { experimentAccuracyProfiles } from "./accuracyValidation";
import type { ExperimentDefinition } from "../types";

export type ClassroomDeploymentTier = "Ready to assign" | "Guided teacher review" | "Needs classroom pass" | "Do not assign yet";
export type EvidenceRequirement = "Prediction" | "Controlled trials" | "Observation table" | "Graph or screenshot" | "Conclusion" | "Quiz check" | "Transfer answer";

export interface ClassroomDeploymentProfile {
  experimentId: string;
  title: string;
  category: string;
  classLevel: string;
  deploymentScore: number;
  classroomScore: number;
  learningScore: number;
  accuracyScore: number;
  visualDepthScore: number;
  tier: ClassroomDeploymentTier;
  evidenceRequirements: EvidenceRequirement[];
  assignmentDefaults: {
    lockVariables: boolean;
    requireNotebook: boolean;
    requireQuiz: boolean;
    suggestedMinutes: number;
  };
  teacherSetup: string;
  studentSubmission: string;
  reviewRubric: string[];
  rolloutRisk: string;
  nextDeploymentAction: string;
}

export interface ClassroomDeploymentStats {
  profiles: number;
  averageDeployment: number;
  readyToAssign: number;
  reviewRequired: number;
  needsPass: number;
  blocked: number;
  evidenceItems: number;
}

const allEvidence: EvidenceRequirement[] = ["Prediction", "Controlled trials", "Observation table", "Graph or screenshot", "Conclusion", "Quiz check", "Transfer answer"];

export const classroomDeploymentProfiles: ClassroomDeploymentProfile[] = experiments
  .map(makeDeploymentProfile)
  .sort((left, right) => right.deploymentScore - left.deploymentScore || left.title.localeCompare(right.title));

export const classroomDeploymentStats = makeDeploymentStats(classroomDeploymentProfiles);
export const classroomDeploymentGaps = makeDeploymentGaps(classroomDeploymentProfiles);
export const classroomPackPlans = makeClassroomPackPlans(classroomDeploymentProfiles);

function makeDeploymentProfile(experiment: ExperimentDefinition): ClassroomDeploymentProfile {
  const quality = simulationQualityScores.find((item) => item.id === experiment.id);
  const learning = learningStudioProfiles.find((item) => item.experimentId === experiment.id);
  const depth = simulationDepthProfiles.find((item) => item.experimentId === experiment.id);
  const accuracy = experimentAccuracyProfiles.find((item) => item.experimentId === experiment.id);
  const classroomScore = quality?.dimensions.classroom ?? 55;
  const learningScore = learning?.readinessScore ?? quality?.dimensions.learning ?? 55;
  const accuracyScore = accuracy?.modelGrade ?? quality?.dimensions.accuracy ?? 55;
  const visualDepthScore = depth?.depthScore ?? quality?.dimensions.visuals ?? 55;
  const evidenceRequirements = evidenceFor(experiment, visualDepthScore);
  const deploymentScore = clamp(Math.round(classroomScore * 0.28 + learningScore * 0.28 + accuracyScore * 0.2 + visualDepthScore * 0.14 + evidenceRequirements.length * 1.6));
  const tier = tierFor(deploymentScore, classroomScore, accuracyScore);
  return {
    experimentId: experiment.id,
    title: experiment.title,
    category: experiment.category,
    classLevel: experiment.classLevel,
    deploymentScore,
    classroomScore,
    learningScore,
    accuracyScore,
    visualDepthScore,
    tier,
    evidenceRequirements,
    assignmentDefaults: {
      lockVariables: tier !== "Ready to assign" || experiment.difficulty === "Beginner",
      requireNotebook: true,
      requireQuiz: learningScore >= 60,
      suggestedMinutes: suggestedMinutes(experiment, tier),
    },
    teacherSetup: teacherSetupFor(experiment),
    studentSubmission: studentSubmissionFor(experiment, evidenceRequirements),
    reviewRubric: reviewRubricFor(experiment, evidenceRequirements),
    rolloutRisk: rolloutRiskFor(tier, accuracyScore, visualDepthScore),
    nextDeploymentAction: nextActionFor(tier, experiment, classroomScore, accuracyScore, visualDepthScore),
  };
}

function evidenceFor(experiment: ExperimentDefinition, visualDepthScore: number) {
  const evidence: EvidenceRequirement[] = ["Prediction", "Controlled trials", "Observation table", "Conclusion"];
  if (visualDepthScore >= 65 || experiment.observationColumns.some((item) => /graph|distance|time|voltage|current|pressure|temperature|angle/i.test(item))) evidence.push("Graph or screenshot");
  if (experiment.vivaQuestions.length > 0) evidence.push("Quiz check");
  if (experiment.expectedResult.length > 40) evidence.push("Transfer answer");
  return [...new Set(evidence)];
}

function tierFor(score: number, classroomScore: number, accuracyScore: number): ClassroomDeploymentTier {
  if (score >= 82 && classroomScore >= 76 && accuracyScore >= 70) return "Ready to assign";
  if (score >= 70 && accuracyScore >= 62) return "Guided teacher review";
  if (score >= 58) return "Needs classroom pass";
  return "Do not assign yet";
}

function suggestedMinutes(experiment: ExperimentDefinition, tier: ClassroomDeploymentTier) {
  const base = experiment.difficulty === "Advanced" ? 45 : experiment.difficulty === "Intermediate" ? 35 : 25;
  return tier === "Ready to assign" ? base : base + 10;
}

function teacherSetupFor(experiment: ExperimentDefinition) {
  const apparatus = experiment.apparatus.slice(0, 3).join(", ") || "core apparatus";
  return `Start with ${apparatus}. Ask students to write the prediction before opening the simulation controls.`;
}

function studentSubmissionFor(experiment: ExperimentDefinition, evidence: EvidenceRequirement[]) {
  const columns = experiment.observationColumns.slice(0, 4).join(", ");
  return `Submit ${evidence.join(", ").toLowerCase()} for ${columns || experiment.title}.`;
}

function reviewRubricFor(experiment: ExperimentDefinition, evidence: EvidenceRequirement[]) {
  const rubric = [
    "Prediction is specific and testable.",
    "Only one variable changes per trial.",
    "Measurements include units.",
    "Conclusion answers the aim.",
  ];
  if (evidence.includes("Graph or screenshot")) rubric.push("Graph/screenshot is labeled and connected to the conclusion.");
  if (evidence.includes("Quiz check")) rubric.push("Quiz correction explains at least one wrong option.");
  if (experiment.commonMistakes.length) rubric.push(`Misconception repaired: ${experiment.commonMistakes[0]}`);
  return rubric.slice(0, 7);
}

function rolloutRiskFor(tier: ClassroomDeploymentTier, accuracyScore: number, visualDepthScore: number) {
  if (tier === "Do not assign yet") return "Use only as a teacher preview until classroom blockers are removed.";
  if (accuracyScore < 70) return "Numeric claims need teacher framing and stated model limits.";
  if (visualDepthScore < 65) return "Students may need extra board explanation before independent exploration.";
  if (tier === "Guided teacher review") return "Assign with teacher checkpoints and locked variables.";
  return "Low rollout risk for ordinary guided classroom use.";
}

function nextActionFor(tier: ClassroomDeploymentTier, experiment: ExperimentDefinition, classroomScore: number, accuracyScore: number, visualDepthScore: number) {
  if (tier === "Do not assign yet") return "Create a teacher-reviewed starter snapshot before assigning.";
  if (accuracyScore < 70) return "Add a source-backed benchmark or mark numeric outputs as qualitative.";
  if (visualDepthScore < 70) return "Add probe, graph, or screenshot evidence to the assignment.";
  if (classroomScore < 76) return "Add due-date, notebook, quiz, and lock-variable defaults.";
  if (!experiment.curriculumTags) return "Map this activity to class, unit, and topic before rollout.";
  return "Ready for class pack export and evidence review.";
}

function makeDeploymentStats(profiles: ClassroomDeploymentProfile[]): ClassroomDeploymentStats {
  return {
    profiles: profiles.length,
    averageDeployment: Math.round(profiles.reduce((sum, item) => sum + item.deploymentScore, 0) / Math.max(1, profiles.length)),
    readyToAssign: profiles.filter((item) => item.tier === "Ready to assign").length,
    reviewRequired: profiles.filter((item) => item.tier === "Guided teacher review").length,
    needsPass: profiles.filter((item) => item.tier === "Needs classroom pass").length,
    blocked: profiles.filter((item) => item.tier === "Do not assign yet").length,
    evidenceItems: allEvidence.length,
  };
}

function makeDeploymentGaps(profiles: ClassroomDeploymentProfile[]) {
  return allEvidence.map((requirement) => ({
    requirement,
    ready: profiles.filter((profile) => profile.evidenceRequirements.includes(requirement)).length,
    missing: profiles.filter((profile) => !profile.evidenceRequirements.includes(requirement)).length,
  })).sort((left, right) => right.missing - left.missing);
}

function makeClassroomPackPlans(profiles: ClassroomDeploymentProfile[]) {
  return Object.entries(
    profiles.reduce<Record<string, ClassroomDeploymentProfile[]>>((groups, profile) => {
      groups[profile.category] = [...(groups[profile.category] ?? []), profile];
      return groups;
    }, {}),
  )
    .map(([category, items]) => ({
      category,
      count: items.length,
      averageDeployment: Math.round(items.reduce((sum, item) => sum + item.deploymentScore, 0) / items.length),
      ready: items.filter((item) => item.tier === "Ready to assign").length,
      review: items.filter((item) => item.tier === "Guided teacher review").length,
      focus: packFocusFor(category),
      starters: [...items].sort((left, right) => right.deploymentScore - left.deploymentScore).slice(0, 3),
    }))
    .sort((left, right) => right.averageDeployment - left.averageDeployment || left.category.localeCompare(right.category));
}

function packFocusFor(category: string) {
  if (category.includes("Optics")) return "Ray diagrams, screenshots, and angle evidence.";
  if (category.includes("Electric")) return "Circuit snapshots, meter readings, and quiz checks.";
  if (category.includes("Magnet")) return "Field direction predictions and induction evidence.";
  if (category.includes("Wave")) return "Graph/screenshot evidence tied to frequency and wavelength.";
  if (category.includes("Thermo")) return "Temperature tables and equilibrium conclusions.";
  if (category.includes("Fluid")) return "Pressure/depth tables with unit checks.";
  if (category.includes("Modern")) return "Model-limit language and source-backed explanations.";
  return "Prediction, controlled trials, notebook, and transfer answer.";
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
