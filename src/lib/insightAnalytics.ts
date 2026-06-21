import { allCurriculumTopics } from "./curriculum";
import { experiments } from "./experiments";
import { simulationQualityScores } from "./simulationQuality";
import { experimentAccuracyProfiles } from "./accuracyValidation";
import { learningStudioProfiles } from "./learningStudio";
import { simulationDepthProfiles } from "./simulationDepth";
import { classroomDeploymentProfiles } from "./classroomDeployment";
import { accessibilityProfiles } from "./accessibilityAudit";
import { masteryRoadmapProfiles } from "./masteryRoadmap";
import type { ExperimentDefinition } from "../types";

export type InterventionUrgency = "Immediate intervention" | "Teacher guided" | "Monitor" | "Scale ready";
export type InterventionFocus = "Accuracy" | "Learning" | "Visual depth" | "Classroom rollout" | "Accessibility" | "Curriculum mastery";

export interface InsightProfile {
  experimentId: string;
  title: string;
  category: string;
  classLevel: string;
  difficulty: string;
  overallReadiness: number;
  interventionScore: number;
  urgency: InterventionUrgency;
  focus: InterventionFocus;
  qualityScore: number;
  accuracyScore: number;
  learningScore: number;
  depthScore: number;
  deploymentScore: number;
  accessibilityScore: number;
  masteryScore: number;
  affectedTopics: string[];
  evidenceSignals: string[];
  interventionPlan: string[];
  teacherMove: string;
  studentMove: string;
}

export interface InsightStats {
  profiles: number;
  averageReadiness: number;
  immediate: number;
  guided: number;
  monitor: number;
  scaleReady: number;
  categories: number;
  focusAreas: number;
}

export const insightProfiles: InsightProfile[] = experiments
  .map(makeInsightProfile)
  .sort((left, right) => right.interventionScore - left.interventionScore || left.overallReadiness - right.overallReadiness);

export const insightStats = makeInsightStats(insightProfiles);
export const insightCategorySummaries = makeCategorySummaries(insightProfiles);
export const insightFocusSummaries = makeFocusSummaries(insightProfiles);

function makeInsightProfile(experiment: ExperimentDefinition): InsightProfile {
  const quality = simulationQualityScores.find((item) => item.id === experiment.id);
  const accuracy = experimentAccuracyProfiles.find((item) => item.experimentId === experiment.id);
  const learning = learningStudioProfiles.find((item) => item.experimentId === experiment.id);
  const depth = simulationDepthProfiles.find((item) => item.experimentId === experiment.id);
  const deployment = classroomDeploymentProfiles.find((item) => item.experimentId === experiment.id);
  const access = accessibilityProfiles.find((item) => item.experimentId === experiment.id);
  const masteryTopics = masteryRoadmapProfiles.filter((profile) => profile.experimentIds.includes(experiment.id));

  const qualityScore = quality?.overall ?? 55;
  const accuracyScore = accuracy?.modelGrade ?? quality?.dimensions.accuracy ?? 55;
  const learningScore = learning?.readinessScore ?? quality?.dimensions.learning ?? 55;
  const depthScore = depth?.depthScore ?? quality?.dimensions.visuals ?? 55;
  const deploymentScore = deployment?.deploymentScore ?? quality?.dimensions.classroom ?? 55;
  const accessibilityScore = access?.accessibilityScore ?? quality?.dimensions.accessibility ?? 55;
  const masteryScore = average(masteryTopics.map((topic) => topic.readinessScore)) || topicFallbackScore(experiment);
  const overallReadiness = clamp(Math.round(
    accuracyScore * 0.18 +
    learningScore * 0.18 +
    depthScore * 0.16 +
    deploymentScore * 0.16 +
    accessibilityScore * 0.14 +
    masteryScore * 0.18,
  ));
  const focus = focusFor({ accuracyScore, learningScore, depthScore, deploymentScore, accessibilityScore, masteryScore });
  const interventionScore = clamp(Math.round(100 - overallReadiness + riskBoost(experiment, focus, qualityScore)));

  return {
    experimentId: experiment.id,
    title: experiment.title,
    category: experiment.category,
    classLevel: experiment.classLevel,
    difficulty: experiment.difficulty,
    overallReadiness,
    interventionScore,
    urgency: urgencyFor(interventionScore, overallReadiness),
    focus,
    qualityScore,
    accuracyScore,
    learningScore,
    depthScore,
    deploymentScore,
    accessibilityScore,
    masteryScore,
    affectedTopics: affectedTopicsFor(experiment, masteryTopics),
    evidenceSignals: evidenceSignalsFor(experiment, accuracy, learning, depth, deployment, access),
    interventionPlan: interventionPlanFor(experiment, focus, { accuracyScore, learningScore, depthScore, deploymentScore, accessibilityScore, masteryScore }),
    teacherMove: teacherMoveFor(experiment, focus),
    studentMove: studentMoveFor(experiment, focus),
  };
}

