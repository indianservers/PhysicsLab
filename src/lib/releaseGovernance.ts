import { experiments } from "./experiments";
import { scientificSources } from "./scientificSources";
import { simulationQualityScores } from "./simulationQuality";
import { experimentAccuracyProfiles } from "./accuracyValidation";
import { learningStudioProfiles } from "./learningStudio";
import { simulationDepthProfiles } from "./simulationDepth";
import { classroomDeploymentProfiles } from "./classroomDeployment";
import { accessibilityProfiles } from "./accessibilityAudit";
import { masteryRoadmapProfiles } from "./masteryRoadmap";
import { insightProfiles } from "./insightAnalytics";
import type { ExperimentDefinition } from "../types";

export type ReleaseGate = "Publish ready" | "Review required" | "Improve before release" | "Internal only";
export type ReviewTrack = "Scientific validation" | "Instructional design" | "Simulation polish" | "Accessibility QA" | "Classroom rollout" | "Source documentation";

export interface ReleaseGovernanceProfile {
  experimentId: string;
  title: string;
  category: string;
  classLevel: string;
  gate: ReleaseGate;
  reviewTrack: ReviewTrack;
  releaseScore: number;
  trustScore: number;
  qualityScore: number;
  accuracyScore: number;
  learningScore: number;
  depthScore: number;
  deploymentScore: number;
  accessibilityScore: number;
  masteryScore: number;
  interventionScore: number;
  sourceCoverage: number;
  validationEvidence: number;
  releaseChecklist: ReleaseChecklistItem[];
  releaseRisks: string[];
  reviewerNotes: string[];
  publishSummary: string;
}

export interface ReleaseChecklistItem {
  label: string;
  status: "pass" | "watch" | "fail";
  detail: string;
}

export interface ReleaseGovernanceStats {
  profiles: number;
  publishReady: number;
  reviewRequired: number;
  improveBeforeRelease: number;
  internalOnly: number;
  averageReleaseScore: number;
  sourceFamilies: number;
  reviewTracks: number;
}

export const releaseGovernanceProfiles: ReleaseGovernanceProfile[] = experiments
  .map(makeReleaseProfile)
  .sort((left, right) => gateRank(left.gate) - gateRank(right.gate) || right.releaseScore - left.releaseScore || left.title.localeCompare(right.title));

export const releaseGovernanceStats = makeStats(releaseGovernanceProfiles);
export const releaseTrackSummaries = makeTrackSummaries(releaseGovernanceProfiles);
export const releaseCategorySummaries = makeCategorySummaries(releaseGovernanceProfiles);

function makeReleaseProfile(experiment: ExperimentDefinition): ReleaseGovernanceProfile {
  const quality = simulationQualityScores.find((item) => item.id === experiment.id);
  const accuracy = experimentAccuracyProfiles.find((item) => item.experimentId === experiment.id);
  const learning = learningStudioProfiles.find((item) => item.experimentId === experiment.id);
  const depth = simulationDepthProfiles.find((item) => item.experimentId === experiment.id);
  const deployment = classroomDeploymentProfiles.find((item) => item.experimentId === experiment.id);
  const access = accessibilityProfiles.find((item) => item.experimentId === experiment.id);
  const mastery = masteryRoadmapProfiles.filter((item) => item.experimentIds.includes(experiment.id));
  const insight = insightProfiles.find((item) => item.experimentId === experiment.id);

  const trustScore = experiment.trustLevel ?? 55;
  const qualityScore = quality?.overall ?? 55;
  const accuracyScore = accuracy?.modelGrade ?? quality?.dimensions.accuracy ?? trustScore;
  const learningScore = learning?.readinessScore ?? quality?.dimensions.learning ?? 55;
  const depthScore = depth?.depthScore ?? quality?.dimensions.visuals ?? 55;
  const deploymentScore = deployment?.deploymentScore ?? quality?.dimensions.classroom ?? 55;
  const accessibilityScore = access?.accessibilityScore ?? quality?.dimensions.accessibility ?? 55;
  const masteryScore = average(mastery.map((item) => item.readinessScore)) || (experiment.curriculumTags ? 68 : 48);
  const interventionScore = insight?.interventionScore ?? 45;
  const sourceCoverage = sourceCoverageFor(experiment);
  const validationEvidence = validationEvidenceFor(experiment, accuracy?.validationCases ?? 0);
  const releaseScore = clamp(Math.round(
    trustScore * 0.14 +
    accuracyScore * 0.16 +
    qualityScore * 0.12 +
    learningScore * 0.12 +
    depthScore * 0.1 +
    deploymentScore * 0.1 +
    accessibilityScore * 0.1 +
    masteryScore * 0.08 +
    sourceCoverage * 0.1 +
    validationEvidence * 0.08 -
    Math.min(12, interventionScore * 0.12),
  ));
  const releaseChecklist = checklistFor(experiment, {
    trustScore,
    qualityScore,
    accuracyScore,
    learningScore,
    depthScore,
    deploymentScore,
    accessibilityScore,
    masteryScore,
    sourceCoverage,
    validationEvidence,
  });
  const releaseRisks = risksFor(experiment, releaseChecklist, interventionScore);
  const reviewTrack = reviewTrackFor(releaseChecklist, releaseRisks);
  const gate = gateFor(releaseScore, releaseChecklist, releaseRisks);

  return {
    experimentId: experiment.id,
    title: experiment.title,
    category: experiment.category,
    classLevel: experiment.classLevel,
    gate,
    reviewTrack,
    releaseScore,
    trustScore,
    qualityScore,
    accuracyScore,
    learningScore,
    depthScore,
    deploymentScore,
    accessibilityScore,
    masteryScore,
    interventionScore,
    sourceCoverage,
    validationEvidence,
    releaseChecklist,
    releaseRisks,
    reviewerNotes: reviewerNotesFor(experiment, reviewTrack, releaseRisks),
    publishSummary: publishSummaryFor(experiment, gate, releaseScore),
  };
}

