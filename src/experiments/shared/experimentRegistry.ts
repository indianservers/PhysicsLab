import type { ComponentType } from "react";

import { AcGeneratorLab } from "../ac-generator/AcGeneratorLab";
import { BernoulliFluidFlowLab } from "../bernoulli-fluid-flow/BernoulliFluidFlowLab";
import { BuoyancyLab } from "../buoyancy/BuoyancyLab";
import { ChladniPlateLab } from "../chladni-plate/ChladniPlateLab";
import { CircularMotionLab } from "../circular-motion/CircularMotionLab";
import { ConservationOfEnergyLab } from "../conservation-of-energy/ConservationOfEnergyLab";
import { ElasticCollisionLab } from "../elastic-collision/ElasticCollisionLab";
import { ElectromagnetLab } from "../electromagnet/ElectromagnetLab";
import { EmiFaradayLab } from "../emi-faraday/EmiFaradayLab";
import { FrictionLab } from "../friction/FrictionLab";
import { GasLawsLab } from "../gas-laws/GasLawsLab";
import { HookesLawLab } from "../hooke-s-law/HookesLawLab";
import { HumanEyeDefectsLab } from "../human-eye-defects/HumanEyeDefectsLab";
import { InclinedPlaneLab } from "../inclined-plane/InclinedPlaneLab";
import { LensFormulaLab } from "../lens-formula/LensFormulaLab";
import { MagneticFieldCurrentLab } from "../magnetic-field-current/MagneticFieldCurrentLab";
import { NewtonsSecondLawLab } from "../newton-s-second-law/NewtonsSecondLawLab";
import { OhmsLawLab } from "../ohms-law/OhmsLawLab";
import { PrismDispersionLab } from "../prism-dispersion/PrismDispersionLab";
import { ProjectileMotionLab } from "../projectile-motion/ProjectileMotionLab";
import { ReflectionPlaneMirrorLab } from "../reflection-plane-mirror/ReflectionPlaneMirrorLab";
import { SeriesParallelResistanceLab } from "../series-parallel-resistance/SeriesParallelResistanceLab";
import { SimplePendulumLab } from "../simple-pendulum/SimplePendulumLab";
import { SingleSlitDiffractionLab } from "../single-slit-diffraction/SingleSlitDiffractionLab";
import { SoundWaveAnatomyLab } from "../sound-wave-anatomy/SoundWaveAnatomyLab";
import { TransformerLab } from "../transformer-lab/TransformerLab";
import { TotalInternalReflectionLab } from "../total-internal-reflection/TotalInternalReflectionLab";
import { UniformMotionLab } from "../uniform-motion/UniformMotionLab";
import { WaveLab } from "../wave-lab/WaveLab";
import { YoungDoubleSlitLab } from "../young-double-slit/YoungDoubleSlitLab";
import type { LearningLevel } from "../../lib/learningLevels";
import type { ExperimentDefinition } from "../../types";
import type { ExperimentMode } from "./experimentModes";
import { getTop30ExperimentMeta, isTop30Experiment, listTop30ExperimentMeta, type Top30ExperimentMeta } from "./top30Registry";
import type { ValidationClaimStatus } from "./validation";

export interface DedicatedExperimentLabProps {
  experiment: ExperimentDefinition;
  learningLevel: LearningLevel;
  experimentMode?: ExperimentMode;
  assignment?: unknown;
}

export type DedicatedExperimentLabComponent = ComponentType<DedicatedExperimentLabProps>;

