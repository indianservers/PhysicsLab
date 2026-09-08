import type { ComponentType } from "react";

import { AcGeneratorLab } from "../ac-generator/AcGeneratorLab";
import { AdvancedQuantumOperatorsLab } from "../advanced-quantum-operators/AdvancedQuantumOperatorsLab";
import { BohrModelLab } from "../bohr-model/BohrModelLab";
import { DeBroglieLab } from "../de-broglie-wavelength/DeBroglieLab";
import { NuclearDecayLab } from "../nuclear-decay/NuclearDecayLab";
import { PhotoelectricLab } from "../photoelectric-equation/PhotoelectricLab";
import { RelativityLab } from "../special-relativity-bridge/RelativityLab";
import { GlassSlabLab } from "../glass-slab-refraction/GlassSlabLab";
import { LcrResonanceLab } from "../ac-lcr-resonance/LcrResonanceLab";
import { BernoulliFluidFlowLab } from "../bernoulli-fluid-flow/BernoulliFluidFlowLab";
import { BalancedUnbalancedForcesLab } from "../balanced-unbalanced-forces/BalancedUnbalancedForcesLab";
import { BuoyancyLab } from "../buoyancy/BuoyancyLab";
import { DensityFloatSinkLab } from "../density-float-sink/DensityFloatSinkLab";
import { DistanceTimeGraphLab } from "../distance-time-graph/DistanceTimeGraphLab";
import { FluidPressureLab } from "../fluid-pressure/FluidPressureLab";
import { ForceAndPressureLab } from "../force-and-pressure/ForceAndPressureLab";
import { FreeFallLab } from "../free-fall/FreeFallLab";
import { CapacitorLab } from "../capacitor-lab/CapacitorLab";
import { CalorimetryMixingLab } from "../calorimetry-mixing/CalorimetryMixingLab";
import { ChladniPlateLab } from "../chladni-plate/ChladniPlateLab";
import { PhysicalOscillatorLab as ChaoticCoupledOscillatorsLab } from "../chaotic-coupled-oscillators/PhysicalOscillatorLab";
import { AtomicInteractionsLab } from "../expansion-labs/AtomicInteractionsLab";
import { ChemicalEffectsLab } from "../chemical-effects-current/ChemicalEffectsLab";
import { CircularMotionLab } from "../circular-motion/CircularMotionLab";
import { ConservationOfEnergyLab } from "../conservation-of-energy/ConservationOfEnergyLab";
import { ComputationalPhysicsWorkflowLab } from "../computational-physics-workflow/ComputationalPhysicsWorkflowLab";
import { ElasticCollisionEntry } from "../elastic-collision/ElasticCollisionEntry";
import { ElectromagnetLab } from "../electromagnet/ElectromagnetLab";
import { ElectricPowerLab } from "../electric-power/ElectricPowerLab";
import { ElectrostaticFieldLab } from "../electrostatic-field-potential/ElectrostaticFieldLab";
import { EmiFaradayLab } from "../emi-faraday/EmiFaradayLab";
import { FrictionLab } from "../friction/FrictionLab";
import { GasLawsLab } from "../gas-laws/GasLawsLab";
import { HeatAndTemperatureLab } from "../heat-and-temperature/HeatAndTemperatureLab";
import { HeatTransferLab } from "../heat-transfer/HeatTransferLab";
import { StatisticalEnsembleLab } from "../statistical-ensemble-lab/StatisticalEnsembleLab";
import { ThermodynamicProcessLab } from "../thermodynamic-process/ThermodynamicProcessLab";
import { EchoSpeedSoundLab } from "../echo-speed-sound/EchoSpeedSoundLab";
import { EmSpectrumLab } from "../em-spectrum/EmSpectrumLab";
import { HookesLawLab } from "../hooke-s-law/HookesLawLab";
import { HeatingEffectLab } from "../heating-effect-current/HeatingEffectLab";
import { HumanEyeDefectsLab } from "../human-eye-defects/HumanEyeDefectsLab";
import { InclinedPlaneLab } from "../inclined-plane/InclinedPlaneLab";
import { InternalResistanceLab } from "../internal-resistance-cell/InternalResistanceLab";
import { LensFormulaLab } from "../lens-formula/LensFormulaLab";
import { MirrorFormulaLab } from "../mirror-formula/MirrorFormulaLab";
import { MultipleReflectionLab } from "../multiple-reflection/MultipleReflectionLab";
import { OpticalInstrumentsLab } from "../optical-instruments/OpticalInstrumentsLab";
import { PolarizationLab } from "../polarization-lab/PolarizationLab";
import { LogicGatesLab } from "../logic-gates/LogicGatesLab";
import { LorentzForceLab } from "../lorentz-force/LorentzForceLab";
import { KirchhoffCircuitLab } from "../kirchhoff-circuit/KirchhoffCircuitLab";
import { MagneticFieldCurrentLab } from "../magnetic-field-current/MagneticFieldCurrentLab";
import { MassAndWeightLab } from "../mass-and-weight/MassAndWeightLab";
import { MeterBridgeLab } from "../meter-bridge/MeterBridgeLab";
import { MeasurementErrorsLab } from "../measurement-errors/MeasurementErrorsLab";
import { NewtonsSecondLawLab } from "../newton-s-second-law/NewtonsSecondLawLab";
import { OhmsLawLab } from "../ohms-law/OhmsLawLab";
import { PrismDispersionLab } from "../prism-dispersion/PrismDispersionLab";
import { ProjectileMotionLab } from "../projectile-motion/ProjectileMotionLab";
import { ReflectionPlaneMirrorLab } from "../reflection-plane-mirror/ReflectionPlaneMirrorLab";
import { ShadowsEclipsesLab } from "../shadows-eclipses/ShadowsEclipsesLab";
import { RotationalDynamicsLab } from "../rotational-dynamics/RotationalDynamicsLab";
import { SeriesParallelResistanceLab } from "../series-parallel-resistance/SeriesParallelResistanceLab";
import { SemiconductorDiodeLab } from "../semiconductor-diode/SemiconductorDiodeLab";
import { SatelliteOrbitLab } from "../satellite-orbit/SatelliteOrbitLab";
import { SimplePendulumLab } from "../simple-pendulum/SimplePendulumLab";
import { ShmSpringLab } from "../shm-spring/ShmSpringLab";
import { SingleSlitDiffractionLab } from "../single-slit-diffraction/SingleSlitDiffractionLab";
import { SoundPitchLoudnessLab } from "../sound-pitch-loudness/SoundPitchLoudnessLab";
import { SoundWaveAnatomyLab } from "../sound-wave-anatomy/SoundWaveAnatomyLab";
import { SourcesOfEnergyLab } from "../sources-of-energy/SourcesOfEnergyLab";
import { StaticElectricityLab } from "../static-electricity/StaticElectricityLab";
import { TransformerLab } from "../transformer-lab/TransformerLab";
import { TotalInternalReflectionLab } from "../total-internal-reflection/TotalInternalReflectionLab";
import { UniformMotionLab } from "../uniform-motion/UniformMotionLab";
import { UniversalGravitationLab } from "../universal-gravitation/UniversalGravitationLab";
import { VectorResolutionLab } from "../vector-resolution/VectorResolutionLab";
import { WorkPowerLab } from "../work-power/WorkPowerLab";
import { WaveLab } from "../wave-lab/WaveLab";
import { YoungDoubleSlitLab } from "../young-double-slit/YoungDoubleSlitLab";
import { PhysicsExpansionLab } from "../expansion-labs/PhysicsExpansionLab";
import type { LearningLevel } from "../../lib/learningLevels";
import type { ExperimentDefinition } from "../../types";
import type { ExperimentMode } from "./experimentModes";
import {
  getTop30ExperimentMeta,
  isTop30Experiment,
  listTop30ExperimentMeta,
  type Top30ExperimentMeta,
} from "./top30Registry";
import type { ValidationClaimStatus } from "./validation";

