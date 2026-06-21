import { experiments } from "./experiments";
import { simulationQualityScores } from "./simulationQuality";
import { experimentAccuracyProfiles } from "./accuracyValidation";
import type { ExperimentDefinition } from "../types";

export type VisualDepthTier = "Flagship cinematic" | "Interactive model" | "Guided visual" | "Needs depth pass";
export type VisualLayer = "2D diagram" | "3D scene" | "Vectors" | "Graph sync" | "Measurement probes" | "Replay checkpoints" | "Non-color cues";

export interface SimulationDepthProfile {
  experimentId: string;
  title: string;
  category: string;
  classLevel: string;
  visualScore: number;
  interactionScore: number;
  accuracyScore: number;
  depthScore: number;
  tier: VisualDepthTier;
  layers: VisualLayer[];
  missingLayers: VisualLayer[];
  visualPromise: string;
  sceneUpgrade: string;
  probeUpgrade: string;
  replayUpgrade: string;
  accessibilityUpgrade: string;
}

export interface SimulationDepthStats {
  profiles: number;
  averageDepth: number;
  flagship: number;
  interactive: number;
  needsDepthPass: number;
  probesNeeded: number;
}

const allLayers: VisualLayer[] = ["2D diagram", "3D scene", "Vectors", "Graph sync", "Measurement probes", "Replay checkpoints", "Non-color cues"];

export const simulationDepthProfiles: SimulationDepthProfile[] = experiments
  .map(makeDepthProfile)
  .sort((left, right) => right.depthScore - left.depthScore || left.title.localeCompare(right.title));

export const simulationDepthStats = makeDepthStats(simulationDepthProfiles);
export const visualDepthGaps = makeVisualDepthGaps(simulationDepthProfiles);

function makeDepthProfile(experiment: ExperimentDefinition): SimulationDepthProfile {
  const quality = simulationQualityScores.find((item) => item.id === experiment.id);
  const accuracy = experimentAccuracyProfiles.find((item) => item.experimentId === experiment.id);
  const visualScore = quality?.dimensions.visuals ?? 55;
  const interactionScore = quality?.dimensions.interaction ?? 55;
  const accuracyScore = accuracy?.modelGrade ?? quality?.dimensions.accuracy ?? 55;
  const layers = layersFor(experiment, visualScore, interactionScore, accuracyScore);
  const depthScore = clamp(Math.round(visualScore * 0.38 + interactionScore * 0.26 + accuracyScore * 0.18 + layers.length * 2.6));
  return {
    experimentId: experiment.id,
    title: experiment.title,
    category: experiment.category,
    classLevel: experiment.classLevel,
    visualScore,
    interactionScore,
    accuracyScore,
    depthScore,
    tier: tierFor(depthScore, layers),
    layers,
    missingLayers: allLayers.filter((layer) => !layers.includes(layer)),
    visualPromise: visualPromiseFor(experiment),
    sceneUpgrade: sceneUpgradeFor(experiment),
    probeUpgrade: probeUpgradeFor(experiment),
    replayUpgrade: replayUpgradeFor(experiment),
    accessibilityUpgrade: accessibilityUpgradeFor(experiment),
  };
}

function layersFor(experiment: ExperimentDefinition, visualScore: number, interactionScore: number, accuracyScore: number) {
  const layers: VisualLayer[] = ["2D diagram", "3D scene"];
  const text = `${experiment.id} ${experiment.category} ${experiment.title}`.toLowerCase();
  if (visualScore >= 68 || /force|motion|field|ray|wave|pressure|energy|current|magnet/.test(text)) layers.push("Vectors");
  if (experiment.observationColumns.length >= 4 || /graph|motion|ohm|wave|gas|decay|photoelectric/.test(text)) layers.push("Graph sync");
  if (interactionScore >= 68 || experiment.apparatus.some((item) => /sensor|meter|ruler|protractor|gauge|thermometer/i.test(item))) layers.push("Measurement probes");
  if (visualScore >= 76 || experiment.maturityLevel === "Flagship") layers.push("Replay checkpoints");
  if (accuracyScore >= 70 && experiment.commonMistakes.length > 0) layers.push("Non-color cues");
  return [...new Set(layers)];
}

function tierFor(depthScore: number, layers: VisualLayer[]): VisualDepthTier {
  if (depthScore >= 84 && layers.includes("Replay checkpoints") && layers.includes("Measurement probes")) return "Flagship cinematic";
  if (depthScore >= 74 && layers.includes("Measurement probes")) return "Interactive model";
  if (depthScore >= 62) return "Guided visual";
  return "Needs depth pass";
}

function visualPromiseFor(experiment: ExperimentDefinition) {
  const category = experiment.category.toLowerCase();
  if (category.includes("optics")) return "Rays, normals, images, and screens should move as one spatial story.";
  if (category.includes("electric")) return "Charge flow, meters, and energy transfer should be visible without reading the formula first.";
  if (category.includes("magnet")) return "Field loops, flux change, and force direction should be separated with clear cues.";
  if (category.includes("wave")) return "Wavefront, graph, and detector readings should stay synchronized.";
  if (category.includes("thermo")) return "Particle motion, energy flow, and temperature reading should be visually distinct.";
  if (category.includes("fluid")) return "Depth, density, force, and pressure should be seen as separate causes.";
  if (category.includes("modern")) return "Quantum rules should be shown as model layers, not literal classical motion.";
  return "Motion, forces, graph, and measurement should reinforce the same cause-effect pattern.";
}

function sceneUpgradeFor(experiment: ExperimentDefinition) {
  const firstObject = experiment.apparatus[0] ?? "apparatus";
  return `Use ${firstObject.toLowerCase()} as the anchored scene object, then layer labels, vectors, and ghosted previous states around it.`;
}

function probeUpgradeFor(experiment: ExperimentDefinition) {
  const columns = experiment.observationColumns.slice(1, 4).join(", ") || "the main output";
  return `Add draggable or pinned probes for ${columns}, with units visible beside each reading.`;
}

function replayUpgradeFor(experiment: ExperimentDefinition) {
  const steps = experiment.procedure.slice(0, 3).join(" -> ") || "predict -> change -> observe";
  return `Create replay checkpoints for ${steps}, so teachers can freeze the key idea.`;
}

function accessibilityUpgradeFor(experiment: ExperimentDefinition) {
  const mistake = experiment.commonMistakes[0] ?? "the main misconception";
  return `Pair color changes with labels, pattern fills, and a text state that flags ${mistake.toLowerCase()}.`;
}

function makeDepthStats(profiles: SimulationDepthProfile[]): SimulationDepthStats {
  return {
    profiles: profiles.length,
    averageDepth: Math.round(profiles.reduce((sum, item) => sum + item.depthScore, 0) / Math.max(1, profiles.length)),
    flagship: profiles.filter((item) => item.tier === "Flagship cinematic").length,
    interactive: profiles.filter((item) => item.tier === "Interactive model").length,
    needsDepthPass: profiles.filter((item) => item.tier === "Needs depth pass").length,
    probesNeeded: profiles.filter((item) => item.missingLayers.includes("Measurement probes")).length,
  };
}

function makeVisualDepthGaps(profiles: SimulationDepthProfile[]) {
  return allLayers.map((layer) => ({
    layer,
    ready: profiles.filter((profile) => profile.layers.includes(layer)).length,
    missing: profiles.filter((profile) => !profile.layers.includes(layer)).length,
  })).sort((left, right) => right.missing - left.missing);
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
