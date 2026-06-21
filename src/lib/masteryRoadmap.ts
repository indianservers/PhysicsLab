import { curriculum, allCurriculumTopics } from "./curriculum";
import { experiments } from "./experiments";
import { simulationQualityScores } from "./simulationQuality";
import { experimentAccuracyProfiles } from "./accuracyValidation";
import { learningStudioProfiles } from "./learningStudio";
import { classroomDeploymentProfiles } from "./classroomDeployment";
import { accessibilityProfiles } from "./accessibilityAudit";

export type MasteryTier = "Mastery ready" | "Guided practice" | "Needs support" | "Build prerequisite";
export type RoadmapPriority = "Accuracy confidence" | "Visual exploration" | "Practice evidence" | "Misconception repair" | "Prerequisite bridge";

export interface MasteryRoadmapProfile {
  topicId: string;
  title: string;
  classId: string;
  classLabel: string;
  grade: number;
  unitId: string;
  unitTitle: string;
  domain: string;
  stage: string;
  outcomes: string[];
  tools: string[];
  experimentIds: string[];
  labTitles: string[];
  readinessScore: number;
  conceptScore: number;
  simulationScore: number;
  validationScore: number;
  evidenceScore: number;
  accessibilityScore: number;
  tier: MasteryTier;
  priority: RoadmapPriority;
  masteryEvidence: string[];
  nextActions: string[];
  practicePrompts: string[];
  blockers: string[];
}

export interface MasteryRoadmapStats {
  classes: number;
  topics: number;
  labMappedTopics: number;
  masteryReady: number;
  guidedPractice: number;
  needsSupport: number;
  prerequisiteBuild: number;
  averageReadiness: number;
  domains: number;
}

export const masteryRoadmapProfiles: MasteryRoadmapProfile[] = allCurriculumTopics()
  .map(makeMasteryProfile)
  .sort((left, right) => left.grade - right.grade || left.unitTitle.localeCompare(right.unitTitle) || left.title.localeCompare(right.title));

export const masteryRoadmapStats = makeStats(masteryRoadmapProfiles);
export const masteryDomainSummaries = makeDomainSummaries(masteryRoadmapProfiles);
export const masteryClassSummaries = makeClassSummaries(masteryRoadmapProfiles);

function makeMasteryProfile(topic: ReturnType<typeof allCurriculumTopics>[number]): MasteryRoadmapProfile {
  const topicExperiments = topic.experimentIds
    .map((id) => experiments.find((experiment) => experiment.id === id))
    .filter(isDefined);
  const labIds = topicExperiments.map((experiment) => experiment.id);
  const qualityScores = labIds.map((id) => simulationQualityScores.find((item) => item.id === id)).filter(isDefined);
  const accuracyScores = labIds.map((id) => experimentAccuracyProfiles.find((item) => item.experimentId === id)).filter(isDefined);
  const learningScores = labIds.map((id) => learningStudioProfiles.find((item) => item.experimentId === id)).filter(isDefined);
  const deploymentScores = labIds.map((id) => classroomDeploymentProfiles.find((item) => item.experimentId === id)).filter(isDefined);
  const accessScores = labIds.map((id) => accessibilityProfiles.find((item) => item.experimentId === id)).filter(isDefined);

  const conceptScore = clamp(58 + topic.outcomes.length * 8 + topic.tools.length * 4 + (topic.stage !== "concept" ? 8 : 0));
  const simulationScore = labIds.length ? average(qualityScores.map((item) => item.overall)) : 35;
  const validationScore = labIds.length ? average(accuracyScores.map((item) => item.modelGrade)) : 30;
  const evidenceScore = clamp(Math.round(average(learningScores.map((item) => item.readinessScore)) * 0.55 + average(deploymentScores.map((item) => item.deploymentScore)) * 0.45) || scoreEvidenceFallback(topic));
  const accessibilityScore = labIds.length ? average(accessScores.map((item) => item.accessibilityScore)) : 46;
  const readinessScore = clamp(Math.round(conceptScore * 0.22 + simulationScore * 0.24 + validationScore * 0.2 + evidenceScore * 0.22 + accessibilityScore * 0.12));
  const blockers = blockersFor(topic, labIds.length, validationScore, simulationScore, evidenceScore, accessibilityScore);

  return {
    topicId: topic.id,
    title: topic.title,
    classId: topic.classId,
    classLabel: topic.classLabel,
    grade: topic.grade,
    unitId: topic.unitId,
    unitTitle: topic.unitTitle,
    domain: topic.domain,
    stage: topic.stage,
    outcomes: topic.outcomes,
    tools: topic.tools,
    experimentIds: labIds,
    labTitles: topicExperiments.map((experiment) => experiment.title),
    readinessScore,
    conceptScore,
    simulationScore,
    validationScore,
    evidenceScore,
    accessibilityScore,
    tier: tierFor(readinessScore, blockers.length),
    priority: priorityFor(labIds.length, validationScore, simulationScore, evidenceScore, accessibilityScore, topic.outcomes.length),
    masteryEvidence: masteryEvidenceFor(topic, labIds.length),
    nextActions: nextActionsFor(topic, labIds.length, validationScore, simulationScore, evidenceScore, accessibilityScore),
    practicePrompts: practicePromptsFor(topic),
    blockers,
  };
}

function tierFor(score: number, blockers: number): MasteryTier {
  if (score >= 82 && blockers <= 1) return "Mastery ready";
  if (score >= 70 && blockers <= 2) return "Guided practice";
  if (score >= 58) return "Needs support";
  return "Build prerequisite";
}

