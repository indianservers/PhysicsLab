import { experiments } from "./experiments";
import { qualityAuditStats, simulationQualityScores } from "./simulationQuality";
import { accuracyAuditStats, experimentAccuracyProfiles } from "./accuracyValidation";
import { learningStudioStats, learningStudioProfiles } from "./learningStudio";
import { simulationDepthStats, simulationDepthProfiles } from "./simulationDepth";
import { classroomDeploymentStats, classroomDeploymentProfiles } from "./classroomDeployment";
import { accessibilityStats, accessibilityProfiles } from "./accessibilityAudit";
import { masteryRoadmapStats, masteryRoadmapProfiles } from "./masteryRoadmap";
import { insightStats, insightProfiles } from "./insightAnalytics";
import { releaseGovernanceStats, releaseGovernanceProfiles } from "./releaseGovernance";

export type ExcellenceStatus = "Ahead" | "On track" | "Near target" | "Gap";
export type ExcellencePillar =
  | "Accuracy"
  | "Simulation depth"
  | "Learning design"
  | "Classroom workflow"
  | "Accessibility"
  | "Mastery"
  | "Release governance";

export interface ExcellenceBenchmarkPillar {
  id: string;
  pillar: ExcellencePillar;
  current: number;
  target: number;
  gap: number;
  status: ExcellenceStatus;
  evidence: string;
  action: string;
}

export interface ExcellenceSprintItem {
  id: string;
  title: string;
  category: string;
  score: number;
  pillar: ExcellencePillar;
  path: string;
  reason: string;
  action: string;
}

export interface ExcellenceCompetitorTarget {
  competitor: string;
  benchmark: number;
  physicsLab: number;
  gap: number;
  note: string;
}

export interface ExcellenceBenchmarkStats {
  totalExperiments: number;
  overall: number;
  phetTarget: number;
  remainingGap: number;
  publishReady: number;
  immediateInterventions: number;
  validatedProfiles: number;
  readyLessons: number;
  accessibleProfiles: number;
  sprintItems: number;
}

const target = 90;

export const excellenceBenchmarkPillars: ExcellenceBenchmarkPillar[] = [
  makePillar("accuracy", "Accuracy", accuracyAuditStats.averageGrade, target, `${accuracyAuditStats.cases} validation cases, ${accuracyAuditStats.validatedProfiles} validated profiles.`, "Add benchmark cases and model guardrails to low-grade labs."),
  makePillar("depth", "Simulation depth", simulationDepthStats.averageDepth, target, `${simulationDepthStats.flagship} flagship-ready visual profiles.`, "Upgrade weak labs with 2D/3D panes, probes, replay, and graph overlays."),
  makePillar("learning", "Learning design", learningStudioStats.averageReadiness, target, `${learningStudioStats.readyLessons} ready lessons and ${learningStudioStats.misconceptionRepairs} misconception repairs.`, "Strengthen predict-explore-explain-transfer flows for lower readiness labs."),
  makePillar("classroom", "Classroom workflow", classroomDeploymentStats.averageDeployment, 88, `${classroomDeploymentStats.readyToAssign} ready assignments, ${classroomDeploymentStats.evidenceItems} evidence item types.`, "Convert review-required labs into locked-variable assignments with rubrics."),
  makePillar("accessibility", "Accessibility", accessibilityStats.averageAccessibility, 88, `${accessibilityStats.inclusiveReady} inclusive-ready profiles.`, "Close keyboard, contrast, reduced-motion, and text-state gaps."),
  makePillar("mastery", "Mastery", masteryRoadmapStats.averageReadiness, 86, `${masteryRoadmapStats.masteryReady} mastery-ready curriculum topics.`, "Connect prerequisite, practice, evidence, and transfer paths for weaker topics."),
  makePillar("release", "Release governance", releaseGovernanceStats.averageReleaseScore, 84, `${releaseGovernanceStats.publishReady} publish-ready labs from ${releaseGovernanceStats.profiles}.`, "Resolve scientific review blockers and source documentation gaps."),
];

export const excellenceStats = makeStats(excellenceBenchmarkPillars);
export const excellenceSprintItems = makeSprintItems();
export const excellenceCompetitorTargets: ExcellenceCompetitorTarget[] = [
  {
    competitor: "PhET Interactive Simulations",
    benchmark: 94,
    physicsLab: excellenceStats.overall,
    gap: Math.max(0, 94 - excellenceStats.overall),
    note: "Best-in-class focused simulations and research-backed conceptual flow.",
  },
  {
    competitor: "Labster",
    benchmark: 84,
    physicsLab: excellenceStats.overall,
    gap: Math.max(0, 84 - excellenceStats.overall),
    note: "Strong guided lab procedure and polished narrative scaffolding.",
  },
  {
    competitor: "Pivot Interactives",
    benchmark: 82,
    physicsLab: excellenceStats.overall,
    gap: Math.max(0, 82 - excellenceStats.overall),
    note: "Strong authentic video data and measurement workflows.",
  },
  {
    competitor: "Algodoo",
    benchmark: 76,
    physicsLab: excellenceStats.overall,
    gap: Math.max(0, 76 - excellenceStats.overall),
    note: "Fast creative 2D sandboxing and playful experimentation.",
  },
];

