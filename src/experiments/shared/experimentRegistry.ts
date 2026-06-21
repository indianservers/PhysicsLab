import type { ComponentType } from "react";

import { CircularMotionLab } from "../circular-motion/CircularMotionLab";
import { ElasticCollisionLab } from "../elastic-collision/ElasticCollisionLab";
import { FrictionLab } from "../friction/FrictionLab";
import { HookesLawLab } from "../hooke-s-law/HookesLawLab";
import { InclinedPlaneLab } from "../inclined-plane/InclinedPlaneLab";
import { UniformMotionLab } from "../uniform-motion/UniformMotionLab";
import type { LearningLevel } from "../../lib/learningLevels";
import type { ExperimentDefinition } from "../../types";

export interface DedicatedExperimentLabProps {
  experiment: ExperimentDefinition;
  learningLevel: LearningLevel;
  assignment?: unknown;
}

export type DedicatedExperimentLabComponent = ComponentType<DedicatedExperimentLabProps>;

export interface DedicatedExperimentRegistryEntry {
  id: string;
  component: DedicatedExperimentLabComponent;
  accuracy: "validated" | "benchmark-pending" | "qualitative-only";
  notes?: string;
}

// Migration note: keep this registry intentionally sparse. Add an experiment id
// only after a dedicated lab is ready. Unlisted ids must continue through the
// existing GenericExperiment and GuidedVisualization fallback.
export const dedicatedExperimentRegistry: Record<string, DedicatedExperimentRegistryEntry> = {
  "uniform-motion": {
    id: "uniform-motion",
    component: UniformMotionLab,
    accuracy: "validated",
    notes: "Validated against constant-velocity position benchmark cases.",
  },
  friction: {
    id: "friction",
    component: FrictionLab,
    accuracy: "validated",
    notes: "Validated against f = μN benchmark cases on a flat surface.",
  },
  "inclined-plane": {
    id: "inclined-plane",
    component: InclinedPlaneLab,
    accuracy: "validated",
    notes: "Validated against 30 degree frictionless and flat-plane edge cases.",
  },
  "elastic-collision": {
    id: "elastic-collision",
    component: ElasticCollisionLab,
    accuracy: "validated",
    notes: "Validated against 1D elastic collision benchmark cases.",
  },
  "hooke-s-law": {
    id: "hooke-s-law",
    component: HookesLawLab,
    accuracy: "validated",
    notes: "Validated against Hooke force and elastic energy benchmark cases.",
  },
  "circular-motion": {
    id: "circular-motion",
    component: CircularMotionLab,
    accuracy: "validated",
    notes: "Validated against centripetal force and tangential speed benchmark cases.",
  },
};

export function getDedicatedExperimentLab(experimentId: string) {
  return dedicatedExperimentRegistry[experimentId]?.component;
}

export function getDedicatedExperimentRegistryEntry(experimentId: string) {
  return dedicatedExperimentRegistry[experimentId];
}

export function hasDedicatedExperimentLab(experimentId: string) {
  return Boolean(dedicatedExperimentRegistry[experimentId]);
}

export function listDedicatedExperimentLabs() {
  return Object.values(dedicatedExperimentRegistry);
}

// Accuracy note: do not mark a registry entry as "validated" until benchmark
// cases pass through shared/validation.ts or an equivalent physics test.