function checklistFor(experiment: ExperimentDefinition, scores: Record<string, number>): ReleaseChecklistItem[] {
  return [
    check("Scientific trust", scores.trustScore >= 90, scores.trustScore >= 75, `${scores.trustScore}% trust metadata.`),
    check("Validated output", scores.accuracyScore >= 82 && scores.validationEvidence >= 70, scores.accuracyScore >= 68, `${scores.accuracyScore}% accuracy, ${scores.validationEvidence}% validation evidence.`),
    check("Source references", scores.sourceCoverage >= 80, scores.sourceCoverage >= 50, `${experiment.sourceRefs?.length ?? 0} source refs mapped to ${scientificSources.length} catalog families.`),
    check("Learning design", scores.learningScore >= 78, scores.learningScore >= 65, `${scores.learningScore}% lesson readiness.`),
    check("Simulation polish", scores.depthScore >= 76 && scores.qualityScore >= 72, scores.depthScore >= 62, `${scores.depthScore}% visual depth, ${scores.qualityScore}% quality.`),
    check("Classroom rollout", scores.deploymentScore >= 76, scores.deploymentScore >= 62, `${scores.deploymentScore}% assignment readiness.`),
    check("Accessibility QA", scores.accessibilityScore >= 74, scores.accessibilityScore >= 62, `${scores.accessibilityScore}% inclusive UX readiness.`),
    check("Mastery pathway", scores.masteryScore >= 74, scores.masteryScore >= 58, `${scores.masteryScore}% curriculum mastery mapping.`),
  ];
}

function check(label: string, pass: boolean, watch: boolean, detail: string): ReleaseChecklistItem {
  return { label, status: pass ? "pass" : watch ? "watch" : "fail", detail };
}

function risksFor(experiment: ExperimentDefinition, checklist: ReleaseChecklistItem[], interventionScore: number) {
  const risks = checklist.filter((item) => item.status === "fail").map((item) => `${item.label}: ${item.detail}`);
  if (interventionScore >= 42) risks.push("Insights Center flags this lab for immediate intervention.");
  if (experiment.evidenceType === "Sandbox Only") risks.push("Sandbox-only model cannot be published as validated simulation.");
  if (!experiment.sourceRefs?.length) risks.push("No source references attached.");
  if (!experiment.validRanges?.length) risks.push("No explicit valid ranges attached.");
  if (!experiment.failureConditions?.length) risks.push("No failure conditions attached.");
  return [...new Set(risks)].slice(0, 6);
}

function reviewTrackFor(checklist: ReleaseChecklistItem[], risks: string[]): ReviewTrack {
  const failed = checklist.find((item) => item.status === "fail")?.label ?? risks[0] ?? "";
  if (/trust|validated|source|range|failure/i.test(failed)) return "Scientific validation";
  if (/learning|mastery/i.test(failed)) return "Instructional design";
  if (/simulation|quality|visual/i.test(failed)) return "Simulation polish";
  if (/accessibility/i.test(failed)) return "Accessibility QA";
  if (/classroom|assignment/i.test(failed)) return "Classroom rollout";
  return "Source documentation";
}