function makePillar(id: string, pillar: ExcellencePillar, current: number, targetScore: number, evidence: string, action: string): ExcellenceBenchmarkPillar {
  const gap = Math.max(0, targetScore - current);
  return {
    id,
    pillar,
    current,
    target: targetScore,
    gap,
    status: statusFor(current, targetScore),
    evidence,
    action,
  };
}

function statusFor(current: number, targetScore: number): ExcellenceStatus {
  if (current >= targetScore) return "Ahead";
  if (current >= targetScore - 4) return "On track";
  if (current >= targetScore - 12) return "Near target";
  return "Gap";
}

function makeStats(pillars: ExcellenceBenchmarkPillar[]): ExcellenceBenchmarkStats {
  const overall = Math.round(pillars.reduce((sum, item) => sum + item.current, 0) / Math.max(1, pillars.length));
  return {
    totalExperiments: experiments.length,
    overall,
    phetTarget: 94,
    remainingGap: Math.max(0, 94 - overall),
    publishReady: releaseGovernanceStats.publishReady,
    immediateInterventions: insightStats.immediate,
    validatedProfiles: accuracyAuditStats.validatedProfiles,
    readyLessons: learningStudioStats.readyLessons,
    accessibleProfiles: accessibilityStats.inclusiveReady,
    sprintItems: 12,
  };
}

function makeSprintItems(): ExcellenceSprintItem[] {
  const byExperiment = experiments.map((experiment) => {
    const quality = simulationQualityScores.find((item) => item.id === experiment.id);
    const accuracy = experimentAccuracyProfiles.find((item) => item.experimentId === experiment.id);
    const learning = learningStudioProfiles.find((item) => item.experimentId === experiment.id);
    const depth = simulationDepthProfiles.find((item) => item.experimentId === experiment.id);
    const deployment = classroomDeploymentProfiles.find((item) => item.experimentId === experiment.id);
    const access = accessibilityProfiles.find((item) => item.experimentId === experiment.id);
    const mastery = masteryRoadmapProfiles.find((item) => item.experimentIds.includes(experiment.id));
    const insight = insightProfiles.find((item) => item.experimentId === experiment.id);
    const release = releaseGovernanceProfiles.find((item) => item.experimentId === experiment.id);
    const scores: Array<[ExcellencePillar, number, string, string, string]> = [
      ["Accuracy", accuracy?.modelGrade ?? quality?.dimensions.accuracy ?? 55, `/accuracy-center?experiment=${experiment.id}`, "Accuracy is below the capstone target.", "Add benchmark cases, ranges, and source-backed assumptions."],
      ["Simulation depth", depth?.depthScore ?? quality?.dimensions.visuals ?? 55, `/simulation-depth?simulation=${experiment.id}`, "Visual depth limits discovery and polish.", "Add 2D/3D comparison, probes, and replay evidence."],
      ["Learning design", learning?.readinessScore ?? quality?.dimensions.learning ?? 55, `/learning-studio?lesson=${experiment.id}`, "Learning flow needs stronger evidence and transfer.", "Add misconception repair and apply prompts."],
      ["Classroom workflow", deployment?.deploymentScore ?? quality?.dimensions.classroom ?? 55, `/classroom-deployment?assignment=${experiment.id}`, "Teacher assignment rollout is not yet frictionless.", "Add defaults, rubric, and required student outputs."],
      ["Accessibility", access?.accessibilityScore ?? quality?.dimensions.accessibility ?? 55, `/accessibility-center?experiment=${experiment.id}`, "Inclusive UX is below target.", "Add keyboard path, non-color cues, text state, and reduced motion."],
      ["Mastery", mastery?.readinessScore ?? 50, `/roadmap?topic=${mastery?.topicId ?? ""}`, "Curriculum mastery path is weak.", "Connect prerequisite, lab evidence, practice, and transfer."],
      ["Release governance", release?.releaseScore ?? 50, `/release-governance?experiment=${experiment.id}`, "Release gate is not yet publish-ready.", "Resolve review blockers and publish claim wording."],
    ];
    const weakest = scores.sort((left, right) => left[1] - right[1])[0];
    const urgency = insight?.interventionScore ?? 0;
    return {
      id: experiment.id,
      title: experiment.title,
      category: experiment.category,
      score: Math.max(0, (weakest?.[1] ?? 0) - Math.round(urgency * 0.1)),
      pillar: weakest?.[0] ?? "Release governance",
      path: weakest?.[2] ?? `/experiments/${experiment.id}`,
      reason: weakest?.[3] ?? "Needs capstone review.",
      action: weakest?.[4] ?? "Complete release governance review.",
    };
  });

  return byExperiment
    .sort((left, right) => left.score - right.score || left.title.localeCompare(right.title))
    .slice(0, 12);
}