export interface DedicatedExperimentRegistryEntry {
  id: string;
  component: DedicatedExperimentLabComponent;
  accuracy: ValidationClaimStatus;
  notes?: string;
  premiumPlan?: Top30ExperimentMeta;
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
  "newton-s-second-law": {
    id: "newton-s-second-law",
    component: NewtonsSecondLawLab,
    accuracy: "validated",
    notes: "Validated against force-over-mass and friction-adjusted acceleration cases.",
  },
  "conservation-of-energy": {
    id: "conservation-of-energy",
    component: ConservationOfEnergyLab,
    accuracy: "validated",
    notes: "Validated against potential energy and no-loss energy transfer cases.",
  },
  "simple-pendulum": {
    id: "simple-pendulum",
    component: SimplePendulumLab,
    accuracy: "validated",
    notes: "Validated against small-angle period and mass-invariance cases.",
  },
  "projectile-motion": {
    id: "projectile-motion",
    component: ProjectileMotionLab,
    accuracy: "validated",
    notes: "Preserves existing projectile benchmark validation and uses formula-linked visuals.",
  },
  "single-slit-diffraction": {
    id: "single-slit-diffraction",
    component: SingleSlitDiffractionLab,
    accuracy: "validated",
    notes: "Validated against first-minimum and central-width trend benchmark cases.",
  },
  "chladni-plate": {
    id: "chladni-plate",
    component: ChladniPlateLab,
    accuracy: "qualitative-visual",
    notes: "School-level qualitative standing-wave plate model; not a finite-element solver.",
  },
  "wave-lab": {
    id: "wave-lab",
    component: WaveLab,
    accuracy: "validated",
    notes: "Validated against v = f lambda trend and coherent zero-separation source behavior.",
  },
  "young-double-slit": {
    id: "young-double-slit",
    component: YoungDoubleSlitLab,
    accuracy: "validated",
    notes: "Validated against fringe-width benchmark and wavelength/distance/separation trends.",
  },
  "sound-wave-anatomy": {
    id: "sound-wave-anatomy",
    component: SoundWaveAnatomyLab,
    accuracy: "validated",
    notes: "Validated against v = f lambda benchmark and amplitude-versus-pitch misconception checks.",
  },
  "ohms-law": {
    id: "ohms-law",
    component: OhmsLawLab,
    accuracy: "validated",
    notes: "Validated against V=IR current and V-I slope benchmark cases.",
  },
  "series-parallel-resistance": {
    id: "series-parallel-resistance",
    component: SeriesParallelResistanceLab,
    accuracy: "validated",
    notes: "Validated against two-resistor series and parallel equivalent resistance cases.",
  },
  "emi-faraday": {
    id: "emi-faraday",
    component: EmiFaradayLab,
    accuracy: "validated",
    notes: "Validated against turns, flux-change speed, and no-motion induction checks.",
  },
  "ac-generator": {
    id: "ac-generator",
    component: AcGeneratorLab,
    accuracy: "validated",
    notes: "Validated against peak emf and angular-speed trend checks.",
  },
  "transformer-lab": {
    id: "transformer-lab",
    component: TransformerLab,
    accuracy: "validated",
    notes: "Validated against ideal turns-ratio and DC no-action checks.",
  },
  electromagnet: {
    id: "electromagnet",
    component: ElectromagnetLab,
    accuracy: "validated",
    notes: "Validated against relative NI strength and current reversal checks.",
  },
  "magnetic-field-current": {
    id: "magnetic-field-current",
    component: MagneticFieldCurrentLab,
    accuracy: "validated",
    notes: "Validated against straight-wire current and distance trend checks.",
  },
  "reflection-plane-mirror": {
    id: "reflection-plane-mirror",
    component: ReflectionPlaneMirrorLab,
    accuracy: "validated",
    notes: "Validated against i = r and plane-mirror image distance checks.",
  },
  "lens-formula": {
    id: "lens-formula",
    component: LensFormulaLab,
    accuracy: "validated",
    notes: "Validated against thin-lens image distance and virtual-image edge case.",
  },
  "prism-dispersion": {
    id: "prism-dispersion",
    component: PrismDispersionLab,
    accuracy: "validated",
    notes: "Validated against index and prism-angle deviation trend checks.",
  },
  "total-internal-reflection": {
    id: "total-internal-reflection",
    component: TotalInternalReflectionLab,
    accuracy: "validated",
    notes: "Validated against critical angle and denser-to-rarer condition checks.",
  },
  "human-eye-defects": {
    id: "human-eye-defects",
    component: HumanEyeDefectsLab,
    accuracy: "validated",
    notes: "Validated against myopia diverging and hypermetropia converging correction checks.",
  },
  buoyancy: {
    id: "buoyancy",
    component: BuoyancyLab,
    accuracy: "validated",
    notes: "Validated against floating fraction and displaced-fluid weight checks.",
  },
  "bernoulli-fluid-flow": {
    id: "bernoulli-fluid-flow",
    component: BernoulliFluidFlowLab,
    accuracy: "validated",
    notes: "Validated against continuity speed and lower static pressure checks.",
  },
  "gas-laws": {
    id: "gas-laws",
    component: GasLawsLab,
    accuracy: "validated",
    notes: "Validated against ideal gas temperature and volume pressure trends.",
  },
};

export function getDedicatedExperimentLab(experimentId: string) {
  return dedicatedExperimentRegistry[experimentId]?.component;
}

export function getDedicatedExperimentRegistryEntry(experimentId: string) {
  const entry = dedicatedExperimentRegistry[experimentId];
  if (!entry) return undefined;
  return { ...entry, premiumPlan: getTop30ExperimentMeta(experimentId) };
}

export function hasDedicatedExperimentLab(experimentId: string) {
  return Boolean(dedicatedExperimentRegistry[experimentId]);
}

export function listDedicatedExperimentLabs() {
  return Object.values(dedicatedExperimentRegistry).map((entry) => ({ ...entry, premiumPlan: getTop30ExperimentMeta(entry.id) }));
}

export function getExperimentPremiumPlan(experimentId: string) {
  return getTop30ExperimentMeta(experimentId);
}

export function hasTop30PremiumPlan(experimentId: string) {
  return isTop30Experiment(experimentId);
}

export function listTop30PremiumPlans() {
  return listTop30ExperimentMeta();
}

// Accuracy note: do not mark a registry entry as "validated" until benchmark
// cases pass through shared/validation.ts or an equivalent physics test.
