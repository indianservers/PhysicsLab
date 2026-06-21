import { experiments } from "./experiments";
import { simulationQualityScores } from "./simulationQuality";
import { simulationDepthProfiles } from "./simulationDepth";
import { learningStudioProfiles } from "./learningStudio";
import type { ExperimentDefinition } from "../types";

export type AccessibilityTier = "Inclusive ready" | "Supported with notes" | "Needs accessibility pass" | "High barrier";
export type AccessibilityNeed = "Keyboard path" | "Text state" | "Non-color cues" | "Reduced motion" | "Large touch targets" | "Screen-reader labels" | "Unit clarity";

export interface AccessibilityProfile {
  experimentId: string;
  title: string;
  category: string;
  classLevel: string;
  accessibilityScore: number;
  visualScore: number;
  learningScore: number;
  tier: AccessibilityTier;
  supportedNeeds: AccessibilityNeed[];
  missingNeeds: AccessibilityNeed[];
  inclusiveSummary: string;
  keyboardAction: string;
  textStateAction: string;
  contrastAction: string;
  reducedMotionAction: string;
  assessmentAction: string;
}

export interface AccessibilityStats {
  profiles: number;
  averageAccessibility: number;
  inclusiveReady: number;
  supportedWithNotes: number;
  needsPass: number;
  highBarrier: number;
  needsTracked: number;
}

const allNeeds: AccessibilityNeed[] = ["Keyboard path", "Text state", "Non-color cues", "Reduced motion", "Large touch targets", "Screen-reader labels", "Unit clarity"];

export const accessibilityProfiles: AccessibilityProfile[] = experiments
  .map(makeAccessibilityProfile)
  .sort((left, right) => right.accessibilityScore - left.accessibilityScore || left.title.localeCompare(right.title));

export const accessibilityStats = makeAccessibilityStats(accessibilityProfiles);
export const accessibilityNeedGaps = makeNeedGaps(accessibilityProfiles);

function makeAccessibilityProfile(experiment: ExperimentDefinition): AccessibilityProfile {
  const quality = simulationQualityScores.find((item) => item.id === experiment.id);
  const depth = simulationDepthProfiles.find((item) => item.experimentId === experiment.id);
  const learning = learningStudioProfiles.find((item) => item.experimentId === experiment.id);
  const baseAccessibility = quality?.dimensions.accessibility ?? 55;
  const visualScore = depth?.depthScore ?? quality?.dimensions.visuals ?? 55;
  const learningScore = learning?.readinessScore ?? quality?.dimensions.learning ?? 55;
  const supportedNeeds = supportedNeedsFor(experiment, baseAccessibility, visualScore, learningScore);
  const accessibilityScore = clamp(Math.round(baseAccessibility * 0.48 + learningScore * 0.18 + supportedNeeds.length * 4.8 + scoreSemanticData(experiment) * 0.14));
  return {
    experimentId: experiment.id,
    title: experiment.title,
    category: experiment.category,
    classLevel: experiment.classLevel,
    accessibilityScore,
    visualScore,
    learningScore,
    tier: tierFor(accessibilityScore, supportedNeeds),
    supportedNeeds,
    missingNeeds: allNeeds.filter((need) => !supportedNeeds.includes(need)),
    inclusiveSummary: inclusiveSummaryFor(experiment),
    keyboardAction: keyboardActionFor(experiment),
    textStateAction: textStateActionFor(experiment),
    contrastAction: contrastActionFor(experiment),
    reducedMotionAction: reducedMotionActionFor(experiment),
    assessmentAction: assessmentActionFor(experiment),
  };
}

