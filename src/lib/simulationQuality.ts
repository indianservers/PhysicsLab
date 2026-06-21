import { experiments } from "./experiments";
import { ExperimentDefinition } from "../types";

type QualityDimension = "accuracy" | "visuals" | "interaction" | "learning" | "classroom" | "accessibility";
type RiskLevel = "Low" | "Medium" | "High" | "Critical";
type ReadinessTier = "Flagship candidate" | "Classroom ready" | "Needs upgrade" | "Critical rebuild";

export interface SimulationQualityScore {
  id: string;
  title: string;
  category: string;
  classLevel: string;
  difficulty: string;
  modelClass: string;
  evidenceType: string;
  maturityLevel: string;
  trustLevel: number;
  dimensions: Record<QualityDimension, number>;
  overall: number;
  riskLevel: RiskLevel;
  readinessTier: ReadinessTier;
  priority: number;
  strengths: string[];
  risks: string[];
  nextActions: string[];
}

export interface QualityGap {
  id: string;
  label: string;
  count: number;
  severity: RiskLevel;
  action: string;
}

const flagshipVisualIds = new Set([
  "projectile-motion",
  "distance-time-graph",
  "universal-gravitation",
  "calorimetry-mixing",
  "emi-faraday",
  "ac-generator",
  "transformer-lab",
  "lens-formula",
  "prism-dispersion",
  "young-double-slit",
  "photoelectric-equation",
  "bohr-model",
  "shadows-eclipses",
]);

const coreCategories = new Set([
  "Mechanics",
  "Optics",
  "Electricity",
  "Magnetism",
  "Thermodynamics",
  "Waves",
  "Fluid Mechanics",
  "Modern Physics",
]);

export const qualityWeights: Record<QualityDimension, number> = {
  accuracy: 0.3,
  visuals: 0.2,
  interaction: 0.15,
  learning: 0.15,
  classroom: 0.1,
  accessibility: 0.1,
};

export const simulationQualityScores: SimulationQualityScore[] = experiments
  .map(scoreExperiment)
  .sort((left, right) => right.priority - left.priority || left.overall - right.overall);

export const qualityAuditStats = makeAuditStats(simulationQualityScores);
export const qualityTopPriorities = simulationQualityScores.slice(0, 25);
export const qualityGaps = makeQualityGaps(simulationQualityScores);

function scoreExperiment(experiment: ExperimentDefinition): SimulationQualityScore {
  const dimensions = {
    accuracy: scoreAccuracy(experiment),
    visuals: scoreVisuals(experiment),
    interaction: scoreInteraction(experiment),
    learning: scoreLearning(experiment),
    classroom: scoreClassroom(experiment),
    accessibility: scoreAccessibility(experiment),
  };
  const overall = Math.round(
    Object.entries(dimensions).reduce(
      (sum, [dimension, score]) => sum + score * qualityWeights[dimension as QualityDimension],
      0,
    ),
  );
  const risks = risksFor(experiment, dimensions, overall);
  const riskLevel = riskLevelFor(risks, overall);
  const priority = priorityFor(experiment, overall, risks);
  return {
    id: experiment.id,
    title: experiment.title,
    category: experiment.category,
    classLevel: experiment.classLevel,
    difficulty: experiment.difficulty,
    modelClass: experiment.modelClass ?? "Concept",
    evidenceType: experiment.evidenceType ?? "Educational Approximation",
    maturityLevel: experiment.maturityLevel ?? "Starter",
    trustLevel: experiment.trustLevel ?? 55,
    dimensions,
    overall,
    riskLevel,
    readinessTier: readinessTierFor(overall, riskLevel),
    priority,
    strengths: strengthsFor(experiment, dimensions),
    risks,
    nextActions: nextActionsFor(experiment, dimensions, risks),
  };
}

function scoreAccuracy(experiment: ExperimentDefinition) {
  let score = experiment.trustLevel ?? 55;
  if (experiment.evidenceType === "Exact Formula") score += 10;
  if (experiment.evidenceType === "Visual Model") score -= 8;
  if (experiment.evidenceType === "Sandbox Only") score -= 16;
  if (experiment.modelClass === "Validated Simulation") score += 10;
  if (experiment.modelClass === "Research Prototype") score += 6;
  if (experiment.formulae.length > 0) score += 6;
  if (experiment.assumptions?.length) score += 5;
  if (experiment.validRanges?.length) score += 4;
  if (experiment.failureConditions?.length) score += 4;
  if (experiment.sourceRefs?.length) score += 3;
  return clampScore(score);
}