export interface DedicatedExperimentLabProps {
  experiment: ExperimentDefinition;
  learningLevel: LearningLevel;
  experimentMode?: ExperimentMode;
  assignment?: unknown;
}

export type DedicatedExperimentLabComponent =
  ComponentType<DedicatedExperimentLabProps>;

export interface DedicatedExperimentRegistryEntry {
  id: string;
  component: DedicatedExperimentLabComponent;
  accuracy: ValidationClaimStatus;
  notes?: string;
  premiumPlan?: Top30ExperimentMeta;
}

const expansionLabIds = [
  "balancing-act", "blackbody-spectrum", "build-a-nucleus", "color-vision",
  "fourier-making-waves", "resistance-in-a-wire", "rutherford-scattering",
  "states-of-matter", "atomic-interactions", "diffusion", "greenhouse-effect",
  "molecules-and-light",
] as const;

const expansionLabRegistry = Object.fromEntries(expansionLabIds.map((id) => [id, {
  id,
  component: id === "atomic-interactions" ? AtomicInteractionsLab : PhysicsExpansionLab,
  accuracy: "formula-only" as const,
  notes: "Dedicated interactive teaching model with live controls, calculated evidence, a topic-specific visualization, and explicit model scope.",
}])) as Record<string, DedicatedExperimentRegistryEntry>;