function priorityFor(labCount: number, validation: number, simulation: number, evidence: number, accessibility: number, outcomeCount: number): RoadmapPriority {
  if (labCount === 0 || outcomeCount < 1) return "Prerequisite bridge";
  if (validation < 65) return "Accuracy confidence";
  if (simulation < 70) return "Visual exploration";
  if (evidence < 70) return "Practice evidence";
  if (accessibility < 68) return "Misconception repair";
  return "Practice evidence";
}

function blockersFor(topic: ReturnType<typeof allCurriculumTopics>[number], labCount: number, validation: number, simulation: number, evidence: number, accessibility: number) {
  const blockers: string[] = [];
  if (labCount === 0) blockers.push("No interactive lab is mapped yet.");
  if (validation < 65) blockers.push("Validation evidence is weak for mastery claims.");
  if (simulation < 65) blockers.push("Simulation depth is not yet strong enough for independent discovery.");
  if (evidence < 65) blockers.push("Practice evidence needs clearer student outputs.");
  if (accessibility < 62) blockers.push("Inclusive access needs keyboard, contrast, or text-state reinforcement.");
  if (topic.outcomes.length < 2) blockers.push("Learning outcomes need a second measurable target.");
  return blockers.slice(0, 5);
}

function nextActionsFor(topic: ReturnType<typeof allCurriculumTopics>[number], labCount: number, validation: number, simulation: number, evidence: number, accessibility: number) {
  const actions: string[] = [];
  if (labCount === 0) actions.push("Map at least one experiment or create a guided concept-only activity.");
  if (validation < 70) actions.push("Attach formula, units, assumptions, and one benchmark example.");
  if (simulation < 70) actions.push("Add a visible 2D/3D change, graph, or measurement probe.");
  if (evidence < 70) actions.push("Require prediction, observation table, conclusion, and transfer answer.");
  if (accessibility < 70) actions.push("Add non-color cues, readable text state, and keyboard-friendly controls.");
  if (!actions.length) actions.push("Promote to mastery path and add a stretch problem.");
  return actions.slice(0, 5);
}

function masteryEvidenceFor(topic: ReturnType<typeof allCurriculumTopics>[number], labCount: number) {
  const evidence = [
    "Student writes a prediction before opening controls.",
    "Student changes one variable and records units.",
    `Student explains: ${topic.outcomes[0] ?? `the core idea of ${topic.title}`}`,
    "Student solves a changed case without copying the first setup.",
  ];
  if (labCount > 0) evidence.splice(2, 0, "Student submits a graph, screenshot, or measured table from the lab.");
  return evidence.slice(0, 5);
}

function practicePromptsFor(topic: ReturnType<typeof allCurriculumTopics>[number]) {
  const tool = topic.tools[0] ?? "simulation";
  return [
    `Before using ${tool}, predict what will increase, decrease, or stay constant.`,
    `Explain ${topic.title.toLowerCase()} using one diagram, one sentence, and one unit.`,
    `Create a changed example from daily life and defend the physics rule you used.`,
  ];
}

function scoreEvidenceFallback(topic: ReturnType<typeof allCurriculumTopics>[number]) {
  return clamp(42 + topic.outcomes.length * 8 + topic.tools.length * 5 + topic.experimentIds.length * 8);
}

function makeStats(profiles: MasteryRoadmapProfile[]): MasteryRoadmapStats {
  return {
    classes: curriculum.length,
    topics: profiles.length,
    labMappedTopics: profiles.filter((item) => item.experimentIds.length > 0).length,
    masteryReady: profiles.filter((item) => item.tier === "Mastery ready").length,
    guidedPractice: profiles.filter((item) => item.tier === "Guided practice").length,
    needsSupport: profiles.filter((item) => item.tier === "Needs support").length,
    prerequisiteBuild: profiles.filter((item) => item.tier === "Build prerequisite").length,
    averageReadiness: average(profiles.map((item) => item.readinessScore)),
    domains: new Set(profiles.map((item) => item.domain)).size,
  };
}

function makeDomainSummaries(profiles: MasteryRoadmapProfile[]) {
  return Array.from(new Set(profiles.map((item) => item.domain))).map((domain) => {
    const domainProfiles = profiles.filter((item) => item.domain === domain);
    return {
      domain,
      topics: domainProfiles.length,
      labs: domainProfiles.filter((item) => item.experimentIds.length > 0).length,
      averageReadiness: average(domainProfiles.map((item) => item.readinessScore)),
      weakestTopic: [...domainProfiles].sort((left, right) => left.readinessScore - right.readinessScore)[0]?.title ?? domain,
    };
  }).sort((left, right) => left.averageReadiness - right.averageReadiness);
}

function makeClassSummaries(profiles: MasteryRoadmapProfile[]) {
  return curriculum.map((schoolClass) => {
    const classProfiles = profiles.filter((item) => item.classId === schoolClass.id);
    return {
      classId: schoolClass.id,
      classLabel: schoolClass.label,
      topics: classProfiles.length,
      labs: classProfiles.filter((item) => item.experimentIds.length > 0).length,
      averageReadiness: average(classProfiles.map((item) => item.readinessScore)),
      masteryReady: classProfiles.filter((item) => item.tier === "Mastery ready").length,
    };
  });
}

function average(values: number[]) {
  const finite = values.filter((value) => Number.isFinite(value));
  if (!finite.length) return 0;
  return Math.round(finite.reduce((sum, value) => sum + value, 0) / finite.length);
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}