function scoreVisuals(experiment: ExperimentDefinition) {
  let score = 48;
  if (flagshipVisualIds.has(experiment.id)) score += 24;
  if (experiment.simulationSetup.objects.length >= 3) score += 8;
  if (experiment.apparatus.length >= 3) score += 5;
  if (experiment.modelClass === "Visualization" || experiment.modelClass === "Dynamic Simulation") score += 7;
  if (experiment.maturityLevel === "Flagship") score += 10;
  if (experiment.category === "Optics" || experiment.category === "Waves" || experiment.category === "Electricity") score += 4;
  return clampScore(score);
}

function scoreInteraction(experiment: ExperimentDefinition) {
  let score = 44;
  if (experiment.procedure.length >= 4) score += 10;
  if (experiment.observationColumns.length >= 4) score += 10;
  if (experiment.simulationSetup.objects.length >= 3) score += 8;
  if (experiment.vivaQuestions.length >= 1) score += 4;
  if (experiment.commonMistakes.length >= 2) score += 4;
  if (experiment.difficulty !== "Beginner") score += 3;
  if (flagshipVisualIds.has(experiment.id)) score += 8;
  return clampScore(score);
}

function scoreLearning(experiment: ExperimentDefinition) {
  let score = 42;
  if (experiment.aim.length > 50) score += 6;
  if (experiment.theory.length > 50) score += 6;
  if (experiment.expectedResult.length > 40) score += 6;
  if (experiment.formulae.length > 0) score += 8;
  if (experiment.vivaQuestions.length >= 1) score += 6;
  if (experiment.commonMistakes.length >= 2) score += 8;
  if (experiment.curriculumTags) score += 7;
  if (experiment.assumptions?.length) score += 4;
  return clampScore(score);
}

function scoreClassroom(experiment: ExperimentDefinition) {
  let score = 40;
  if (experiment.curriculumTags?.classes.length) score += 12;
  if (experiment.curriculumTags?.unitIds.length) score += 8;
  if (experiment.observationColumns.length >= 4) score += 8;
  if (experiment.procedure.length >= 4) score += 8;
  if (experiment.maturityLevel === "Classroom Ready" || experiment.maturityLevel === "Flagship") score += 12;
  if (experiment.classLevel.toLowerCase().includes("class")) score += 4;
  return clampScore(score);
}

function scoreAccessibility(experiment: ExperimentDefinition) {
  let score = 54;
  if (experiment.observationColumns.length >= 4) score += 6;
  if (experiment.formulae.length > 0) score += 5;
  if (experiment.commonMistakes.length > 0) score += 5;
  if (experiment.apparatus.length >= 3) score += 4;
  if (experiment.validRanges?.length) score += 4;
  if (experiment.category === "Optics" || experiment.category === "Waves") score -= 4;
  if (flagshipVisualIds.has(experiment.id)) score += 4;
  return clampScore(score);
}

function risksFor(experiment: ExperimentDefinition, dimensions: Record<QualityDimension, number>, overall: number) {
  const risks: string[] = [];
  if (dimensions.accuracy < 70) risks.push("Accuracy needs validation against known examples or textbook benchmarks.");
  if (dimensions.visuals < 70) risks.push("Visual depth is below flagship standard.");
  if (dimensions.interaction < 65) risks.push("Interaction depth is too slider-only or observation-light.");
  if (dimensions.learning < 70) risks.push("Learning scaffolding needs stronger misconceptions, prompts, or formula links.");
  if (dimensions.classroom < 70) risks.push("Classroom workflow is not yet teacher-ready.");
  if (dimensions.accessibility < 65) risks.push("Accessibility support needs keyboard, narration, or non-color cues.");
  if (experiment.evidenceType === "Sandbox Only") risks.push("Sandbox-only evidence must be separated from validated numeric claims.");
  if (!experiment.formulae.length) risks.push("No explicit formula is attached to this experiment.");
  if (!experiment.sourceRefs?.length) risks.push("No source reference is attached yet.");
  if (overall < 60) risks.push("Overall score is below acceptable Phase 1 baseline.");
  return [...new Set(risks)];
}

function strengthsFor(experiment: ExperimentDefinition, dimensions: Record<QualityDimension, number>) {
  const strengths: string[] = [];
  if (dimensions.accuracy >= 80) strengths.push("Strong accuracy metadata and model trust.");
  if (dimensions.visuals >= 80) strengths.push("Strong visual candidate for flagship treatment.");
  if (dimensions.learning >= 80) strengths.push("Good explanatory and learning support.");
  if (dimensions.classroom >= 80) strengths.push("Good classroom-readiness foundation.");
  if (experiment.curriculumTags) strengths.push("Mapped to syllabus and class flow.");
  if (experiment.formulae.length > 0) strengths.push("Has formula support.");
  return strengths.length ? strengths.slice(0, 4) : ["Useful concept seed, but needs Phase 2-4 strengthening."];
}