// Migration note: keep this registry intentionally sparse. Add an experiment id
// only after a dedicated lab is ready. Unlisted ids must continue through the
// existing GenericExperiment and GuidedVisualization fallback.
export const dedicatedExperimentRegistry: Record<
  string,
  DedicatedExperimentRegistryEntry
> = {
  ...expansionLabRegistry,
  "advanced-quantum-operators": {
    id: "advanced-quantum-operators",
    component: AdvancedQuantumOperatorsLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D qubit operator studio with normalized complex amplitudes, Bloch-vector transformations, Hermitian Pauli measurements, Born sampling, collapse, and target-state preparation.",
  },
  "bohr-model": {
    id: "bohr-model",
    component: BohrModelLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D hydrogenic atom lab validated for Z-squared Bohr levels, signed absorption/emission energy, photon frequency/wavelength, snapped shells, spectra, and Balmer missions.",
  },
  "de-broglie-wavelength": {
    id: "de-broglie-wavelength",
    component: DeBroglieLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D matter-wave bench validated for lambda=h/p, electron acceleration, inverse-square-root voltage scaling, and diffraction spacing.",
  },
  "nuclear-decay": {
    id: "nuclear-decay",
    component: NuclearDecayLab,
    accuracy: "validated",
    notes:
      "Dedicated seeded 2D decay chamber validated for exponential survival, activity, stochastic individual lifetimes, replayable seeds, and half-life inference.",
  },
  "photoelectric-equation": {
    id: "photoelectric-equation",
    component: PhotoelectricLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D photoelectric tube validated for Einstein's equation, threshold frequency, stopping potential, photocurrent, and intensity independence of maximum kinetic energy.",
  },
  "special-relativity-bridge": {
    id: "special-relativity-bridge",
    component: RelativityLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D relativity bridge validated for Lorentz gamma, light-clock time dilation, length contraction, invariant light speed, interval invariance, and relativity of simultaneity.",
  },
  "chaotic-coupled-oscillators": {
    id: "chaotic-coupled-oscillators",
    component: ChaoticCoupledOscillatorsLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D nonlinear coupled-pendulum laboratory validated for symmetric and antisymmetric normal modes, beat-period splitting, conservative total energy, and bounded nearby-state divergence.",
  },
  "calorimetry-mixing": {
    id: "calorimetry-mixing",
    component: CalorimetryMixingLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D mixing station validated for Q=mcΔT, insulated energy closure, calorimeter heat capacity, bounded equilibrium temperature, environmental heat loss, and unknown-specific-heat inference.",
  },
  "glass-slab-refraction": {
    id: "glass-slab-refraction",
    component: GlassSlabLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D parallel-slab optics bench validated for Snell's law, wavelength dispersion, parallel emergence, and lateral displacement.",
  },
  "free-fall": {
    id: "free-fall",
    component: FreeFallLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D drop-tower lab validated for ideal position/velocity, mass-independent acceleration, impact time, and optional quadratic drag.",
  },
  "distance-time-graph": {
    id: "distance-time-graph",
    component: DistanceTimeGraphLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D piecewise graph builder validated for slope=speed, horizontal rest, continuous joins, signed return mode, and synchronized vehicle motion.",
  },
  "balanced-unbalanced-forces": {
    id: "balanced-unbalanced-forces",
    component: BalancedUnbalancedForcesLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D force-composition cart validated for signed net force, F=ma, static and kinetic friction, force reversal, and constant-velocity equilibrium.",
  },
  "measurement-errors": {
    id: "measurement-errors",
    component: MeasurementErrorsLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D measurement studio validated for least-count readings, signed zero correction, repeated statistics, end-only rounding and uncertainty propagation.",
  },
  "computational-physics-workflow": {
    id: "computational-physics-workflow",
    component: ComputationalPhysicsWorkflowLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D numerical laboratory validated for reference error, convergence, explicit stability and reproducible model-discretize-solve-verify settings.",
  },
  "lorentz-force": {
    id: "lorentz-force",
    component: LorentzForceLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D charged-particle chamber validated for F=q(E+v×B), charge reversal, circular radius, parallel zero force and crossed-field velocity selection.",
  },
  "force-and-pressure": {
    id: "force-and-pressure",
    component: ForceAndPressureLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D contact-pressure rig validated for P=F/A, SI units, constant normal force, inverse-area behavior and material deformation.",
  },
  "fluid-pressure": {
    id: "fluid-pressure",
    component: FluidPressureLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D hydrostatic bench validated for P=P0+rho gh, equal-depth shape independence, manometer head, normal force and Torricelli jets.",
  },
  "density-float-sink": {
    id: "density-float-sink",
    component: DensityFloatSinkLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D layered-fluid tank validated for density, local buoyancy, force balance, interface equilibrium and neutral design.",
  },
  "sources-of-energy": {
    id: "sources-of-energy",
    component: SourcesOfEnergyLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D grid-dispatch lab validated for hourly energy balance, intermittent output, demand shape, storage losses, emissions and cost units.",
  },
  "semiconductor-diode": {
    id: "semiconductor-diode",
    component: SemiconductorDiodeLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D PN-junction and rectifier lab validated for exponential forward current, reverse leakage, depletion width, rectifier frequency and filter ripple.",
  },
  "logic-gates": {
    id: "logic-gates",
    component: LogicGatesLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D logic workbench validated for all gate truth tables, floating inputs, inversion bubbles, delayed output, and the four-NAND XOR construction.",
  },
  "static-electricity": {
    id: "static-electricity",
    component: StaticElectricityLab,
    accuracy: "validated",
    notes:
      "Discrete electron transfer, charge conservation, Coulomb force direction, induction order, grounding, field strength, and breakdown threshold share one state.",
  },
  "meter-bridge": {
    id: "meter-bridge",
    component: MeterBridgeLab,
    accuracy: "validated",
    notes:
      "Finite-galvanometer nodal solution, signed deflection, uniform bridge-wire segments, endpoint guards, and the null-balance ratio share one state.",
  },
  "kirchhoff-circuit": {
    id: "kirchhoff-circuit",
    component: KirchhoffCircuitLab,
    accuracy: "validated",
    notes:
      "Two mesh equations, signed shared-branch current, KCL/KVL residuals, power conservation, and the null-current balance share one solver.",
  },
  "heating-effect-current": {
    id: "heating-effect-current",
    component: HeatingEffectLab,
    accuracy: "validated",
    notes:
      "Joule input, temperature-dependent resistance, geometry/material dependence, thermal loss, cooldown, and energy balance share one SI-unit state.",
  },
  "electrostatic-field-potential": {
    id: "electrostatic-field-potential",
    component: ElectrostaticFieldLab,
    accuracy: "validated",
    notes:
      "Point-charge vector field, scalar potential, work, numerical gradient, and probe singularity protection are computed from superposition.",
  },
  "electric-power": {
    id: "electric-power",
    component: ElectricPowerLab,
    accuracy: "validated",
    notes:
      "Ohmic current, equivalent power identities, joule/kWh energy, heat, and fuse overload share one simulation state.",
  },
  "chemical-effects-current": {
    id: "chemical-effects-current",
    component: ChemicalEffectsLab,
    accuracy: "validated",
    notes:
      "Electrolyte conductance, Faraday deposition, ionic polarity, reaction products, gas amounts, and thermal safety share one state.",
  },
  "internal-resistance-cell": {
    id: "internal-resistance-cell",
    component: InternalResistanceLab,
    accuracy: "validated",
    notes:
      "Cell current, terminal voltage, lost volts, short-circuit protection, and V-I line fitting validated analytically.",
  },
  "capacitor-lab": {
    id: "capacitor-lab",
    component: CapacitorLab,
    accuracy: "validated",
    notes:
      "Parallel-plate geometry, charge, energy, and equal-capacitor series/parallel combinations validated analytically.",
  },
  "ac-lcr-resonance": {
    id: "ac-lcr-resonance",
    component: LcrResonanceLab,
    accuracy: "validated",
    notes:
      "Series LCR reactance, impedance, resonance, current, bandwidth, and phase validated against analytic benchmarks.",
  },
  "universal-gravitation": {
    id: "universal-gravitation",
    component: UniversalGravitationLab,
    accuracy: "validated",
    notes:
      "Newtonian two-body force, vector field superposition, potential, and softened singularities validated against analytic benchmarks.",
  },
  "satellite-orbit": {
    id: "satellite-orbit",
    component: SatelliteOrbitLab,
    accuracy: "validated",
    notes:
      "Inverse-square gravity integration validated against circular speed, escape speed, energy-sign, and vector-direction benchmarks.",
  },
  "uniform-motion": {
    id: "uniform-motion",
    component: UniformMotionLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D smart-cart lab validated for x=x0+vt, signed velocity, equal-interval markers, constant graph slopes, exact time scrubbing, and future-position prediction.",
  },
  "vector-resolution": {
    id: "vector-resolution",
    component: VectorResolutionLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D vector studio validated for rotated-axis cosine/sine components, signs in every quadrant, draggable resultant, animated projections, and Pythagorean recombination.",
  },
  "work-power": {
    id: "work-power",
    component: WorkPowerLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D warehouse lab validated for force-path dot-product work, friction/normal-force coupling, average and instantaneous power, and net-work kinetic-energy consistency.",
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
    notes:
      "Dedicated 2D adjustable-ramp lab validated for weight resolution, signed applied force, static/kinetic friction, critical angle, and breakaway motion.",
  },
  "elastic-collision": {
    id: "elastic-collision",
    component: ElasticCollisionEntry,
    accuracy: "validated",
    notes:
      "Dedicated 2D air-track lab validated for analytic restitution velocities, momentum conservation, elastic kinetic energy, continuous contact, and the first-cart-stop condition.",
  },
  "hooke-s-law": {
    id: "hooke-s-law",
    component: HookesLawLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D spring-extension lab validated for F=kx, equilibrium, force-extension slope, damped settling, energy, and elastic-limit warnings.",
  },
  "mass-and-weight": {
    id: "mass-and-weight",
    component: MassAndWeightLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D gravity measurement bay validated for invariant mass, altitude-adjusted weight, and apparent elevator weight.",
  },
  "circular-motion": {
    id: "circular-motion",
    component: CircularMotionLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D rotating-platform lab validated for v=ωr, ac=v²/r=ω²r, inward force, direction reversal, tangent release, and constant-force redesign.",
  },
  "newton-s-second-law": {
    id: "newton-s-second-law",
    component: NewtonsSecondLawLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D dynamics-track lab validated for friction-adjusted net force, a=Fnet/m, rest-start kinematics, force and inverse-mass graph slopes, persistent trial overlays, and matched-acceleration design.",
  },
  "conservation-of-energy": {
    id: "conservation-of-energy",
    component: ConservationOfEnergyLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D energy-track lab validated for mgh+½mv²+Ethermal conservation, friction work, mass cancellation, and minimum-speed target design.",
  },
  "simple-pendulum": {
    id: "simple-pendulum",
    component: SimplePendulumLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D precision pendulum validated for nonlinear sin(theta) motion, small/finite-angle periods, mass independence, energy exchange, photogate timing, draggable release, and local-gravity inference.",
  },
  "shm-spring": {
    id: "shm-spring",
    component: ShmSpringLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D free/damped/driven spring-mass lab with exact linear-oscillator solutions, phased state vectors, energy accounting, and resonance matching.",
  },
  "projectile-motion": {
    id: "projectile-motion",
    component: ProjectileMotionLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D launch lab validated for parametric components, rest-to-impact flight, optional deterministic drag, complementary-angle range, live vectors/graphs, scrubbing, and target interception.",
  },
  "rotational-dynamics": {
    id: "rotational-dynamics",
    component: RotationalDynamicsLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D flywheel lab validated for tangential torque, composite moment of inertia, angular acceleration, angular momentum, damped/free coasting, radial mass dragging, and matched-alpha design.",
  },
  "single-slit-diffraction": {
    id: "single-slit-diffraction",
    component: SingleSlitDiffractionLab,
    accuracy: "validated",
    notes:
      "Validated against first-minimum and central-width trend benchmark cases.",
  },
  "chladni-plate": {
    id: "chladni-plate",
    component: ChladniPlateLab,
    accuracy: "qualitative-visual",
    notes:
      "School-level qualitative standing-wave plate model; not a finite-element solver.",
  },
  "wave-lab": {
    id: "wave-lab",
    component: WaveLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D transverse-wave lab validated for v=fλ, algebraic superposition, standing nodes, and fixed/free boundary reflection phase.",
  },
  "young-double-slit": {
    id: "young-double-slit",
    component: YoungDoubleSlitLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D Young interference bench validated for beta=lambda D/d, exact path phase, bright/dark criteria, and coherence-dependent visibility.",
  },
  "sound-wave-anatomy": {
    id: "sound-wave-anatomy",
    component: SoundWaveAnatomyLab,
    accuracy: "validated",
    notes:
      "Validated against v = f lambda benchmark and amplitude-versus-pitch misconception checks.",
  },
  "sound-pitch-loudness": {
    id: "sound-pitch-loudness",
    component: SoundPitchLoudnessLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D sound bench with reciprocal period, RMS pressure, relative intensity, modeled SPL, safe optional audio, waveform timbre, and reference matching.",
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
    notes:
      "Three switchable resistors share one solver for equivalent resistance, branch currents, voltage drops, KCL, power conservation, and construction missions.",
  },
  "emi-faraday": {
    id: "emi-faraday",
    component: EmiFaradayLab,
    accuracy: "validated",
    notes:
      "Validated against turns, flux-change speed, and no-motion induction checks.",
  },
  "ac-generator": {
    id: "ac-generator",
    component: AcGeneratorLab,
    accuracy: "validated",
    notes:
      "Validated against peak value, flux/emf phase relation, sign reversal, and angular-speed scaling checks.",
  },
  "transformer-lab": {
    id: "transformer-lab",
    component: TransformerLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D lab validated for turns ratio, equal frequency, flux relation, current ratio, and explicit core/copper power-loss accounting.",
  },
  electromagnet: {
    id: "electromagnet",
    component: ElectromagnetLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D electromagnet crane validated for magnetic-circuit NI/core/gap dependence, pole reversal, saturation, lift and electrical safety.",
  },
  "magnetic-field-current": {
    id: "magnetic-field-current",
    component: MagneticFieldCurrentLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D field-mapping bench validated for right-hand direction, straight-wire inverse radius, loop and finite-solenoid fields, movable probe and two-wire superposition.",
  },
  "reflection-plane-mirror": {
    id: "reflection-plane-mirror",
    component: ReflectionPlaneMirrorLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D finite plane-mirror bench validated for vector reflection, equal angles, symmetric virtual-image distance, lateral inversion, and observer visibility through the mirror segment.",
  },
  "shadows-eclipses": {
    id: "shadows-eclipses",
    component: ShadowsEclipsesLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D eclipse bench validated for solar/lunar body order, apparent angular diameter, observer parallax, umbra/penumbra geometry, and total/annular/partial classification.",
  },
  "lens-formula": {
    id: "lens-formula",
    component: LensFormulaLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D optical rail validated for Cartesian thin-lens image distance, magnification, real/virtual image construction, and focal-length inference.",
  },
  "mirror-formula": {
    id: "mirror-formula",
    component: MirrorFormulaLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D spherical-mirror bench validated for the New Cartesian mirror formula, signed magnification, concave/convex ray construction, real/virtual images, and the upright-magnified concave case.",
  },
  "multiple-reflection": {
    id: "multiple-reflection",
    component: MultipleReflectionLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D two/three-mirror kaleidoscope bench validated for conditional image-count rules, exact odd/even boundaries, unfolded reflection angles, staged generations, and symmetry order.",
  },
  "optical-instruments": {
    id: "optical-instruments",
    component: OpticalInstrumentsLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D microscope and astronomical-telescope bench validated for focus conditions, signed magnification, intermediate-image formation, near-point viewing, and inverted final orientation.",
  },
  "prism-dispersion": {
    id: "prism-dispersion",
    component: PrismDispersionLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D spectrometer validated for wavelength-dependent Cauchy indices, Snell refraction at both prism faces, deviation order, minimum deviation, total internal reflection, and safe-dispersion design.",
  },
  "total-internal-reflection": {
    id: "total-internal-reflection",
    component: TotalInternalReflectionLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D optical bench validated for Snell refraction, denser-to-rarer critical angle, Fresnel power continuity, equal reflection angles, and trapped-light fibre guidance.",
  },
  "human-eye-defects": {
    id: "human-eye-defects",
    component: HumanEyeDefectsLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D eye lab validated for retinal focus, signed myopia/hyperopia correction, and presbyopic near-point behavior.",
  },
  buoyancy: {
    id: "buoyancy",
    component: BuoyancyLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D tank validated for displaced volume, Archimedes force, apparent weight, force balance and floating fraction.",
  },
  "bernoulli-fluid-flow": {
    id: "bernoulli-fluid-flow",
    component: BernoulliFluidFlowLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D Venturi bench validated for three-station continuity, Bernoulli energy, elevation terms, absolute pressure and cavitation margin.",
  },
  "gas-laws": {
    id: "gas-laws",
    component: GasLawsLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D molecular piston lab validated for PV=nRT, Boyle, Charles and isochoric pressure laws, Kelvin temperature, Maxwell-Boltzmann speeds, wall collisions and an invariant challenge.",
  },
  "heat-and-temperature": {
    id: "heat-and-temperature",
    component: HeatAndTemperatureLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D thermal bench validated for Q=mcΔT, equal-energy temperature response, Celsius/Kelvin/Fahrenheit scales, and insulated thermal equilibrium.",
  },
  "heat-transfer": {
    id: "heat-transfer",
    component: HeatTransferLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D three-mechanism bench validated for Fourier conduction trends, buoyancy-driven circulation direction, and Stefan-Boltzmann emissivity and absolute-temperature dependence.",
  },
  "statistical-ensemble-lab": {
    id: "statistical-ensemble-lab",
    component: StatisticalEnsembleLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D two-level-system lab validated for normalized canonical probabilities, microcanonical E/N conservation, canonical N conservation, grand-canonical fluctuations, sample-mean convergence and inverse-square-root relative fluctuations.",
  },
  "thermodynamic-process": {
    id: "thermodynamic-process",
    component: ThermodynamicProcessLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D piston and P-V path lab validated for the ideal-gas equation, signed boundary work, the first law, and isothermal, isobaric, isochoric and reversible adiabatic paths.",
  },
  "echo-speed-sound": {
    id: "echo-speed-sound",
    component: EchoSpeedSoundLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D echo-timing lab validated for temperature-dependent dry-air sound speed, round-trip pulse travel, distinct-echo threshold and v=2d/delta-t inference.",
  },
  "em-spectrum": {
    id: "em-spectrum",
    component: EmSpectrumLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D electromagnetic-spectrum lab validated for v=f lambda, E=hf, refractive-index speed and wavelength changes, band ordering, and vacuum-speed consistency.",
  },
  "polarization-lab": {
    id: "polarization-lab",
    component: PolarizationLab,
    accuracy: "validated",
    notes:
      "Dedicated 2D polarization bench validated for ideal first-polarizer transmission, Malus's law, axial periodicity, 25% transmission and crossed-axis extinction.",
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
  return Object.values(dedicatedExperimentRegistry).map((entry) => ({
    ...entry,
    premiumPlan: getTop30ExperimentMeta(entry.id),
  }));
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