function gateFor(score: number, checklist: ReleaseChecklistItem[], risks: string[]): ReleaseGate {
  const fails = checklist.filter((item) => item.status === "fail").length;
  const watches = checklist.filter((item) => item.status === "watch").length;
  if (score >= 84 && fails === 0 && watches <= 2 && risks.length <= 1) return "Publish ready";
  if (score >= 72 && fails <= 1) return "Review required";
  if (score >= 58) return "Improve before release";
  return "Internal only";
}

function reviewerNotesFor(experiment: ExperimentDefinition, track: ReviewTrack, risks: string[]) {
  const notes = [
    `Primary review track: ${track}.`,
    `Check claim wording for ${experiment.evidenceType ?? "model evidence"} and ${experiment.modelClass ?? "model class"}.`,
  ];
  if (risks.length) notes.push(`First blocker: ${risks[0]}`);
  if (experiment.validationStatus) notes.push(experiment.validationStatus);
  return notes.slice(0, 4);
}

function publishSummaryFor(experiment: ExperimentDefinition, gate: ReleaseGate, score: number) {
  if (gate === "Publish ready") return `${experiment.title} can be released as a reviewed lab with ${score}% release readiness and stated model limits.`;
  if (gate === "Review required") return `${experiment.title} is close, but needs reviewer sign-off before public release.`;
  if (gate === "Improve before release") return `${experiment.title} needs targeted fixes before it should be promoted beyond guided/internal use.`;
  return `${experiment.title} should remain internal until validation, sources, and classroom/accessibility gates improve.`;
}

function sourceCoverageFor(experiment: ExperimentDefinition) {
  const refs = experiment.sourceRefs ?? [];
  if (!refs.length) return 0;
  const known = refs.filter((ref) => scientificSources.some((source) => source.id === ref)).length;
  const catalogScore = Math.round((known / Math.max(1, refs.length)) * 70);
  const breadthScore = Math.min(30, refs.length * 10);
  return clamp(catalogScore + breadthScore);
}

function validationEvidenceFor(experiment: ExperimentDefinition, caseCount: number) {
  let score = Math.min(54, caseCount * 18);
  if (experiment.formulae.length) score += 16;
  if (experiment.validRanges?.length) score += 10;
  if (experiment.failureConditions?.length) score += 10;
  if (experiment.sourceRefs?.includes("physicslab-local-validation")) score += 10;
  return clamp(score);
}

function makeStats(profiles: ReleaseGovernanceProfile[]): ReleaseGovernanceStats {
  return {
    profiles: profiles.length,
    publishReady: profiles.filter((item) => item.gate === "Publish ready").length,
    reviewRequired: profiles.filter((item) => item.gate === "Review required").length,
    improveBeforeRelease: profiles.filter((item) => item.gate === "Improve before release").length,
    internalOnly: profiles.filter((item) => item.gate === "Internal only").length,
    averageReleaseScore: average(profiles.map((item) => item.releaseScore)),
    sourceFamilies: scientificSources.length,
    reviewTracks: new Set(profiles.map((item) => item.reviewTrack)).size,
  };
}

function makeTrackSummaries(profiles: ReleaseGovernanceProfile[]) {
  const tracks: ReviewTrack[] = ["Scientific validation", "Instructional design", "Simulation polish", "Accessibility QA", "Classroom rollout", "Source documentation"];
  return tracks.map((track) => {
    const items = profiles.filter((profile) => profile.reviewTrack === track);
    return {
      track,
      count: items.length,
      averageScore: average(items.map((item) => item.releaseScore)),
      blockerCount: items.reduce((sum, item) => sum + item.releaseRisks.length, 0),
      topItem: items[0]?.title ?? "No active review",
    };
  }).sort((left, right) => right.count - left.count || right.blockerCount - left.blockerCount);
}

function makeCategorySummaries(profiles: ReleaseGovernanceProfile[]) {
  return Array.from(new Set(profiles.map((profile) => profile.category))).map((category) => {
    const items = profiles.filter((profile) => profile.category === category);
    return {
      category,
      count: items.length,
      averageScore: average(items.map((item) => item.releaseScore)),
      publishReady: items.filter((item) => item.gate === "Publish ready").length,
      internalOnly: items.filter((item) => item.gate === "Internal only").length,
    };
  }).sort((left, right) => left.averageScore - right.averageScore);
}

function gateRank(gate: ReleaseGate) {
  return gate === "Internal only" ? 0 : gate === "Improve before release" ? 1 : gate === "Review required" ? 2 : 3;
}

function average(values: number[]) {
  const finite = values.filter((value) => Number.isFinite(value));
  if (!finite.length) return 0;
  return Math.round(finite.reduce((sum, value) => sum + value, 0) / finite.length);
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}