function focusFor(scores: Record<"accuracyScore" | "learningScore" | "depthScore" | "deploymentScore" | "accessibilityScore" | "masteryScore", number>): InterventionFocus {
  const rows: Array<[InterventionFocus, number]> = [
    ["Accuracy", scores.accuracyScore],
    ["Learning", scores.learningScore],
    ["Visual depth", scores.depthScore],
    ["Classroom rollout", scores.deploymentScore],
    ["Accessibility", scores.accessibilityScore],
    ["Curriculum mastery", scores.masteryScore],
  ];
  return rows.sort((left, right) => left[1] - right[1])[0]?.[0] ?? "Learning";
}

function urgencyFor(interventionScore: number, readiness: number): InterventionUrgency {
  if (interventionScore >= 42 || readiness < 62) return "Immediate intervention";
  if (interventionScore >= 28 || readiness < 74) return "Teacher guided";
  if (interventionScore >= 16 || readiness < 84) return "Monitor";
  return "Scale ready";
}

function riskBoost(experiment: ExperimentDefinition, focus: InterventionFocus, qualityScore: number) {
  let boost = qualityScore < 60 ? 8 : 0;
  if (!experiment.formulae.length) boost += 5;
  if (!experiment.sourceRefs?.length) boost += 4;
  if (experiment.evidenceType === "Sandbox Only") boost += 7;
  if (focus === "Accuracy" && experiment.evidenceType !== "Exact Formula") boost += 4;
  return boost;
}

function evidenceSignalsFor(
  experiment: ExperimentDefinition,
  accuracy: ReturnType<typeof experimentAccuracyProfiles.find>,
  learning: ReturnType<typeof learningStudioProfiles.find>,
  depth: ReturnType<typeof simulationDepthProfiles.find>,
  deployment: ReturnType<typeof classroomDeploymentProfiles.find>,
  access: ReturnType<typeof accessibilityProfiles.find>,
) {
  const signals = [
    `${accuracy?.validationCases ?? 0} numeric benchmark cases`,
    `${experiment.formulae.length} formulas attached`,
    `${experiment.commonMistakes.length} misconception checks`,
    `${experiment.observationColumns.length} observation columns`,
    deployment ? `${deployment.evidenceRequirements.length} assignment evidence items` : "No deployment evidence profile",
    access ? `${access.supportedNeeds.length} accessibility needs supported` : "No accessibility audit",
    depth ? depth.visualPromise : "No visual depth upgrade profile",
    learning ? learning.successEvidence : "No learning studio evidence",
  ];
  return signals.slice(0, 6);
}

function interventionPlanFor(
  experiment: ExperimentDefinition,
  focus: InterventionFocus,
  scores: Record<"accuracyScore" | "learningScore" | "depthScore" | "deploymentScore" | "accessibilityScore" | "masteryScore", number>,
) {
  const plan: string[] = [];
  if (focus === "Accuracy" || scores.accuracyScore < 72) plan.push("Add a benchmark example with expected output, tolerance, units, and valid range.");
  if (focus === "Learning" || scores.learningScore < 72) plan.push("Add predict, explain, misconception repair, and transfer prompts.");
  if (focus === "Visual depth" || scores.depthScore < 72) plan.push("Add a visible measured change, graph/probe, and before-after comparison.");
  if (focus === "Classroom rollout" || scores.deploymentScore < 72) plan.push("Create locked-variable assignment defaults and a rubric-ready evidence list.");
  if (focus === "Accessibility" || scores.accessibilityScore < 72) plan.push("Add keyboard route, non-color cues, readable text state, and reduced-motion behavior.");
  if (focus === "Curriculum mastery" || scores.masteryScore < 72) plan.push("Map the lab to prerequisite, practice, and mastery evidence in the student roadmap.");
  if (!experiment.sourceRefs?.length) plan.push("Attach source reference for formula or model assumptions.");
  return [...new Set(plan)].slice(0, 5);
}