function nextActionsFor(experiment: ExperimentDefinition, dimensions: Record<QualityDimension, number>, risks: string[]) {
  const actions: string[] = [];
  if (dimensions.accuracy < 75) actions.push("Add numeric validation cases, tolerances, and source-backed assumptions.");
  if (dimensions.visuals < 75) actions.push("Upgrade to the 2D/3D visual pane pattern with vectors, labels, and measurement overlays.");
  if (dimensions.interaction < 70) actions.push("Add drag/probe/compare or replay interaction beyond sliders.");
  if (dimensions.learning < 75) actions.push("Add Predict, Explore, Measure, Explain, Apply prompts.");
  if (dimensions.classroom < 75) actions.push("Add teacher workflow: locked variables, worksheet prompts, and answer checks.");
  if (dimensions.accessibility < 70) actions.push("Add keyboard controls, text state descriptions, and non-color cues.");
  if (!experiment.formulae.length) actions.push("Attach the core formula or mark the visual as qualitative only.");
  if (!experiment.sourceRefs?.length) actions.push("Attach at least one trusted source/reference note.");
  if (!actions.length && risks.length) actions.push("Run manual expert review and classroom usability test.");
  return actions.slice(0, 5);
}

function riskLevelFor(risks: string[], overall: number): RiskLevel {
  if (overall < 55 || risks.length >= 7) return "Critical";
  if (overall < 68 || risks.length >= 5) return "High";
  if (overall < 78 || risks.length >= 3) return "Medium";
  return "Low";
}

function readinessTierFor(overall: number, riskLevel: RiskLevel): ReadinessTier {
  if (overall >= 86 && (riskLevel === "Low" || riskLevel === "Medium")) return "Flagship candidate";
  if (overall >= 76 && riskLevel !== "Critical") return "Classroom ready";
  if (overall >= 60) return "Needs upgrade";
  return "Critical rebuild";
}

function priorityFor(experiment: ExperimentDefinition, overall: number, risks: string[]) {
  let priority = 100 - overall;
  if (coreCategories.has(experiment.category)) priority += 10;
  if (experiment.curriculumTags?.classes.some((grade) => grade >= 8 && grade <= 12)) priority += 8;
  if (flagshipVisualIds.has(experiment.id)) priority += 8;
  if (risks.some((risk) => risk.includes("Accuracy"))) priority += 10;
  if (risks.some((risk) => risk.includes("Visual"))) priority += 6;
  return Math.max(0, Math.min(100, Math.round(priority)));
}

function makeAuditStats(scores: SimulationQualityScore[]) {
  const average = (dimension?: QualityDimension) =>
    Math.round(scores.reduce((sum, item) => sum + (dimension ? item.dimensions[dimension] : item.overall), 0) / Math.max(1, scores.length));
  return {
    total: scores.length,
    overall: average(),
    accuracy: average("accuracy"),
    visuals: average("visuals"),
    interaction: average("interaction"),
    learning: average("learning"),
    classroom: average("classroom"),
    accessibility: average("accessibility"),
    flagshipCandidates: scores.filter((item) => item.readinessTier === "Flagship candidate").length,
    highRisk: scores.filter((item) => item.riskLevel === "High" || item.riskLevel === "Critical").length,
    critical: scores.filter((item) => item.riskLevel === "Critical").length,
  };
}

function makeQualityGaps(scores: SimulationQualityScore[]): QualityGap[] {
  return [
    gap("accuracy-validation", "Accuracy validation gaps", "High", scores.filter((item) => item.dimensions.accuracy < 70).length, "Add textbook benchmark cases and unit tests."),
    gap("visual-depth", "Visual depth below flagship", "High", scores.filter((item) => item.dimensions.visuals < 70).length, "Upgrade visuals with separated 2D/3D panes, overlays, and labels."),
    gap("interaction-depth", "Interaction depth gaps", "Medium", scores.filter((item) => item.dimensions.interaction < 65).length, "Add probes, drag interactions, replay, and compare tools."),
    gap("learning-flow", "Learning scaffold gaps", "Medium", scores.filter((item) => item.dimensions.learning < 70).length, "Add Predict, Explore, Measure, Explain, Apply flow."),
    gap("teacher-readiness", "Teacher workflow gaps", "Medium", scores.filter((item) => item.dimensions.classroom < 70).length, "Add worksheet prompts, locked setups, and classroom summaries."),
    gap("accessibility", "Accessibility gaps", "High", scores.filter((item) => item.dimensions.accessibility < 65).length, "Add keyboard, narration, contrast, and non-color encodings."),
  ].sort((left, right) => right.count - left.count);
}

function gap(id: string, label: string, severity: RiskLevel, count: number, action: string): QualityGap {
  return { id, label, severity, count, action };
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}