function supportedNeedsFor(experiment: ExperimentDefinition, baseAccessibility: number, visualScore: number, learningScore: number) {
  const needs: AccessibilityNeed[] = ["Large touch targets", "Unit clarity"];
  if (experiment.procedure.length >= 4 || experiment.observationColumns.length >= 4) needs.push("Keyboard path");
  if (learningScore >= 65 || experiment.expectedResult.length > 40) needs.push("Text state");
  if (visualScore >= 68 || experiment.commonMistakes.length > 0) needs.push("Non-color cues");
  if (baseAccessibility >= 64 || /wave|optics|motion|animation|3d/i.test(`${experiment.category} ${experiment.title}`)) needs.push("Reduced motion");
  if (experiment.apparatus.length >= 3 || experiment.formulae.length > 0) needs.push("Screen-reader labels");
  return [...new Set(needs)];
}

function scoreSemanticData(experiment: ExperimentDefinition) {
  let score = 45;
  if (experiment.formulae.length) score += 10;
  if (experiment.observationColumns.length >= 4) score += 12;
  if (experiment.commonMistakes.length) score += 8;
  if (experiment.vivaQuestions.length) score += 8;
  if (experiment.validRanges?.length) score += 6;
  if (experiment.limitations?.length) score += 6;
  return clamp(score);
}

function tierFor(score: number, supported: AccessibilityNeed[]): AccessibilityTier {
  if (score >= 84 && supported.length >= 6) return "Inclusive ready";
  if (score >= 72 && supported.length >= 5) return "Supported with notes";
  if (score >= 58) return "Needs accessibility pass";
  return "High barrier";
}

function inclusiveSummaryFor(experiment: ExperimentDefinition) {
  return `${experiment.title} should be understandable through controls, text state, measurement table, and conclusion prompts even when motion or color is reduced.`;
}

function keyboardActionFor(experiment: ExperimentDefinition) {
  const control = experiment.observationColumns[1] ?? "the main input";
  return `Expose ${control.toLowerCase()} as a focusable stepper/slider with Reset, Step, and Copy state controls.`;
}

function textStateActionFor(experiment: ExperimentDefinition) {
  const output = experiment.observationColumns[experiment.observationColumns.length - 1] ?? "the result";
  return `Add a live text state: "When the input changes, ${output.toLowerCase()} changes because..." beside the visual.`;
}

function contrastActionFor(experiment: ExperimentDefinition) {
  const category = experiment.category.toLowerCase();
  if (category.includes("optics")) return "Use dashed, dotted, and labeled rays in addition to color.";
  if (category.includes("electric")) return "Use +, -, arrowheads, labels, and meter names in addition to wire color.";
  if (category.includes("wave")) return "Use amplitude brackets, crest labels, and phase markers in addition to color bands.";
  return "Pair every color-coded state with a label, icon, pattern, or numeric value.";
}

function reducedMotionActionFor(experiment: ExperimentDefinition) {
  return `Provide a frozen explanation frame for ${experiment.title.toLowerCase()} with manual Step and checkpoint buttons.`;
}

function assessmentActionFor(experiment: ExperimentDefinition) {
  const mistake = experiment.commonMistakes[0] ?? "the main misconception";
  return `Assessment should accept a text explanation that repairs: ${mistake}.`;
}

function makeAccessibilityStats(profiles: AccessibilityProfile[]): AccessibilityStats {
  return {
    profiles: profiles.length,
    averageAccessibility: Math.round(profiles.reduce((sum, item) => sum + item.accessibilityScore, 0) / Math.max(1, profiles.length)),
    inclusiveReady: profiles.filter((item) => item.tier === "Inclusive ready").length,
    supportedWithNotes: profiles.filter((item) => item.tier === "Supported with notes").length,
    needsPass: profiles.filter((item) => item.tier === "Needs accessibility pass").length,
    highBarrier: profiles.filter((item) => item.tier === "High barrier").length,
    needsTracked: allNeeds.length,
  };
}

function makeNeedGaps(profiles: AccessibilityProfile[]) {
  return allNeeds.map((need) => ({
    need,
    ready: profiles.filter((profile) => profile.supportedNeeds.includes(need)).length,
    missing: profiles.filter((profile) => !profile.supportedNeeds.includes(need)).length,
  })).sort((left, right) => right.missing - left.missing);
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