function teacherMoveFor(experiment: ExperimentDefinition, focus: InterventionFocus) {
  if (focus === "Accuracy") return "State the model limits before students interpret numeric output.";
  if (focus === "Visual depth") return "Pause on the first visible change and ask students to name the measured variable.";
  if (focus === "Classroom rollout") return "Use a guided assignment with locked variables and checkpoint evidence.";
  if (focus === "Accessibility") return "Offer text-state and non-color cue alternatives before independent work.";
  if (focus === "Curriculum mastery") return "Bridge the prerequisite topic before opening the lab.";
  return `Ask students to repair one misconception about ${experiment.title.toLowerCase()} using evidence.`;
}

function studentMoveFor(experiment: ExperimentDefinition, focus: InterventionFocus) {
  if (focus === "Accuracy") return "Write formula, units, assumption, and one checked calculation.";
  if (focus === "Visual depth") return "Capture a screenshot or graph and label the cause-effect change.";
  if (focus === "Classroom rollout") return "Submit prediction, controlled trials, observation table, and conclusion.";
  if (focus === "Accessibility") return "Use keyboard-accessible controls and describe the result in words.";
  if (focus === "Curriculum mastery") return "Solve a prerequisite question before the lab challenge.";
  return "Explain the result, then transfer it to a changed situation.";
}

function affectedTopicsFor(experiment: ExperimentDefinition, masteryTopics: typeof masteryRoadmapProfiles) {
  const direct = masteryTopics.map((topic) => `${topic.classLabel}: ${topic.title}`);
  if (direct.length) return direct.slice(0, 5);
  return allCurriculumTopics()
    .filter((topic) => topic.domain === experiment.category || topic.experimentIds.includes(experiment.id))
    .map((topic) => `${topic.classLabel}: ${topic.title}`)
    .slice(0, 5);
}

function topicFallbackScore(experiment: ExperimentDefinition) {
  const linked = allCurriculumTopics().filter((topic) => topic.experimentIds.includes(experiment.id));
  return clamp(45 + linked.length * 8 + (experiment.curriculumTags ? 12 : 0));
}

function makeInsightStats(profiles: InsightProfile[]): InsightStats {
  return {
    profiles: profiles.length,
    averageReadiness: average(profiles.map((profile) => profile.overallReadiness)),
    immediate: profiles.filter((profile) => profile.urgency === "Immediate intervention").length,
    guided: profiles.filter((profile) => profile.urgency === "Teacher guided").length,
    monitor: profiles.filter((profile) => profile.urgency === "Monitor").length,
    scaleReady: profiles.filter((profile) => profile.urgency === "Scale ready").length,
    categories: new Set(profiles.map((profile) => profile.category)).size,
    focusAreas: new Set(profiles.map((profile) => profile.focus)).size,
  };
}

function makeCategorySummaries(profiles: InsightProfile[]) {
  return Array.from(new Set(profiles.map((profile) => profile.category))).map((category) => {
    const categoryProfiles = profiles.filter((profile) => profile.category === category);
    return {
      category,
      profiles: categoryProfiles.length,
      averageReadiness: average(categoryProfiles.map((profile) => profile.overallReadiness)),
      interventionLoad: average(categoryProfiles.map((profile) => profile.interventionScore)),
      immediate: categoryProfiles.filter((profile) => profile.urgency === "Immediate intervention").length,
    };
  }).sort((left, right) => right.interventionLoad - left.interventionLoad);
}

function makeFocusSummaries(profiles: InsightProfile[]) {
  const focusAreas: InterventionFocus[] = ["Accuracy", "Learning", "Visual depth", "Classroom rollout", "Accessibility", "Curriculum mastery"];
  return focusAreas.map((focus) => {
    const focusProfiles = profiles.filter((profile) => profile.focus === focus);
    return {
      focus,
      count: focusProfiles.length,
      averageIntervention: average(focusProfiles.map((profile) => profile.interventionScore)),
      topExperiment: focusProfiles[0]?.title ?? "No active intervention",
    };
  }).sort((left, right) => right.count - left.count || right.averageIntervention - left.averageIntervention);
}

function average(values: number[]) {
  const finite = values.filter((value) => Number.isFinite(value));
  if (!finite.length) return 0;
  return Math.round(finite.reduce((sum, value) => sum + value, 0) / finite.length);
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}
