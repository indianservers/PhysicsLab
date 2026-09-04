import { circularMotionBenchmarks } from "../experiments/circular-motion/circular-motionSimulation";
import { quantumOperatorBenchmarks } from "../experiments/advanced-quantum-operators/quantumOperatorSimulation";
import { bohrModelBenchmarks } from "../experiments/bohr-model/bohrModelSimulation";
import { deBroglieBenchmarks } from "../experiments/de-broglie-wavelength/deBroglieSimulation";
import { nuclearDecayBenchmarks } from "../experiments/nuclear-decay/nuclearDecaySimulation";
import { photoelectricBenchmarks } from "../experiments/photoelectric-equation/photoelectricSimulation";
import { relativityBenchmarks } from "../experiments/special-relativity-bridge/relativitySimulation";
import { chaoticCoupledOscillatorBenchmarks } from "../experiments/chaotic-coupled-oscillators/chaotic-coupled-oscillatorsSimulation";
import { calorimetryMixingBenchmarks } from "../experiments/calorimetry-mixing/calorimetry-mixingSimulation";
import { gasLawsBenchmarks } from "../experiments/gas-laws/gas-lawsSimulation";
import { heatTemperatureBenchmarks } from "../experiments/heat-and-temperature/heatTemperatureSimulation";
import { heatTransferBenchmarks } from "../experiments/heat-transfer/heatTransferSimulation";
import { statisticalEnsembleBenchmarks } from "../experiments/statistical-ensemble-lab/statisticalEnsembleSimulation";
import { thermodynamicProcessBenchmarks } from "../experiments/thermodynamic-process/thermodynamicProcessSimulation";
import { echoSpeedSoundBenchmarks } from "../experiments/echo-speed-sound/echoSpeedSoundSimulation";
import { emSpectrumBenchmarks } from "../experiments/em-spectrum/emSpectrumSimulation";
import { polarizationBenchmarks } from "../experiments/polarization-lab/polarizationSimulation";
import { glassSlabBenchmarks } from "../experiments/glass-slab-refraction/glassSlabSimulation";
import { humanEyeDefectsBenchmarks } from "../experiments/human-eye-defects/human-eye-defectsSimulation";
import { lensFormulaBenchmarks } from "../experiments/lens-formula/lens-formulaSimulation";
import { mirrorFormulaBenchmarks } from "../experiments/mirror-formula/mirrorFormulaSimulation";
import { multipleReflectionBenchmarks } from "../experiments/multiple-reflection/multipleReflectionSimulation";
import { prismDispersionBenchmarks } from "../experiments/prism-dispersion/prism-dispersionSimulation";
import { totalInternalReflectionBenchmarks } from "../experiments/total-internal-reflection/total-internal-reflectionSimulation";
import { reflectionPlaneMirrorBenchmarks } from "../experiments/reflection-plane-mirror/reflection-plane-mirrorSimulation";
import { shadowsEclipsesBenchmarks } from "../experiments/shadows-eclipses/shadows-eclipsesSimulation";
import { opticalInstrumentsBenchmarks } from "../experiments/optical-instruments/opticalInstrumentsSimulation";
import { elasticCollisionBenchmarks } from "../experiments/elastic-collision/elastic-collisionSimulation";
import { frictionBenchmarks } from "../experiments/friction/frictionSimulation";
import { hookesLawBenchmarks } from "../experiments/hooke-s-law/hooke-s-lawSimulation";
import { inclinedPlaneBenchmarks } from "../experiments/inclined-plane/inclined-planeSimulation";
import { massWeightBenchmarks } from "../experiments/mass-and-weight/massWeightSimulation";
import { newtonSecondLawBenchmarks as newtonBenchmarks } from "../experiments/newton-s-second-law/newton-s-second-lawSimulation";
import { projectileLessonBenchmarks } from "../experiments/projectile-motion/projectile-motionSimulation";
import { rotationalDynamicsBenchmarks } from "../experiments/rotational-dynamics/rotationalDynamicsSimulation";
import { simplePendulumBenchmarks } from "../experiments/simple-pendulum/simple-pendulumSimulation";
import { shmSpringBenchmarks } from "../experiments/shm-spring/shmSpringSimulation";
import { chladniBenchmarks } from "../experiments/chladni-plate/chladni-plateSimulation";
import { singleSlitBenchmarks } from "../experiments/single-slit-diffraction/single-slit-diffractionSimulation";
import { uniformMotionBenchmarks } from "../experiments/uniform-motion/uniform-motionSimulation";
import { vectorResolutionBenchmarks } from "../experiments/vector-resolution/vectorResolutionSimulation";
import { workPowerBenchmarks } from "../experiments/work-power/workPowerSimulation";
import {
  runBenchmarkCases,
  statusForBenchmarks,
  type ExperimentValidationMetadata,
  type ValidationClaimStatus,
} from "../experiments/shared/validation";
import { waveLabBenchmarks } from "../experiments/wave-lab/wave-labSimulation";
import { soundWaveAnatomyValidation } from "../experiments/sound-wave-anatomy/sound-wave-anatomyValidation";
import { soundPitchBenchmarks } from "../experiments/sound-pitch-loudness/soundPitchSimulation";
import { youngDoubleSlitBenchmarks } from "../experiments/young-double-slit/young-double-slitSimulation";
import { satelliteOrbitBenchmarks } from "../experiments/satellite-orbit/satelliteOrbitValidation";
import { universalGravitationBenchmarks } from "../experiments/universal-gravitation/universalGravitationValidation";
import { acGeneratorValidation } from "../experiments/ac-generator/ac-generatorValidation";
import { lcrBenchmarks } from "../experiments/ac-lcr-resonance/lcrValidation";
import { capacitorBenchmarks } from "../experiments/capacitor-lab/capacitorValidation";
import { internalResistanceBenchmarks } from "../experiments/internal-resistance-cell/internalResistanceValidation";
import { chemicalEffectsBenchmarks } from "../experiments/chemical-effects-current/chemicalEffectsValidation";
import { electricPowerBenchmarks } from "../experiments/electric-power/electricPowerValidation";
import { electrostaticBenchmarks } from "../experiments/electrostatic-field-potential/electrostaticValidation";
import { emiFaradayBenchmarks } from "../experiments/emi-faraday/emi-faradayValidation";
import { heatingEffectBenchmarks } from "../experiments/heating-effect-current/heatingEffectValidation";
import { kirchhoffBenchmarks } from "../experiments/kirchhoff-circuit/kirchhoffValidation";
import { meterBridgeBenchmarks } from "../experiments/meter-bridge/meterBridgeValidation";
import { ohmsLawBenchmarks } from "../experiments/ohms-law/ohmsLawValidation";
import { seriesParallelBenchmarks } from "../experiments/series-parallel-resistance/seriesParallelValidation";
import { staticElectricityBenchmarks } from "../experiments/static-electricity/staticElectricityValidation";
import { transformerBenchmarks } from "../experiments/transformer-lab/transformerValidation";
import { logicGatesBenchmarks } from "../experiments/logic-gates/logicGatesValidation";
import { diodeBenchmarks } from "../experiments/semiconductor-diode/diodeValidation";
import { energyGridBenchmarks } from "../experiments/sources-of-energy/energyGridValidation";
import { bernoulliBenchmarks } from "../experiments/bernoulli-fluid-flow/bernoulliValidation";
import { buoyancyBenchmarks } from "../experiments/buoyancy/buoyancyValidation";
import { densityTankBenchmarks } from "../experiments/density-float-sink/densityTankValidation";
import { fluidPressureBenchmarks } from "../experiments/fluid-pressure/fluidPressureValidation";
import { contactPressureBenchmarks } from "../experiments/force-and-pressure/contactPressureValidation";
import { electromagnetBenchmarks } from "../experiments/electromagnet/electromagnetValidation";
import { lorentzForceBenchmarks } from "../experiments/lorentz-force/lorentzForceValidation";
import { magneticFieldCurrentBenchmarks } from "../experiments/magnetic-field-current/magnetic-field-currentValidation";
import { computationalWorkflowBenchmarks } from "../experiments/computational-physics-workflow/computationalPhysicsValidation";
import { measurementErrorBenchmarks } from "../experiments/measurement-errors/measurementErrorsValidation";
import { distanceTimeBenchmarks } from "../experiments/distance-time-graph/distanceTimeValidation";
import { freeFallBenchmarks } from "../experiments/free-fall/freeFallValidation";
import { balancedForcesBenchmarks } from "../experiments/balanced-unbalanced-forces/balancedForcesValidation";

const si = (
  id: string,
  label: string,
  displayUnit: string,
  siUnit = displayUnit,
) => ({ id, label, displayUnit, siUnit });

const energyBenchmarks = runBenchmarkCases([
  {
    id: "energy-conserved-drop",
    name: "Potential converts to kinetic",
    input: { mass: 2, g: 9.8, height: 5 },
    expected: 98,
    unit: "J",
    tolerance: 1e-12,
    actual: (input) => input.mass * input.g * input.height,
  },
  {
    id: "energy-speed-check",
    name: "Speed from drop height",
    input: { mass: 1, g: 9.8, height: 5 },
    expected: Math.sqrt(98),
    unit: "m/s",
    tolerance: 1e-12,
    actual: (input) => Math.sqrt(2 * input.g * input.height),
  },
]);

export const experimentValidationRegistry: Record<
  string,
  ExperimentValidationMetadata
> = {
  "advanced-quantum-operators": {
    experimentId: "advanced-quantum-operators",
    formulaName: "Qubit operators and Born measurement",
    formula: "|psi|^2=1; p_plus=(1+r dot n)/2; expectation(sigma_n)=r dot n",
    status: statusForBenchmarks(quantumOperatorBenchmarks),
    assumptions: [
      "A pure two-level quantum state is modeled.",
      "Named gates and axis rotations are unitary.",
      "Pauli measurement outcomes are plus or minus one with Born probabilities.",
    ],
    inputUnits: [
      si("alphaMagnitude", "Alpha magnitude", "unitless"),
      si("relativePhase", "Relative phase", "degrees"),
      si("rotationAngle", "Operator rotation", "degrees"),
    ],
    outputUnits: [
      si("probabilityPlus", "Plus probability", "unitless"),
      si("probabilityMinus", "Minus probability", "unitless"),
      si("expectation", "Pauli expectation", "unitless"),
    ],
    validRanges: [
      {
        id: "alphaMagnitude",
        label: "Alpha magnitude",
        min: 0,
        max: 1,
        unit: "unitless",
      },
      {
        id: "relativePhase",
        label: "Relative phase",
        min: -180,
        max: 180,
        unit: "degrees",
      },
      {
        id: "rotationAngle",
        label: "Rotation angle",
        min: 5,
        max: 180,
        unit: "degrees",
      },
    ],
    benchmarkCases: quantumOperatorBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [],
    warnings: [
      "This lesson visualizes a single ideal qubit; histogram randomness is a seeded sequence of independent prepared copies.",
    ],
  },
  "bohr-model": {
    experimentId: "bohr-model",
    formulaName: "Hydrogenic Bohr transitions",
    formula:
      "En=-13.6057 Z^2/n^2 eV; DeltaEatom=Ef-Ei; Ephoton=|DeltaE|=hf=hc/lambda",
    status: statusForBenchmarks(bohrModelBenchmarks),
    assumptions: [
      "A one-electron hydrogenic ion is modeled.",
      "Levels n=1 through 6 are treated as stationary Bohr energies.",
      "Photon recoil, fine structure, Lamb shift, and linewidth are omitted.",
    ],
    inputUnits: [
      si("atomicNumber", "Nuclear charge", "unitless"),
      si("initialLevel", "Initial principal level", "unitless"),
      si("finalLevel", "Final principal level", "unitless"),
    ],
    outputUnits: [
      si("atomEnergyChangeEv", "Atomic energy change", "eV", "J"),
      si("photonEnergyEv", "Photon energy", "eV", "J"),
      si("wavelengthNm", "Wavelength", "nm", "m"),
      si("frequencyHz", "Frequency", "Hz"),
    ],
    validRanges: [
      {
        id: "atomicNumber",
        label: "Atomic number",
        min: 1,
        max: 3,
        unit: "unitless",
      },
      {
        id: "initialLevel",
        label: "Initial level",
        min: 1,
        max: 6,
        unit: "unitless",
      },
      {
        id: "finalLevel",
        label: "Final level",
        min: 1,
        max: 6,
        unit: "unitless",
      },
    ],
    benchmarkCases: bohrModelBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [],
    warnings: [
      "Displayed wavelengths use the ideal reduced-constant Bohr model and may differ slightly from tabulated air wavelengths.",
    ],
  },
  "de-broglie-wavelength": {
    experimentId: "de-broglie-wavelength",
    formulaName: "de Broglie matter wavelength",
    formula:
      "lambda=h/p; electron lambda=h/sqrt(2 m_e e V); Delta y approximately L lambda/d",
    status: statusForBenchmarks(deBroglieBenchmarks),
    assumptions: [
      "Momentum is nonrelativistic p=mv.",
      "Electron voltage mode neglects relativistic correction.",
      "Diffraction spacing uses the small-angle approximation.",
    ],
    inputUnits: [
      si("speed", "Particle speed", "m/s"),
      si("voltage", "Accelerating voltage", "V"),
      si("spacing", "Slit or plane spacing", "nm", "m"),
    ],
    outputUnits: [
      si("momentum", "Momentum", "kg m/s"),
      si("wavelength", "Wavelength", "pm", "m"),
      si("fringeSpacing", "Fringe spacing", "mm", "m"),
    ],
    validRanges: [
      {
        id: "speed",
        label: "Particle speed",
        min: 1e5,
        max: 1.5e8,
        unit: "m/s",
      },
      {
        id: "voltage",
        label: "Accelerating voltage",
        min: 50,
        max: 5000,
        unit: "V",
      },
      { id: "spacing", label: "Slit spacing", min: 0.2, max: 0.8, unit: "nm" },
    ],
    benchmarkCases: deBroglieBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [],
    warnings: [
      "The classroom model is nonrelativistic; a warning appears when v exceeds 0.2c.",
    ],
  },
  "nuclear-decay": {
    experimentId: "nuclear-decay",
    formulaName: "Exponential radioactive decay",
    formula:
      "N=N0 2^(-t/T_half)=N0 exp(-lambda t); A=lambda N; lambda=ln(2)/T_half",
    status: statusForBenchmarks(nuclearDecayBenchmarks),
    assumptions: [
      "Nuclei decay independently with a constant hazard rate.",
      "Seeded pseudorandom lifetimes make a run exactly repeatable.",
      "Activity is reported per displayed simulation-year for the finite teaching sample.",
    ],
    inputUnits: [
      si("initialNuclei", "Initial nuclei", "count"),
      si("halfLife", "Half-life", "years", "s"),
      si("time", "Elapsed time", "years", "s"),
      si("seed", "Random seed", "unitless"),
    ],
    outputUnits: [
      si("remaining", "Remaining nuclei", "count"),
      si("activity", "Activity", "events/year", "Bq"),
    ],
    validRanges: [
      {
        id: "initialNuclei",
        label: "Initial nuclei",
        min: 100,
        max: 1000,
        unit: "count",
      },
      { id: "halfLife", label: "Half-life", min: 0.01, max: 50, unit: "years" },
      {
        id: "seed",
        label: "Random seed",
        min: 1,
        max: 999999,
        unit: "unitless",
      },
    ],
    benchmarkCases: nuclearDecayBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [],
    warnings: [
      "Finite seeded samples fluctuate around the exponential ensemble expectation; individual decay times are not predictable.",
    ],
  },
  "photoelectric-equation": {
    experimentId: "photoelectric-equation",
    formulaName: "Einstein photoelectric equation",
    formula: "Kmax=max(0,hf-phi)=e|Vs|; f0=phi/h",
    status: statusForBenchmarks(photoelectricBenchmarks),
    assumptions: [
      "Electrons occupy an ideal metal surface with a single work function.",
      "Maximum kinetic energy is set by photon frequency, not intensity.",
      "Photocurrent scales with intensity above threshold and is stopped by the retarding potential.",
    ],
    inputUnits: [
      si("frequency", "Light frequency", "Hz"),
      si("intensity", "Intensity", "%", "unitless"),
      si("workFunction", "Work function", "eV", "J"),
      si("appliedVoltage", "Applied voltage", "V"),
    ],
    outputUnits: [
      si("kineticMax", "Maximum kinetic energy", "eV", "J"),
      si("stoppingPotential", "Stopping potential", "V"),
      si("photocurrent", "Photocurrent", "µA", "A"),
    ],
    validRanges: [
      { id: "wavelength", label: "Wavelength", min: 200, max: 800, unit: "nm" },
      {
        id: "workFunction",
        label: "Work function",
        min: 1.5,
        max: 5.5,
        unit: "eV",
      },
      { id: "intensity", label: "Intensity", min: 0, max: 100, unit: "%" },
      {
        id: "appliedVoltage",
        label: "Applied voltage",
        min: -6,
        max: 2,
        unit: "V",
      },
    ],
    benchmarkCases: photoelectricBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [],
    warnings: [
      "The current-voltage curve is an ideal teaching response; surface-energy distributions and contact potentials are omitted.",
    ],
  },
  "special-relativity-bridge": {
    experimentId: "special-relativity-bridge",
    formulaName: "Lorentz transformations and light clock",
    formula:
      "gamma=1/sqrt(1-beta^2); Delta t=gamma Delta tau; L=L0/gamma; x'=gamma(x-vt); t'=gamma(t-vx/c^2)",
    status: statusForBenchmarks(relativityBenchmarks),
    assumptions: [
      "Frames are inertial and relative motion is one-dimensional.",
      "The light clock is ideal and its mirrors are at rest in the ship frame.",
      "Coordinates use Einstein synchronization in each frame.",
    ],
    inputUnits: [
      si("relativeSpeed", "Relative speed", "fraction of c", "m/s"),
      si("eventSpacing", "Event spacing", "m"),
      si("clockHeight", "Light-clock height", "m"),
    ],
    outputUnits: [
      si("gamma", "Lorentz factor", "unitless"),
      si("time", "Coordinate time", "µs", "s"),
      si("length", "Contracted length", "m"),
      si("interval", "Invariant interval", "m²"),
    ],
    validRanges: [
      {
        id: "relativeSpeed",
        label: "Relative speed",
        min: 0,
        max: 0.99,
        unit: "fraction of c",
      },
      {
        id: "eventSpacing",
        label: "Event spacing",
        min: 100,
        max: 1000,
        unit: "m",
      },
    ],
    benchmarkCases: relativityBenchmarks,
    tolerance: 1e-7,
    graphExpectations: [],
    warnings: [
      "The lesson compares ideal inertial frames; acceleration needed to switch frames is outside this model.",
    ],
  },
  "chaotic-coupled-oscillators": {
    experimentId: "chaotic-coupled-oscillators",
    formulaName: "Nonlinear coupled pendula with geometric spring coupling",
    formula:
      "I_i theta_i''=-m_i g L_i sin(theta_i)-dU_c/dtheta_i-b theta_i'+tau_i(t); U_c=0.5 k(x1-x2)^2",
    status: statusForBenchmarks(chaoticCoupledOscillatorBenchmarks),
    assumptions: [
      "Each bob is a point mass on a massless rigid string with a fixed pivot.",
      "The horizontal coupling spring is ideal and its extension is x1-x2 with x_i=L_i sin(theta_i).",
      "A deterministic fixed-step fourth-order Runge-Kutta method integrates the nonlinear equations.",
    ],
    inputUnits: [
      si("mass1", "Mass one", "kg"),
      si("mass2", "Mass two", "kg"),
      si("length1", "Length one", "m"),
      si("length2", "Length two", "m"),
      si("coupling", "Spring coupling", "N/m"),
      si("damping", "Angular damping", "N·m·s/rad"),
      si("initialAngle1", "Initial angle one", "degrees", "rad"),
      si("initialAngle2", "Initial angle two", "degrees", "rad"),
    ],
    outputUnits: [
      si("angle", "Angular position", "degrees", "rad"),
      si("angularVelocity", "Angular velocity", "rad/s"),
      si("energy", "Mechanical energy", "J"),
      si("beatPeriod", "Energy-transfer period", "s"),
      si("divergence", "Nearby-state separation", "rad"),
    ],
    validRanges: [
      { id: "mass", label: "Bob mass", min: 0.1, max: 0.6, unit: "kg" },
      { id: "length", label: "Pendulum length", min: 0.5, max: 1.3, unit: "m" },
      { id: "coupling", label: "Coupling", min: 0.05, max: 2, unit: "N/m" },
      {
        id: "initialAngle",
        label: "Initial angle",
        min: -140,
        max: 140,
        unit: "degrees",
      },
    ],
    benchmarkCases: chaoticCoupledOscillatorBenchmarks,
    tolerance: 1e-6,
    graphExpectations: [
      {
        id: "time-series",
        label: "Angular time series",
        xLabel: "time",
        yLabel: "angle",
        shape: "qualitative",
      },
      {
        id: "phase-portrait",
        label: "Phase portrait",
        xLabel: "angle",
        yLabel: "angular velocity",
        shape: "qualitative",
      },
    ],
    warnings: [
      "The nearby-state divergence is a sensitivity indicator, not a converged infinite-time Lyapunov exponent.",
    ],
  },
  "calorimetry-mixing": {
    experimentId: "calorimetry-mixing",
    formulaName: "Calorimetry energy balance",
    formula: "Q_i=m_i c_i (T_f-T_i); sum(Q_i)+Q_surroundings=0",
    status: statusForBenchmarks(calorimetryMixingBenchmarks),
    assumptions: [
      "Each sample is internally uniform in temperature.",
      "Specific heats are constant over the selected temperature interval.",
      "Insulated mode exchanges no heat with the surroundings; optional loss follows a lumped Newton-cooling model.",
    ],
    inputUnits: [
      si("hotMass", "Hot mass", "kg"),
      si("hotTemperature", "Hot temperature", "°C", "K"),
      si("coldMass", "Cold mass", "kg"),
      si("coldTemperature", "Cold temperature", "°C", "K"),
      si("specificHeat", "Specific heat", "J/(kg·K)"),
      si("calorimeterCapacity", "Calorimeter heat capacity", "J/K"),
    ],
    outputUnits: [
      si("equilibriumTemperature", "Equilibrium temperature", "°C", "K"),
      si("heat", "Heat transfer", "J"),
      si("closure", "Energy-balance residual", "J"),
    ],
    validRanges: [
      { id: "mass", label: "Sample mass", min: 0.05, max: 0.5, unit: "kg" },
      {
        id: "temperature",
        label: "Sample temperature",
        min: 0,
        max: 95,
        unit: "°C",
      },
      {
        id: "calorimeterCapacity",
        label: "Calorimeter heat capacity",
        min: 0,
        max: 200,
        unit: "J/K",
      },
    ],
    benchmarkCases: calorimetryMixingBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "temperature-time",
        label: "Temperature vs time",
        xLabel: "time",
        yLabel: "temperature",
        shape: "exponential",
      },
    ],
    warnings: [
      "The visual exchange curve is a lumped relaxation model; the final insulated temperature is the exact algebraic energy balance.",
    ],
  },
  "gas-laws": {
    experimentId: "gas-laws",
    formulaName: "Ideal gas and kinetic theory",
    formula: "PV=nRT; <K>=3k_B T/2; v_rms=sqrt(3RT/M)",
    status: statusForBenchmarks(gasLawsBenchmarks),
    assumptions: [
      "The gas is ideal: particle volume and intermolecular forces are neglected.",
      "Temperature is absolute Kelvin temperature.",
      "Drawn particles are scaled packets representing the displayed molar amount.",
    ],
    inputUnits: [
      si("temperature", "Absolute temperature", "K"),
      si("volume", "Gas volume", "L", "m³"),
      si("amount", "Amount of gas", "mol"),
    ],
    outputUnits: [
      si("pressure", "Pressure", "kPa", "Pa"),
      si("speed", "Molecular speed", "m/s"),
      si("energy", "Mean translational kinetic energy", "J"),
      si("work", "Work by gas", "J"),
    ],
    validRanges: [
      {
        id: "temperature",
        label: "Temperature",
        min: 250,
        max: 600,
        unit: "K",
      },
      { id: "volume", label: "Volume", min: 0.75, max: 6.5, unit: "L" },
      {
        id: "particleCount",
        label: "Display particles",
        min: 100,
        max: 300,
        unit: "particles",
      },
    ],
    benchmarkCases: gasLawsBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "process-curve",
        label: "Selected thermodynamic process",
        xLabel: "volume or absolute temperature",
        yLabel: "pressure",
        shape: "qualitative",
      },
      {
        id: "maxwell-boltzmann",
        label: "Molecular speed distribution",
        xLabel: "speed",
        yLabel: "probability density",
        shape: "qualitative",
      },
    ],
    warnings: [
      "The finite drawn particles visualize deterministic elastic wall reflections; they are scaled packets rather than individual molecules in the macroscopic sample.",
    ],
  },
  "heat-and-temperature": {
    experimentId: "heat-and-temperature",
    formulaName: "Sensible heat and thermal equilibrium",
    formula: "Q=mcΔT; T_eq=(C_A T_A+C_B T_B)/(C_A+C_B)",
    status: statusForBenchmarks(heatTemperatureBenchmarks),
    assumptions: [
      "Each sample has a uniform temperature and constant specific heat.",
      "The thermal-contact comparison is insulated from its surroundings.",
      "Phase changes and temperature-dependent material properties are excluded.",
    ],
    inputUnits: [
      si("temperature", "Temperature", "°C", "K"),
      si("mass", "Mass", "kg"),
      si("specificHeat", "Specific heat capacity", "J/(kg·K)"),
      si("heat", "Transferred heat", "J"),
    ],
    outputUnits: [
      si("temperature", "Temperature", "°C", "K"),
      si("heatCapacity", "Heat capacity", "J/K"),
      si("heat", "Transferred heat", "J"),
    ],
    validRanges: [
      {
        id: "temperature",
        label: "Temperature",
        min: -10,
        max: 100,
        unit: "°C",
      },
      { id: "mass", label: "Mass", min: 0.1, max: 2, unit: "kg" },
      { id: "heat", label: "Added heat", min: 1000, max: 20000, unit: "J" },
    ],
    benchmarkCases: heatTemperatureBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "temperature-time",
        label: "Sample temperature response",
        xLabel: "time",
        yLabel: "temperature",
        shape: "qualitative",
      },
    ],
    warnings: [
      "Animation time is pedagogical rather than a heat-transfer-rate model; endpoints come from exact energy balance.",
    ],
  },
  "heat-transfer": {
    experimentId: "heat-transfer",
    formulaName: "Conduction, convection, and thermal radiation",
    formula: "Qdot=kAΔT/L; Qdot=hAΔT; Qdot=εσAF(T_s^4-T_sur^4)",
    status: statusForBenchmarks(heatTransferBenchmarks),
    assumptions: [
      "Conduction is one-dimensional and steady through a uniform rod.",
      "The convection cell is a lumped classroom model whose circulation direction follows buoyancy.",
      "Radiating surfaces are diffuse-grey and exchange with large surroundings using absolute temperature.",
    ],
    inputUnits: [
      si("temperatureDifference", "Temperature difference", "K"),
      si("conductivity", "Thermal conductivity", "W/(m·K)"),
      si("heaterPower", "Fluid heater power", "W"),
      si("emissivity", "Surface emissivity", "1"),
    ],
    outputUnits: [
      si("heatRate", "Heat-transfer rate", "W"),
      si("temperature", "Temperature", "°C", "K"),
      si("coefficient", "Convective heat-transfer coefficient", "W/(m²·K)"),
    ],
    validRanges: [
      {
        id: "temperatureDifference",
        label: "Temperature difference",
        min: 10,
        max: 100,
        unit: "K",
      },
      {
        id: "conductivity",
        label: "Thermal conductivity",
        min: 0.1,
        max: 401,
        unit: "W/(m·K)",
      },
      {
        id: "heaterPower",
        label: "Fluid heater power",
        min: 50,
        max: 500,
        unit: "W",
      },
      { id: "emissivity", label: "Emissivity", min: 0.05, max: 1, unit: "1" },
    ],
    benchmarkCases: heatTransferBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "heat-rate-time",
        label: "Heat-transfer rate approach",
        xLabel: "time",
        yLabel: "heat rate",
        shape: "qualitative",
      },
    ],
    warnings: [
      "Animation time illustrates mechanism and approach to steady transfer; it is not a spatial finite-difference transient solver.",
    ],
  },
  "statistical-ensemble-lab": {
    experimentId: "statistical-ensemble-lab",
    formulaName: "Two-level statistical ensembles",
    formula: "P_can(q)=C(N,q)p^q(1-p)^(N-q); p=(1+exp(βε))^-1",
    status: statusForBenchmarks(statisticalEnsembleBenchmarks),
    assumptions: [
      "Particles are distinguishable, non-interacting, and occupy energy levels 0 or ε.",
      "Canonical samples fix N and β while allowing energy exchange with a large bath.",
      "Grand-canonical particle number is Poisson distributed and excitation follows independent Bernoulli sampling.",
    ],
    inputUnits: [
      si("particleCount", "Target particle count", "particles"),
      si("energyFraction", "Mean excitation energy per particle", "ε"),
      si("samplingDuration", "Sampling duration", "samples"),
    ],
    outputUnits: [
      si("energy", "Total excitation energy", "ε"),
      si("variance", "Energy variance", "ε²"),
      si("probability", "Normalized probability", "1"),
    ],
    validRanges: [
      {
        id: "particleCount",
        label: "Particle count",
        min: 12,
        max: 120,
        unit: "particles",
      },
      {
        id: "energyFraction",
        label: "Energy per particle",
        min: 0.05,
        max: 0.95,
        unit: "ε",
      },
      {
        id: "samplingDuration",
        label: "Sampling duration",
        min: 100,
        max: 5000,
        unit: "samples",
      },
    ],
    benchmarkCases: statisticalEnsembleBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "energy-histogram",
        label: "Energy probability distribution",
        xLabel: "E/ε",
        yLabel: "P(E)",
        shape: "qualitative",
      },
      {
        id: "particle-histogram",
        label: "Particle-number distribution",
        xLabel: "N",
        yLabel: "P(N)",
        shape: "qualitative",
      },
    ],
    warnings: [
      "This is a finite two-level model; it teaches ensemble constraints and convergence rather than a continuous ideal-gas density of states.",
    ],
  },
  "thermodynamic-process": {
    experimentId: "thermodynamic-process",
    formulaName: "Ideal-gas thermodynamic processes",
    formula:
      "PV=nRT; W=integral(P dV); deltaU=Q-W; PV^gamma=constant (adiabatic)",
    status: statusForBenchmarks(thermodynamicProcessBenchmarks),
    assumptions: [
      "The gas is ideal with constant heat capacities over each quasistatic path.",
      "Work W is positive when done by the gas, so the first law is deltaU=Q-W.",
      "The adiabatic path is reversible and uses the selected heat-capacity ratio gamma.",
    ],
    inputUnits: [
      si("pressure", "Initial pressure", "kPa", "Pa"),
      si("volume", "Initial volume", "L", "m^3"),
      si("temperature", "Initial temperature", "K"),
      si("gamma", "Heat-capacity ratio", "unitless"),
    ],
    outputUnits: [
      si("work", "Work by gas", "J"),
      si("heat", "Heat into gas", "J"),
      si("internalEnergy", "Internal-energy change", "J"),
    ],
    validRanges: [
      { id: "pressure", label: "Pressure", min: 80, max: 300, unit: "kPa" },
      { id: "volume", label: "Volume", min: 1, max: 5, unit: "L" },
      {
        id: "temperature",
        label: "Temperature",
        min: 250,
        max: 600,
        unit: "K",
      },
      { id: "gamma", label: "Heat-capacity ratio", min: 1.1, max: 1.67 },
    ],
    benchmarkCases: thermodynamicProcessBenchmarks,
    tolerance: 1e-10,
    graphExpectations: [
      {
        id: "pv-path",
        label: "Pressure-volume path",
        xLabel: "V",
        yLabel: "P",
        shape: "qualitative",
      },
      {
        id: "work-area",
        label: "Signed work area",
        xLabel: "V",
        yLabel: "P",
        shape: "qualitative",
      },
    ],
    warnings: [
      "Animation time parametrizes a quasistatic path; it is not a model of finite-rate heat transfer.",
    ],
  },
  "echo-speed-sound": {
    experimentId: "echo-speed-sound",
    formulaName: "Echo timing and dry-air sound speed",
    formula: "v=2d/delta-t; v(T)=331.3 sqrt((T+273.15)/273.15)",
    status: statusForBenchmarks(echoSpeedSoundBenchmarks),
    assumptions: [
      "Source and timing detector are treated as colocated, so the measured delay spans a complete wall round trip.",
      "Air is dry and still; the temperature relation is an ideal-gas acoustic approximation.",
      "A distinct human-perception echo requires approximately 0.10 seconds separation.",
    ],
    inputUnits: [
      si("distance", "Wall distance", "m"),
      si("temperature", "Air temperature", "°C", "K"),
      si("echoDelay", "Echo delay", "ms", "s"),
    ],
    outputUnits: [
      si("soundSpeed", "Speed of sound", "m/s"),
      si("roundTrip", "Round-trip distance", "m"),
    ],
    validRanges: [
      { id: "distance", label: "Wall distance", min: 5, max: 80, unit: "m" },
      {
        id: "temperature",
        label: "Air temperature",
        min: -10,
        max: 40,
        unit: "°C",
      },
    ],
    benchmarkCases: echoSpeedSoundBenchmarks,
    tolerance: 1e-6,
    graphExpectations: [
      {
        id: "echo-trace",
        label: "Microphone time trace",
        xLabel: "time",
        yLabel: "pressure",
        shape: "qualitative",
      },
    ],
    warnings: [
      "The 0.10 s distinct-echo threshold is perceptual guidance, not a sharp physical boundary.",
    ],
  },
  "em-spectrum": {
    experimentId: "em-spectrum",
    formulaName: "Electromagnetic wave and photon relations",
    formula: "v=f lambda; E=hf; v=c/n",
    status: statusForBenchmarks(emSpectrumBenchmarks),
    assumptions: [
      "Media are treated as transparent, homogeneous and non-dispersive with a fixed refractive index.",
      "Frequency and photon energy remain unchanged at a medium boundary; speed and wavelength change.",
      "Band edges are conventional approximate boundaries rather than sharp natural divisions.",
    ],
    inputUnits: [
      si("frequency", "Frequency", "Hz"),
      si("index", "Refractive index", "unitless"),
      si("amplitude", "Field amplitude", "%", "relative"),
    ],
    outputUnits: [
      si("wavelength", "Wavelength", "m"),
      si("energy", "Photon energy", "eV", "J"),
      si("speed", "Wave speed", "m/s"),
    ],
    validRanges: [
      { id: "frequency", label: "Frequency", min: 1e6, max: 1e20, unit: "Hz" },
    ],
    benchmarkCases: emSpectrumBenchmarks,
    tolerance: 1e-7,
    graphExpectations: [
      {
        id: "log-spectrum",
        label: "Log-frequency spectrum",
        xLabel: "log10 frequency",
        yLabel: "band",
        shape: "qualitative",
      },
    ],
    warnings: [
      "The displayed wave spacing is a logarithmic visual encoding, not a to-scale drawing of wavelength.",
    ],
  },
  "polarization-lab": {
    experimentId: "polarization-lab",
    formulaName: "Ideal polarizers and Malus's law",
    formula: "I=I_p cos^2(theta)",
    status: statusForBenchmarks(polarizationBenchmarks),
    assumptions: [
      "Polarizers are ideal and lossless apart from polarization selection.",
      "Unpolarized and circular input each deliver half their intensity after an ideal linear polarizer.",
      "Linear input is defined at zero degrees; axes repeat every 180 degrees.",
    ],
    inputUnits: [
      si("intensity", "Input intensity", "mW", "W"),
      si("polarizer", "Polarizer angle", "deg", "rad"),
      si("analyzer", "Analyzer angle", "deg", "rad"),
    ],
    outputUnits: [
      si("transmitted", "Transmitted intensity", "mW", "W"),
      si("fraction", "Analyzer transmission", "%", "fraction"),
    ],
    validRanges: [
      {
        id: "intensity",
        label: "Input intensity",
        min: 0.1,
        max: 2,
        unit: "mW",
      },
      { id: "angle", label: "Optic axis angle", min: 0, max: 180, unit: "deg" },
    ],
    benchmarkCases: polarizationBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "malus-curve",
        label: "Transmission versus relative angle",
        xLabel: "angle",
        yLabel: "I/I_p",
        shape: "qualitative",
      },
    ],
    warnings: [
      "The animated field amplitude is visually enlarged and is not drawn to physical scale.",
    ],
  },
  "glass-slab-refraction": {
    experimentId: "glass-slab-refraction",
    formulaName: "Snell refraction and parallel-slab displacement",
    formula: "n1 sin(i)=n2(lambda) sin(r); e=i; d=t sin(i-r)/cos(r)",
    status: statusForBenchmarks(glassSlabBenchmarks),
    assumptions: [
      "The slab faces are plane, parallel, and surrounded by the same medium on both sides.",
      "The ray is paraxial only in width; geometric optics and a Cauchy-like normal-dispersion approximation are used.",
      "Angles are measured from each surface normal.",
    ],
    inputUnits: [
      si("incidence", "Incidence angle", "deg", "rad"),
      si("index", "Reference refractive index", "unitless"),
      si("wavelength", "Vacuum wavelength", "nm", "m"),
      si("thickness", "Slab thickness", "cm", "m"),
    ],
    outputUnits: [
      si("refraction", "Refraction angle", "deg", "rad"),
      si("emergence", "Emergence angle", "deg", "rad"),
      si("shift", "Lateral displacement", "cm", "m"),
      si("speed", "Light speed in slab", "m/s"),
    ],
    validRanges: [
      {
        id: "incidence",
        label: "Incidence angle",
        min: 0,
        max: 75,
        unit: "deg",
      },
      {
        id: "index",
        label: "Reference refractive index",
        min: 1.3,
        max: 1.8,
        unit: "unitless",
      },
      { id: "wavelength", label: "Wavelength", min: 405, max: 650, unit: "nm" },
      {
        id: "thickness",
        label: "Slab thickness",
        min: 0.5,
        max: 3,
        unit: "cm",
      },
    ],
    benchmarkCases: glassSlabBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [],
    warnings: [
      "The wavelength correction is a representative crown-glass dispersion model; real glass requires measured Sellmeier coefficients.",
    ],
  },
  "human-eye-defects": {
    experimentId: "human-eye-defects",
    formulaName: "Reduced eye and corrective-lens power",
    formula: "Ptotal=Peye+Paccommodation+Pcorrection; 1/f=1/u+1/v; P=1/f",
    status: statusForBenchmarks(humanEyeDefectsBenchmarks),
    assumptions: [
      "The cornea and crystalline lens are represented by one thin equivalent lens.",
      "The retina is fixed 17 mm behind the equivalent lens.",
      "Corrective-lens vertex distance is neglected in the school-level model.",
    ],
    inputUnits: [
      si("objectDistance", "Object distance", "m"),
      si("eyePower", "Relaxed eye power", "D", "1/m"),
      si("accommodation", "Accommodation", "D", "1/m"),
      si("correction", "Corrective-lens power", "D", "1/m"),
    ],
    outputUnits: [
      si("imageDistance", "Image distance", "mm", "m"),
      si("focusError", "Retinal focus error", "mm", "m"),
      si("farPoint", "Far point", "m"),
      si("nearPoint", "Near point", "cm", "m"),
    ],
    validRanges: [
      {
        id: "objectDistance",
        label: "Object distance",
        min: 0.25,
        max: 10,
        unit: "m",
      },
      {
        id: "eyePower",
        label: "Relaxed eye power",
        min: 52,
        max: 66,
        unit: "D",
      },
      {
        id: "accommodation",
        label: "Accommodation",
        min: 0,
        max: 10,
        unit: "D",
      },
      {
        id: "correction",
        label: "Corrective-lens power",
        min: -8,
        max: 8,
        unit: "D",
      },
    ],
    benchmarkCases: humanEyeDefectsBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [],
    warnings: [
      "This reduced-eye teaching model does not replace a clinical refraction or prescription.",
    ],
  },
  "lens-formula": {
    experimentId: "lens-formula",
    formulaName: "Cartesian thin-lens equation and magnification",
    formula: "1/f=1/v-1/u; m=v/u=hi/ho; P=1/f(m)",
    status: statusForBenchmarks(lensFormulaBenchmarks),
    assumptions: [
      "The lens is thin and paraxial rays are used.",
      "Light travels left to right; distances are signed from the optical centre.",
      "Aberration and diffraction are omitted.",
    ],
    inputUnits: [
      si("objectDistance", "Object distance magnitude", "cm", "m"),
      si("focalLength", "Focal length magnitude", "cm", "m"),
      si("objectHeight", "Object height", "cm", "m"),
    ],
    outputUnits: [
      si("imageDistance", "Signed image distance", "cm", "m"),
      si("imageHeight", "Signed image height", "cm", "m"),
      si("magnification", "Magnification", "unitless"),
      si("power", "Lens power", "D", "1/m"),
    ],
    validRanges: [
      {
        id: "objectDistance",
        label: "Object distance magnitude",
        min: 10,
        max: 80,
        unit: "cm",
      },
      {
        id: "focalLength",
        label: "Focal length magnitude",
        min: 5,
        max: 30,
        unit: "cm",
      },
      {
        id: "objectHeight",
        label: "Object height",
        min: 1,
        max: 5,
        unit: "cm",
      },
    ],
    benchmarkCases: lensFormulaBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [],
    warnings: [
      "The thin-lens diagram neglects aberrations and finite lens thickness.",
    ],
  },
  "mirror-formula": {
    experimentId: "mirror-formula",
    formulaName: "New Cartesian spherical-mirror formula",
    formula: "1/f=1/v+1/u; m=-v/u=h'/h; R=2f",
    status: statusForBenchmarks(mirrorFormulaBenchmarks),
    assumptions: [
      "Paraxial rays and a spherical mirror are used.",
      "Distances are measured from the pole; rightward is positive.",
      "The object is on the incident-light side, so u is negative.",
    ],
    inputUnits: [
      si("objectDistanceCm", "Object distance magnitude", "cm", "m"),
      si("focalLengthCm", "Focal length magnitude", "cm", "m"),
      si("objectHeightCm", "Object height", "cm", "m"),
    ],
    outputUnits: [
      si("imageDistanceCm", "Signed image distance", "cm", "m"),
      si("imageHeightCm", "Signed image height", "cm", "m"),
      si("magnification", "Signed magnification", "unitless"),
    ],
    validRanges: [
      {
        id: "objectDistanceCm",
        label: "Object distance",
        min: 10,
        max: 100,
        unit: "cm",
      },
      {
        id: "focalLengthCm",
        label: "Focal length",
        min: 10,
        max: 40,
        unit: "cm",
      },
      {
        id: "objectHeightCm",
        label: "Object height",
        min: 1,
        max: 7,
        unit: "cm",
      },
    ],
    benchmarkCases: mirrorFormulaBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "u-v",
        label: "Signed image distance vs signed object distance",
        xLabel: "u",
        yLabel: "v",
        shape: "qualitative",
      },
    ],
    warnings: [
      "The paraxial model omits spherical aberration and finite-thickness effects.",
    ],
  },
  "prism-dispersion": {
    experimentId: "prism-dispersion",
    formulaName: "Two-face prism refraction and Cauchy dispersion",
    formula: "sin(i)=n sin(r1); r1+r2=A; sin(e)=n sin(r2); delta=i+e-A",
    status: statusForBenchmarks(prismDispersionBenchmarks),
    assumptions: [
      "Plane prism faces and geometric-optics rays.",
      "Air refractive index is one.",
      "Material dispersion uses a two-term Cauchy teaching fit over visible wavelengths.",
    ],
    inputUnits: [
      si("apexAngle", "Prism apex angle", "degrees", "rad"),
      si("incidenceAngle", "Angle of incidence", "degrees", "rad"),
      si("wavelength", "Vacuum wavelength", "nm", "m"),
    ],
    outputUnits: [
      si("refractiveIndex", "Refractive index", "unitless"),
      si("deviation", "Deviation angle", "degrees", "rad"),
      si(
        "angularDispersion",
        "Violet-red angular dispersion",
        "degrees",
        "rad",
      ),
    ],
    validRanges: [
      {
        id: "apexAngle",
        label: "Apex angle",
        min: 30,
        max: 75,
        unit: "degrees",
      },
      {
        id: "incidenceAngle",
        label: "Incidence angle",
        min: 20,
        max: 75,
        unit: "degrees",
      },
      {
        id: "wavelength",
        label: "Wavelength",
        min: 410,
        max: 706.5,
        unit: "nm",
      },
    ],
    benchmarkCases: prismDispersionBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "n-lambda",
        label: "Index vs wavelength",
        xLabel: "wavelength",
        yLabel: "refractive index",
        direction: "decreasing",
      },
    ],
    warnings: [
      "The Cauchy coefficients are a visible-range teaching approximation; the ray model omits diffraction and absorption.",
    ],
  },
  "total-internal-reflection": {
    experimentId: "total-internal-reflection",
    formulaName: "Snell refraction, Fresnel power, and critical angle",
    formula: "n1 sin(theta_i)=n2 sin(theta_t); theta_c=asin(n2/n1); R+T=1",
    status: statusForBenchmarks(totalInternalReflectionBenchmarks),
    assumptions: [
      "Geometric optics at a lossless, planar boundary between isotropic media.",
      "Displayed reflectance is the unpolarized average of s and p Fresnel power reflectance.",
      "The fibre bend model applies a stated local-incidence penalty for a teaching-scale curved core.",
    ],
    inputUnits: [
      si("incidenceAngle", "Angle of incidence", "degrees", "rad"),
      si("n1", "Inside refractive index", "unitless"),
      si("n2", "Outside refractive index", "unitless"),
      si("wavelength", "Vacuum wavelength", "nm", "m"),
    ],
    outputUnits: [
      si("criticalAngle", "Critical angle", "degrees", "rad"),
      si("transmissionAngle", "Transmission angle", "degrees", "rad"),
      si("reflectance", "Power reflectance", "percent", "ratio"),
      si("transmittance", "Power transmittance", "percent", "ratio"),
    ],
    validRanges: [
      {
        id: "incidenceAngle",
        label: "Incidence angle",
        min: 0,
        max: 89,
        unit: "degrees",
      },
      {
        id: "n1",
        label: "Inside refractive index",
        min: 1.1,
        max: 1.8,
        unit: "unitless",
      },
      {
        id: "n2",
        label: "Outside refractive index",
        min: 1,
        max: 1.6,
        unit: "unitless",
      },
      { id: "wavelength", label: "Wavelength", min: 400, max: 700, unit: "nm" },
    ],
    benchmarkCases: totalInternalReflectionBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "reflectance-incidence",
        label: "Reflectance vs incidence",
        xLabel: "incidence angle",
        yLabel: "reflectance",
        direction: "increasing",
      },
    ],
    warnings: [
      "The fibre bend penalty is a qualitative local-ray model, not a full electromagnetic waveguide solver.",
    ],
  },
  "reflection-plane-mirror": {
    experimentId: "reflection-plane-mirror",
    formulaName: "Vector reflection and finite plane-mirror visibility",
    formula: "d_reflected=d_incident-2(d_incident·n)n; P_image=P-2(P·n)n",
    status: statusForBenchmarks(reflectionPlaneMirrorBenchmarks),
    assumptions: [
      "The mirror is planar, specular, and centred at the origin.",
      "Rays have zero thickness and travel in a two-dimensional horizontal plane.",
      "Visibility requires the sightline to intersect the finite mirror segment.",
    ],
    inputUnits: [
      si("mirrorAngle", "Mirror angle", "degrees", "rad"),
      si("objectPosition", "Object position", "cm", "m"),
      si("rayAngle", "Incident-ray direction", "degrees", "rad"),
      si("observerPosition", "Observer position", "cm", "m"),
    ],
    outputUnits: [
      si("incidenceAngle", "Angle of incidence", "degrees", "rad"),
      si("reflectionAngle", "Angle of reflection", "degrees", "rad"),
      si("imageDistance", "Perpendicular image distance", "cm", "m"),
      si("observerMiss", "Observer distance from reflected ray", "cm", "m"),
    ],
    validRanges: [
      {
        id: "mirrorAngle",
        label: "Mirror angle",
        min: -20,
        max: 20,
        unit: "degrees",
      },
      {
        id: "objectX",
        label: "Object x position",
        min: -18,
        max: -4,
        unit: "cm",
      },
      {
        id: "objectY",
        label: "Object y position",
        min: -8,
        max: 8,
        unit: "cm",
      },
      {
        id: "rayAngle",
        label: "Ray direction",
        min: -35,
        max: 35,
        unit: "degrees",
      },
      {
        id: "observerX",
        label: "Observer x position",
        min: -18,
        max: -4,
        unit: "cm",
      },
      {
        id: "observerY",
        label: "Observer y position",
        min: -9,
        max: 9,
        unit: "cm",
      },
    ],
    benchmarkCases: reflectionPlaneMirrorBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [],
    warnings: [
      "The ray construction is a top-down geometric-optics model; diffraction, mirror thickness, and eye aperture are omitted.",
    ],
  },
  "shadows-eclipses": {
    experimentId: "shadows-eclipses",
    formulaName: "Angular-size and finite-source eclipse geometry",
    formula: "theta=2 atan(R/d); L_umbra=d R_occ/(R_source-R_occ)",
    status: statusForBenchmarks(shadowsEclipsesBenchmarks),
    assumptions: [
      "The Sun, Earth, and Moon are spherical and light travels in straight lines.",
      "Astronomical calculations use mean centre-to-centre distances and a two-dimensional alignment plane.",
      "Observer latitude contributes lunar horizontal parallax; solar parallax is neglected at this scale.",
    ],
    inputUnits: [
      si("sunRadiusScale", "Sun-radius scale", "ratio"),
      si("moonDistanceScale", "Moon-distance scale", "ratio"),
      si("alignment", "Orbital alignment", "degrees", "rad"),
      si("observerLatitude", "Observer latitude", "degrees", "rad"),
    ],
    outputUnits: [
      si("sunAngularDiameter", "Sun angular diameter", "degrees", "rad"),
      si("moonAngularDiameter", "Moon angular diameter", "degrees", "rad"),
      si("apparentSeparation", "Apparent centre separation", "degrees", "rad"),
      si("umbraRadius", "Umbra radius at target", "km", "m"),
    ],
    validRanges: [
      {
        id: "sunRadiusScale",
        label: "Sun size",
        min: 0.8,
        max: 1.2,
        unit: "ratio",
      },
      {
        id: "moonDistanceScale",
        label: "Moon distance",
        min: 0.85,
        max: 1.15,
        unit: "ratio",
      },
      {
        id: "alignment",
        label: "Alignment",
        min: -1.2,
        max: 1.2,
        unit: "degrees",
      },
      {
        id: "observerLatitude",
        label: "Observer latitude",
        min: -60,
        max: 60,
        unit: "degrees",
      },
    ],
    benchmarkCases: shadowsEclipsesBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [],
    warnings: [
      "The astronomical stage is schematic and not to visual scale; calculations use stated physical radii and mean distances.",
    ],
  },
  "multiple-reflection": {
    experimentId: "multiple-reflection",
    formulaName: "Conditional image count for two inclined plane mirrors",
    formula:
      "N=360°/theta-1 for exact even/centered sectors; otherwise N=floor(360°/theta)",
    status: statusForBenchmarks(multipleReflectionBenchmarks),
    assumptions: [
      "Ideal plane mirrors meet along one line.",
      "The standard finite image-count rule assumes an object between the mirrors.",
      "The odd-integer case depends on whether the object lies on the angle bisector.",
    ],
    inputUnits: [
      si("angleDeg", "Angle between mirrors", "degrees", "rad"),
      si("radiusCm", "Object distance from vertex", "cm", "m"),
      si("positionPercent", "Object position across wedge", "%"),
    ],
    outputUnits: [
      si("imageCount", "Virtual image count", "count"),
      si("symmetryOrder", "Rotational symmetry order", "count"),
    ],
    validRanges: [
      {
        id: "angleDeg",
        label: "Mirror angle",
        min: 30,
        max: 120,
        unit: "degrees",
      },
      {
        id: "radiusCm",
        label: "Object radial position",
        min: 2,
        max: 10,
        unit: "cm",
      },
      {
        id: "positionPercent",
        label: "Position across wedge",
        min: 10,
        max: 90,
        unit: "%",
      },
    ],
    benchmarkCases: multipleReflectionBenchmarks,
    tolerance: 0,
    graphExpectations: [],
    warnings: [
      "A three-mirror kaleidoscope forms an extended tiling; the finite N count displayed is explicitly the active two-mirror wedge result.",
    ],
  },
  "optical-instruments": {
    experimentId: "optical-instruments",
    formulaName: "Compound microscope and astronomical telescope magnification",
    formula: "Mmic=m_o M_e; m_o=-v_o/u_o; Mtel=-f_o/f_e; Lnormal=f_o+f_e",
    status: statusForBenchmarks(opticalInstrumentsBenchmarks),
    assumptions: [
      "Thin paraxial objective and eyepiece lenses.",
      "The astronomical telescope uses two converging lenses and gives an inverted final image.",
      "The conventional least distance of distinct vision is D=250 mm.",
    ],
    inputUnits: [
      si("objectiveFocalMm", "Objective focal length", "mm", "m"),
      si("eyepieceFocalMm", "Eyepiece focal length", "mm", "m"),
      si("tubeLengthMm", "Objective-eyepiece separation", "mm", "m"),
      si("focusOffsetMm", "Fine-focus displacement", "mm", "m"),
    ],
    outputUnits: [
      si("magnification", "Signed total magnification", "unitless"),
      si("focusErrorMm", "Signed focus error", "mm", "m"),
      si("resolutionUm", "Microscope diffraction resolution", "um", "m"),
    ],
    validRanges: [
      {
        id: "objectiveFocalMm",
        label: "Objective focal length",
        min: 5,
        max: 800,
        unit: "mm",
      },
      {
        id: "eyepieceFocalMm",
        label: "Eyepiece focal length",
        min: 10,
        max: 50,
        unit: "mm",
      },
      {
        id: "tubeLengthMm",
        label: "Tube length",
        min: 90,
        max: 850,
        unit: "mm",
      },
    ],
    benchmarkCases: opticalInstrumentsBenchmarks,
    tolerance: 1e-10,
    graphExpectations: [],
    warnings: [
      "The paraxial model omits aberrations; microscope resolution uses Rayleigh's criterion at 550 nm.",
    ],
  },
  "free-fall": {
    experimentId: "free-fall",
    formulaName: "Vertical motion under gravity",
    formula: "y=y0+v0t−½gt²; v=v0−gt; a=−g",
    status: statusForBenchmarks(freeFallBenchmarks),
    assumptions: [
      "Upward is positive.",
      "Ideal mode uses uniform gravity and neglects drag.",
      "Air-resistance mode uses deterministic quadratic drag.",
    ],
    inputUnits: [
      si("height", "Initial height", "m"),
      si("velocity", "Initial velocity", "m/s"),
      si("gravity", "Gravity", "m/s²"),
    ],
    outputUnits: [
      si("position", "Height", "m"),
      si("velocity-out", "Velocity", "m/s"),
      si("acceleration", "Acceleration", "m/s²"),
      si("time", "Impact time", "s"),
    ],
    validRanges: [
      { id: "height", label: "Initial height", min: 2, max: 50, unit: "m" },
      {
        id: "velocity",
        label: "Initial velocity",
        min: -15,
        max: 15,
        unit: "m/s",
      },
      { id: "gravity", label: "Gravity", min: 1.62, max: 24.79, unit: "m/s²" },
    ],
    benchmarkCases: freeFallBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "position-time",
        label: "Position versus time",
        xLabel: "Time (s)",
        yLabel: "Height (m)",
        shape: "quadratic",
      },
    ],
    warnings: [
      "The optional drag coefficient is a simplified teaching value, not a selected object's measured ballistic coefficient.",
    ],
  },
  "distance-time-graph": {
    experimentId: "distance-time-graph",
    formulaName: "Piecewise distance-time slope",
    formula: "speed=Δd/Δt",
    status: statusForBenchmarks(distanceTimeBenchmarks),
    assumptions: [
      "Each segment has constant speed and positive duration.",
      "Distance-only mode forbids negative slope; position mode permits return motion.",
      "Adjacent segments share endpoints, so instantaneous distance jumps are impossible.",
    ],
    inputUnits: [
      si("duration", "Segment duration", "s"),
      si("slope", "Segment slope", "m/s"),
    ],
    outputUnits: [
      si("distance", "Distance or position", "m"),
      si("speed", "Segment speed", "m/s"),
    ],
    validRanges: [
      {
        id: "duration",
        label: "Segment duration",
        min: 0.5,
        max: 8,
        unit: "s",
      },
      { id: "speed", label: "Segment speed", min: -5, max: 5, unit: "m/s" },
    ],
    benchmarkCases: distanceTimeBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "piecewise",
        label: "Continuous piecewise linear journey",
        xLabel: "Time (s)",
        yLabel: "Distance / position (m)",
        shape: "qualitative",
      },
    ],
    warnings: [
      "Negative slopes describe position returning toward the origin, not accumulated path distance.",
    ],
  },
  "balanced-unbalanced-forces": {
    experimentId: "balanced-unbalanced-forces",
    formulaName: "Newton's second law with friction",
    formula: "ΣFx=Fright−Fleft+Ffriction=ma; N−mg=0",
    status: statusForBenchmarks(balancedForcesBenchmarks),
    assumptions: [
      "The track is horizontal, so normal force equals weight.",
      "Kinetic friction opposes velocity; static friction opposes impending motion up to its limit.",
      "Forces are collinear and the cart is represented as a particle in translation.",
    ],
    inputUnits: [
      si("left-force", "Left force", "N"),
      si("right-force", "Right force", "N"),
      si("mass", "Cart mass", "kg"),
      si("friction", "Friction coefficient", "dimensionless"),
    ],
    outputUnits: [
      si("net-force", "Net force", "N"),
      si("acceleration", "Acceleration", "m/s²"),
      si("velocity", "Velocity", "m/s"),
    ],
    validRanges: [
      { id: "force", label: "Applied force", min: 0, max: 300, unit: "N" },
      { id: "mass", label: "Cart mass", min: 10, max: 100, unit: "kg" },
      {
        id: "friction",
        label: "Friction coefficient",
        min: 0,
        max: 0.5,
        unit: "dimensionless",
      },
    ],
    benchmarkCases: balancedForcesBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "velocity-time",
        label: "Velocity history",
        xLabel: "Time (s)",
        yLabel: "Velocity (m/s)",
        shape: "qualitative",
      },
    ],
    warnings: [
      "The surface presets use simplified representative friction coefficients, not material-pair reference data.",
    ],
  },
  "measurement-errors": {
    experimentId: "measurement-errors",
    formulaName: "Repeated measurement and uncertainty",
    formula: "xbar=Σxi/n; Δx=sqrt[(s/sqrt(n))²+(LC/2)²]; ΔA/A=2Δx/x",
    status: statusForBenchmarks(measurementErrorBenchmarks),
    assumptions: [
      "Instrument resolution is represented by half the selected least count.",
      "Independent random and instrument uncertainties combine in quadrature.",
      "The area example uses A=x² with first-order propagation.",
    ],
    inputUnits: [
      si("dimension", "True dimension", "mm", "m"),
      si("least-count", "Least count", "mm", "m"),
      si("zero-error", "Zero error", "mm", "m"),
    ],
    outputUnits: [
      si("mean", "Corrected mean", "mm", "m"),
      si("uncertainty", "Combined uncertainty", "mm", "m"),
      si("percentage", "Percentage error", "%"),
    ],
    validRanges: [
      { id: "dimension", label: "True dimension", min: 5, max: 80, unit: "mm" },
      {
        id: "least-count",
        label: "Least count",
        min: 0.01,
        max: 1,
        unit: "mm",
      },
      {
        id: "trials",
        label: "Repeated trials",
        min: 1,
        max: 12,
        unit: "readings",
      },
    ],
    benchmarkCases: measurementErrorBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "trials",
        label: "Repeated corrected readings",
        xLabel: "Trial",
        yLabel: "Length (mm)",
        shape: "qualitative",
      },
    ],
    warnings: [
      "Trial scatter is deterministic for reproducible teaching; real instruments also include calibration and operator effects.",
    ],
  },
  "computational-physics-workflow": {
    experimentId: "computational-physics-workflow",
    formulaName: "Numerical model-discretize-solve-verify workflow",
    formula: "error=RMS(unumerical-ureference); λ=αΔt/Δx²≤1/2 for FTCS",
    status: statusForBenchmarks(computationalWorkflowBenchmarks),
    assumptions: [
      "The diffusion reference is the decaying sine eigenmode on a unit interval.",
      "The oscillator reference is x(t)=cos(t).",
      "Work cost counts grid updates and solver iterations rather than wall-clock hardware time.",
    ],
    inputUnits: [
      si("mesh", "Mesh cells", "cells"),
      si("time-step", "Time step", "s"),
      si("tolerance", "Solver tolerance", "dimensionless"),
    ],
    outputUnits: [
      si("error", "RMS error", "m"),
      si("cost", "Compute cost", "work units"),
    ],
    validRanges: [
      { id: "mesh", label: "Mesh cells", min: 10, max: 80, unit: "cells" },
      {
        id: "time-step",
        label: "Time step",
        min: 0.0005,
        max: 0.02,
        unit: "s",
      },
      {
        id: "tolerance",
        label: "Tolerance",
        min: 1e-7,
        max: 1e-3,
        unit: "dimensionless",
      },
    ],
    benchmarkCases: computationalWorkflowBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "convergence",
        label: "RMS error versus timestep",
        xLabel: "Δt (s)",
        yLabel: "RMS error",
        shape: "qualitative",
      },
    ],
    warnings: [
      "Runtime cost is deterministic algorithmic work, not a benchmark of the learner's device.",
    ],
  },
  "magnetic-field-current": {
    experimentId: "magnetic-field-current",
    formulaName: "Magnetic field of wires and coils",
    formula:
      "Bwire=μ0I/(2πr); Bloop=μ0IR²/[2(R²+x²)^(3/2)]; Bsolenoid≈μ0(N/L)I",
    status: statusForBenchmarks(magneticFieldCurrentBenchmarks),
    assumptions: [
      "The straight conductors are long relative to probe distance.",
      "The loop and finite solenoid share a central symmetry axis.",
      "Fields superpose component by component in air.",
    ],
    inputUnits: [
      si("current", "Conventional current", "A"),
      si("probe-x", "Probe x position", "cm", "m"),
      si("probe-y", "Probe y position", "cm", "m"),
    ],
    outputUnits: [
      si("field", "Magnetic flux density", "μT", "T"),
      si("angle", "Field direction", "°", "rad"),
    ],
    validRanges: [
      { id: "current", label: "Current", min: 0, max: 5, unit: "A" },
      { id: "probe-x", label: "Probe x", min: -0.1, max: 0.1, unit: "m" },
      { id: "probe-y", label: "Probe y", min: -0.1, max: 0.1, unit: "m" },
    ],
    benchmarkCases: magneticFieldCurrentBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "field-distance",
        label: "Straight-wire field versus distance",
        xLabel: "Distance (m)",
        yLabel: "B (T)",
        shape: "inverse",
      },
    ],
    warnings: [
      "The solenoid uses an on-axis finite-length expression; fringe fields and compass disturbance are omitted.",
    ],
  },
  "lorentz-force": {
    experimentId: "lorentz-force",
    formulaName: "Electric and magnetic Lorentz force",
    formula: "F⃗=q(E⃗+v⃗×B⃗); r=mv⊥/(|q|B); vselector=E/B",
    status: statusForBenchmarks(lorentzForceBenchmarks),
    assumptions: [
      "Uniform crossed electric and magnetic fields act in a vacuum chamber.",
      "Relativistic corrections, radiation and collisions are negligible over the displayed speed range.",
      "Trajectory samples use deterministic fourth-order Runge–Kutta integration in SI units.",
    ],
    inputUnits: [
      si("speed", "Particle speed", "m/s"),
      si("electric-field", "Electric field", "N/C"),
      si("magnetic-field", "Magnetic flux density", "T"),
      si("angle", "Velocity angle to B", "°", "rad"),
    ],
    outputUnits: [
      si("force", "Lorentz force", "N"),
      si("radius", "Magnetic radius", "m"),
      si("period", "Cyclotron period", "s"),
    ],
    validRanges: [
      { id: "speed", label: "Speed", min: 5e5, max: 5e6, unit: "m/s" },
      {
        id: "electric-field",
        label: "Electric field",
        min: -5e5,
        max: 5e5,
        unit: "N/C",
      },
      {
        id: "magnetic-field",
        label: "Magnetic field",
        min: -0.5,
        max: 0.5,
        unit: "T",
      },
      { id: "angle", label: "Velocity angle", min: 0, max: 180, unit: "°" },
    ],
    benchmarkCases: lorentzForceBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "trajectory",
        label: "Integrated particle trajectory",
        xLabel: "position (m)",
        yLabel: "transverse position (m)",
        shape: "qualitative",
      },
    ],
    warnings: [
      "The chamber projection is scaled to keep microscopic electron and macroscopic proton paths legible; numeric readouts remain in SI units.",
    ],
  },
  electromagnet: {
    experimentId: "electromagnet",
    formulaName: "Electromagnet magnetic circuit",
    formula: "B≈μ0NI/(g+ℓcore/μr); F≈B²A/(2μ0)",
    status: statusForBenchmarks(electromagnetBenchmarks),
    assumptions: [
      "Uniform core cross-section and concentrated air gap.",
      "Material saturation is represented by a smooth tanh limit.",
      "Lift force includes a fixed contact/fringing efficiency for the classroom rig.",
    ],
    inputUnits: [
      si("current", "Coil current", "A"),
      si("turns", "Coil turns", "turns"),
      si("gap", "Air gap", "mm", "m"),
    ],
    outputUnits: [
      si("field", "Flux density", "T"),
      si("force", "Lift force", "N"),
      si("temperature", "Coil temperature", "°C"),
    ],
    validRanges: [
      { id: "current", label: "Current", min: 0, max: 5, unit: "A" },
      { id: "turns", label: "Turns", min: 100, max: 2000, unit: "turns" },
      { id: "gap", label: "Air gap", min: 0, max: 10, unit: "mm" },
    ],
    benchmarkCases: electromagnetBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "field-current",
        label: "Flux density versus current",
        xLabel: "Current (A)",
        yLabel: "B (T)",
        shape: "qualitative",
      },
    ],
    warnings: [
      "Lift count is an idealized static-contact estimate; leakage, hysteresis, washer geometry and transient mechanics are simplified.",
    ],
  },
  "force-and-pressure": {
    experimentId: "force-and-pressure",
    formulaName: "Contact pressure",
    formula: "P=F/A; Ntotal=Fapplied",
    status: statusForBenchmarks(contactPressureBenchmarks),
    assumptions: [
      "Applied load is uniformly distributed over the stated contact area.",
      "The force is perpendicular to the surface.",
      "Material response is represented by small-strain P/E compression.",
    ],
    inputUnits: [
      si("force", "Applied force", "N"),
      si("area", "Contact area", "m²"),
      si("modulus", "Surface modulus", "Pa"),
    ],
    outputUnits: [
      si("pressure", "Average pressure", "Pa"),
      si("deformation", "Surface deformation", "mm", "m"),
    ],
    validRanges: [
      { id: "force", label: "Applied force", min: 0, max: 2000, unit: "N" },
      { id: "area", label: "Contact area", min: 0.005, max: 0.16, unit: "m²" },
    ],
    benchmarkCases: contactPressureBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "pressure-area",
        label: "Pressure versus area",
        xLabel: "Area (m²)",
        yLabel: "Pressure (Pa)",
        shape: "inverse",
      },
    ],
    warnings: [
      "The heatmap assumes uniform average loading; edge stress concentrations and nonlinear material behavior are omitted.",
    ],
  },
  "fluid-pressure": {
    experimentId: "fluid-pressure",
    formulaName: "Hydrostatic pressure with depth",
    formula: "P=P0+ρgh; vjet=√(2gh)",
    status: statusForBenchmarks(fluidPressureBenchmarks),
    assumptions: [
      "Fluid is static, incompressible and of uniform density.",
      "Surface pressure is spatially uniform.",
      "Jet range neglects viscosity, contraction and air drag.",
    ],
    inputUnits: [
      si("density", "Fluid density", "kg/m³"),
      si("depth", "Depth below surface", "m"),
      si("gravity", "Gravity", "m/s²"),
      si("surfacePressure", "Surface pressure", "kPa", "Pa"),
    ],
    outputUnits: [
      si("pressure", "Pressure", "kPa", "Pa"),
      si("speed", "Jet speed", "m/s"),
      si("force", "Normal force", "kN", "N"),
    ],
    validRanges: [
      { id: "density", label: "Density", min: 500, max: 1500, unit: "kg/m³" },
      { id: "depth", label: "Depth", min: 0, max: 2, unit: "m" },
      { id: "gravity", label: "Gravity", min: 1.62, max: 24.79, unit: "m/s²" },
    ],
    benchmarkCases: fluidPressureBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "pressure-depth",
        label: "Gauge pressure versus depth",
        xLabel: "Depth (m)",
        yLabel: "Pressure (kPa)",
        shape: "linear",
      },
    ],
    warnings: [
      "Dynamic fill, pressure-gradient reveal and jets are teaching animations; transient waves and viscous losses are omitted.",
    ],
  },
  "density-float-sink": {
    experimentId: "density-float-sink",
    formulaName: "Density and layer-specific buoyancy",
    formula: "ρ=m/V; Fb=ρfluid gVdisplaced; ΣFy=Fb−W",
    status: statusForBenchmarks(densityTankBenchmarks),
    assumptions: [
      "Fluid layers are immiscible and density-stratified.",
      "The object has uniform average density.",
      "Interface equilibrium uses a quasi-static two-fluid force balance.",
    ],
    inputUnits: [
      si("mass", "Object mass", "g", "kg"),
      si("volume", "Object volume", "cm³", "m³"),
      si("density", "Fluid density", "kg/m³"),
      si("depth", "Tank depth", "%", "fraction"),
    ],
    outputUnits: [
      si("objectDensity", "Object density", "kg/m³"),
      si("force", "Force", "N"),
      si("depth", "Equilibrium depth", "cm", "m"),
    ],
    validRanges: [
      { id: "mass", label: "Mass", min: 10, max: 1000, unit: "g" },
      { id: "volume", label: "Volume", min: 10, max: 1000, unit: "cm³" },
      {
        id: "fluidDensity",
        label: "Single-fluid density",
        min: 500,
        max: 1400,
        unit: "kg/m³",
      },
    ],
    benchmarkCases: densityTankBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [],
    warnings: [
      "Splash and damping are illustrative; drag coefficients, capillarity, mixing and exact shape-dependent hydrodynamics are omitted.",
    ],
  },
  buoyancy: {
    experimentId: "buoyancy",
    formulaName: "Archimedes buoyant force and floating equilibrium",
    formula:
      "Fb=ρfluid gVdisplaced; W=ρobject gVobject; Vdisplaced/Vobject=ρobject/ρfluid at floating equilibrium",
    status: statusForBenchmarks(buoyancyBenchmarks),
    assumptions: [
      "Fluid and object densities are uniform.",
      "The object remains upright and the water is incompressible.",
      "The floating-fraction relation applies only when object density does not exceed fluid density.",
    ],
    inputUnits: [
      si("objectDensity", "Object density", "kg/m³"),
      si("fluidDensity", "Fluid density", "kg/m³"),
      si("volume", "Object volume", "cm³", "m³"),
      si("immersion", "Immersed fraction", "%", "fraction"),
    ],
    outputUnits: [
      si("force", "Force", "N"),
      si("displacedVolume", "Displaced volume", "cm³", "m³"),
      si("floatingFraction", "Floating fraction", "%", "fraction"),
    ],
    validRanges: [
      {
        id: "objectDensity",
        label: "Object density",
        min: 100,
        max: 8000,
        unit: "kg/m³",
      },
      {
        id: "fluidDensity",
        label: "Fluid density",
        min: 500,
        max: 1500,
        unit: "kg/m³",
      },
      { id: "volume", label: "Object volume", min: 20, max: 500, unit: "cm³" },
      {
        id: "immersion",
        label: "Immersed fraction",
        min: 0,
        max: 100,
        unit: "%",
      },
    ],
    benchmarkCases: buoyancyBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "force-immersion",
        label: "Force versus immersed fraction",
        xLabel: "Immersed fraction",
        yLabel: "Force (N)",
        shape: "linear",
      },
    ],
    warnings: [
      "Entry and settling animation is a damped teaching sequence; viscosity, added mass, waves, rotation and container-wall effects are omitted.",
    ],
  },
  "bernoulli-fluid-flow": {
    experimentId: "bernoulli-fluid-flow",
    formulaName: "Continuity and Bernoulli streamline energy",
    formula: "A₁v₁=A₂v₂=A₃v₃=Q; P+½ρv²+ρgh=constant",
    status: statusForBenchmarks(bernoulliBenchmarks),
    assumptions: [
      "Steady, incompressible, inviscid flow.",
      "Stations lie along one streamline with no pump work or friction loss between them.",
      "Cavitation warning uses water vapor pressure 2.34 kPa absolute.",
    ],
    inputUnits: [
      si("pressure", "Absolute inlet pressure", "kPa", "Pa"),
      si("flowRate", "Volumetric flow rate", "L/s", "m³/s"),
      si("radius", "Pipe radius", "mm", "m"),
      si("density", "Fluid density", "kg/m³"),
      si("elevation", "Elevation", "m"),
    ],
    outputUnits: [
      si("velocity", "Flow velocity", "m/s"),
      si("pressure", "Station pressure", "kPa", "Pa"),
      si("energy", "Bernoulli energy density", "kPa", "Pa"),
    ],
    validRanges: [
      {
        id: "pressure",
        label: "Inlet pressure",
        min: 20,
        max: 200,
        unit: "kPa abs",
      },
      { id: "flowRate", label: "Flow rate", min: 0.2, max: 3, unit: "L/s" },
      { id: "radius", label: "Pipe radius", min: 8, max: 40, unit: "mm" },
      { id: "density", label: "Density", min: 500, max: 1500, unit: "kg/m³" },
      { id: "elevation", label: "Elevation", min: 0, max: 3, unit: "m" },
    ],
    benchmarkCases: bernoulliBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "station-pressure",
        label: "Pressure and speed by station",
        xLabel: "station",
        yLabel: "P, v",
        shape: "qualitative",
      },
    ],
    warnings: [
      "Viscosity, turbulence, pipe loss, pump head between stations and vapor-pressure variation with temperature are omitted.",
    ],
  },
  "sources-of-energy": {
    experimentId: "sources-of-energy",
    formulaName: "Hourly grid dispatch and storage energy balance",
    formula:
      "ΣPgen+Pdischarge+Punmet=Pdemand+Pcharge; Estored=ηcEcharge; Edelivered=ηdEwithdrawn",
    status: statusForBenchmarks(energyGridBenchmarks),
    assumptions: [
      "Each time step represents one hour, so GW × 1 h is GWh.",
      "Storage round-trip efficiency is 90%, split equally between charge and discharge.",
      "Emissions are lifecycle-average factors and costs are variable generation costs in 2026-independent teaching units.",
    ],
    inputUnits: [
      si("capacity", "Installed capacity", "GW"),
      si("demand", "Demand", "GW"),
      si("storage", "Storage energy", "GWh"),
      si("reliability", "Reliability target", "%"),
    ],
    outputUnits: [
      si("energy", "Daily energy", "GWh"),
      si("emissions", "CO₂e intensity", "g/kWh"),
      si("cost", "Average variable cost", "$/MWh"),
      si("reliability", "Served demand", "%"),
    ],
    validRanges: [
      {
        id: "capacity",
        label: "Each source capacity",
        min: 0,
        max: 10,
        unit: "GW",
      },
      {
        id: "demandScale",
        label: "Demand scale",
        min: 50,
        max: 150,
        unit: "%",
      },
      {
        id: "storageCapacity",
        label: "Storage capacity",
        min: 0,
        max: 20,
        unit: "GWh",
      },
      {
        id: "storagePower",
        label: "Storage power",
        min: 0,
        max: 5,
        unit: "GW",
      },
    ],
    benchmarkCases: energyGridBenchmarks,
    tolerance: 1e-10,
    graphExpectations: [
      {
        id: "daily-dispatch",
        label: "Generation and demand through one day",
        xLabel: "hour",
        yLabel: "GW",
        shape: "qualitative",
      },
    ],
    warnings: [
      "This is a deterministic one-day dispatch model; transmission constraints, start-up/ramp limits, capital costs, weather uncertainty and fuel supply are omitted.",
    ],
  },
  "semiconductor-diode": {
    experimentId: "semiconductor-diode",
    formulaName: "Shockley diode and capacitor-filter rectifier",
    formula:
      "ID=Is(e^(VD/nVT)−1); VT=kT/q; fripple=f or 2f; Vr(pp)≈Iload/(fripple C)",
    status: statusForBenchmarks(diodeBenchmarks),
    assumptions: [
      "Silicon PN junction with ideality factor n=2 in the instructional Shockley model.",
      "Reverse breakdown is outside the −5 V explorer range.",
      "Rectifier source and capacitor are ideal apart from junction drops and the displayed diode limits.",
    ],
    inputUnits: [
      si("biasVoltage", "Junction bias", "V"),
      si("temperature", "Temperature", "°C", "K"),
      si("acAmplitude", "AC peak amplitude", "V"),
      si("load", "Load resistance", "Ω"),
      si("capacitance", "Filter capacitance", "µF", "F"),
    ],
    outputUnits: [
      si("current", "Junction current", "mA", "A"),
      si("depletionWidth", "Depletion width", "µm", "m"),
      si("dcVoltage", "DC output", "V"),
      si("ripple", "Ripple peak-to-peak", "V"),
    ],
    validRanges: [
      { id: "biasVoltage", label: "Bias voltage", min: -5, max: 1, unit: "V" },
      { id: "doping", label: "Doping factor", min: 0.5, max: 2, unit: "×" },
      {
        id: "temperature",
        label: "Temperature",
        min: -20,
        max: 125,
        unit: "°C",
      },
      { id: "load", label: "Load resistance", min: 100, max: 5000, unit: "Ω" },
      {
        id: "capacitance",
        label: "Filter capacitance",
        min: 0,
        max: 2200,
        unit: "µF",
      },
    ],
    benchmarkCases: diodeBenchmarks,
    tolerance: 0,
    graphExpectations: [
      {
        id: "iv",
        label: "Diode current versus voltage",
        xLabel: "VD",
        yLabel: "ID",
        shape: "exponential",
      },
      {
        id: "rectified-wave",
        label: "Rectified output versus time",
        xLabel: "t",
        yLabel: "V",
        shape: "qualitative",
      },
    ],
    warnings: [
      "The compact model omits avalanche breakdown, series resistance, recovery time, transformer regulation and equivalent-series resistance of the filter capacitor.",
    ],
  },
  "logic-gates": {
    experimentId: "logic-gates",
    formulaName: "Boolean logic and propagation delay",
    formula: "Y=f(A,B); Yobserved(t)=f[A(t−tp),B(t−tp)]",
    status: statusForBenchmarks(logicGatesBenchmarks),
    assumptions: [
      "Binary HIGH and LOW are ideal stable logic levels.",
      "A floating input is represented as unknown X, never silently coerced to LOW.",
      "Propagation delay is deterministic and equal for rising and falling edges in this instructional model.",
    ],
    inputUnits: [
      si("logicLevel", "Logic input", "0/1/X"),
      si("clockRate", "Clock rate", "kHz", "Hz"),
      si("propagationDelay", "Propagation delay", "ns", "s"),
    ],
    outputUnits: [si("logicOutput", "Logic output", "0/1/X")],
    validRanges: [
      { id: "clockRate", label: "Clock rate", min: 0.5, max: 5, unit: "kHz" },
      {
        id: "propagationDelay",
        label: "Propagation delay",
        min: 10,
        max: 500,
        unit: "ns",
      },
    ],
    benchmarkCases: logicGatesBenchmarks,
    tolerance: 0,
    graphExpectations: [
      {
        id: "timing",
        label: "Digital input and delayed output versus time",
        xLabel: "t",
        yLabel: "logic level",
        shape: "qualitative",
      },
    ],
    warnings: [
      "The nanosecond delay is visually time-stretched; metastability, noise margins, fan-out and asymmetric edge delays are omitted.",
    ],
  },
  "transformer-lab": {
    experimentId: "transformer-lab",
    formulaName: "Transformer turns, frequency and power relationships",
    formula: "Vs/Vp=Ns/Np; fp=fs; Pin=Pout+Pcore+Pcopper; Φmax=Vp/(4.44fNp)",
    status: statusForBenchmarks(transformerBenchmarks),
    assumptions: [
      "Sinusoidal steady-state AC and rms voltage readings.",
      "The induced winding emf follows the ideal turns ratio; terminal voltage additionally includes coupling and secondary winding resistance.",
      "Core and copper losses use a transparent educational lumped-parameter model.",
    ],
    inputUnits: [
      si("primaryVoltage", "Primary rms voltage", "V"),
      si("frequency", "Supply frequency", "Hz"),
      si("turns", "Winding turns", "turns"),
      si("loadResistance", "Load resistance", "Ω"),
    ],
    outputUnits: [
      si("secondaryVoltage", "Secondary rms voltage", "V"),
      si("current", "Winding current", "A"),
      si("power", "Power", "W"),
      si("flux", "Peak magnetic flux", "mWb", "Wb"),
    ],
    validRanges: [
      {
        id: "primaryVoltage",
        label: "Primary voltage",
        min: 0,
        max: 240,
        unit: "V",
      },
      { id: "frequency", label: "Frequency", min: 20, max: 100, unit: "Hz" },
      {
        id: "primaryTurns",
        label: "Primary turns",
        min: 50,
        max: 1200,
        unit: "turns",
      },
      {
        id: "secondaryTurns",
        label: "Secondary turns",
        min: 20,
        max: 1200,
        unit: "turns",
      },
      {
        id: "loadResistance",
        label: "Load resistance",
        min: 5,
        max: 500,
        unit: "Ω",
      },
    ],
    benchmarkCases: transformerBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "voltage-time",
        label: "Primary and secondary sinusoidal voltage versus time",
        xLabel: "t",
        yLabel: "V",
        shape: "qualitative",
      },
    ],
    warnings: [
      "This is a steady-state instructional model; switching transients, saturation harmonics, leakage inductance and thermal runaway are omitted.",
    ],
  },
  "static-electricity": {
    experimentId: "static-electricity",
    formulaName: "Charge transfer and Coulomb interaction",
    formula: "q=±Ne; F=k|q₁q₂|/r²; E=k|q|/r²; Σq=0",
    status: statusForBenchmarks(staticElectricityBenchmarks),
    assumptions: [
      "Only electrons transfer between materials; nuclei remain fixed.",
      "Objects are point charges for force and field magnitude.",
      "Dry-air breakdown is approximated at 3 MV/m.",
    ],
    inputUnits: [
      si("rubbing", "Rubbing amount", "%"),
      si("separation", "Separation", "m"),
    ],
    outputUnits: [
      si("charge", "Net charge", "µC", "C"),
      si("force", "Coulomb force", "N"),
      si("electricField", "Electric field", "MV/m", "V/m"),
    ],
    validRanges: [
      { id: "rubbing", label: "Rubbing", min: 0, max: 100, unit: "%" },
      { id: "separation", label: "Separation", min: 0.05, max: 2, unit: "m" },
    ],
    benchmarkCases: staticElectricityBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "force-distance",
        label: "Force versus separation",
        xLabel: "r",
        yLabel: "F",
        direction: "decreasing",
      },
    ],
    warnings: [
      "Electron packets are a visualization scale; packet count is not the literal microscopic electron count.",
    ],
  },
  "series-parallel-resistance": {
    experimentId: "series-parallel-resistance",
    formulaName: "Series and parallel resistor networks",
    formula: "R_s=ΣR_i; 1/R_p=Σ(1/R_i); I=ΣI_i; P=VI=ΣI_i²R_i",
    status: statusForBenchmarks(seriesParallelBenchmarks),
    assumptions: [
      "Resistors and source are ideal and ohmic.",
      "Closed switches have zero resistance and open switches infinite resistance.",
      "Connecting wires have negligible resistance.",
    ],
    inputUnits: [
      si("voltage", "Source voltage", "V"),
      si("resistors", "Branch resistance", "Ω"),
    ],
    outputUnits: [
      si("equivalentResistance", "Equivalent resistance", "Ω"),
      si("current", "Current", "A"),
      si("voltageDrop", "Voltage drop", "V"),
      si("power", "Power", "W"),
    ],
    validRanges: [
      { id: "voltage", label: "Voltage", min: 0, max: 24, unit: "V" },
      { id: "resistors", label: "Resistance", min: 1, max: 20, unit: "Ω" },
    ],
    benchmarkCases: seriesParallelBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "current-voltage",
        label: "Network current versus voltage",
        xLabel: "V",
        yLabel: "I",
        shape: "linear",
      },
    ],
    warnings: [
      "Component heating, source internal resistance, and wire/contact resistance are omitted.",
    ],
  },
  "ohms-law": {
    experimentId: "ohms-law",
    formulaName: "Ohm's law and V-I slope",
    formula: "V=IR; for V versus I, slope ΔV/ΔI=R",
    status: statusForBenchmarks(ohmsLawBenchmarks),
    assumptions: [
      "Steady DC measurements.",
      "Ohmic materials have constant temperature coefficients at the selected temperature.",
      "The filament model includes a voltage-dependent hot resistance.",
    ],
    inputUnits: [
      si("voltage", "Supply voltage", "V"),
      si("resistance", "Reference resistance", "Ω"),
      si("temperature", "Temperature", "°C", "K"),
    ],
    outputUnits: [
      si("current", "Current", "A"),
      si("effectiveResistance", "Effective resistance", "Ω"),
      si("power", "Power", "W"),
    ],
    validRanges: [
      { id: "voltage", label: "Voltage", min: 0, max: 12, unit: "V" },
      { id: "resistance", label: "Resistance", min: 1, max: 40, unit: "Ω" },
      {
        id: "temperature",
        label: "Temperature",
        min: -20,
        max: 200,
        unit: "°C",
      },
    ],
    benchmarkCases: ohmsLawBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "voltage-current",
        label: "Voltage versus current",
        xLabel: "I (A)",
        yLabel: "V (V)",
        shape: "linear",
      },
    ],
    warnings: [
      "The filament curve is a deterministic classroom hot-resistance model, not a specific commercial lamp calibration.",
    ],
  },
  "meter-bridge": {
    experimentId: "meter-bridge",
    formulaName: "Meter bridge null balance",
    formula: "X/R = l/(L-l); I_g=(V_D-V_J)/R_g",
    status: statusForBenchmarks(meterBridgeBenchmarks),
    assumptions: [
      "The bridge wire is uniform, so segment resistance is proportional to length.",
      "The cell and connecting leads are ideal; the galvanometer has finite resistance.",
      "The jockey makes contact no closer than 0.5 cm to either endpoint.",
    ],
    inputUnits: [
      si("knownResistance", "Known resistance R", "Ω"),
      si("unknownResistance", "Unknown resistance X", "Ω"),
      si("wireLengthCm", "Bridge-wire length", "cm", "m"),
      si("jockeyPositionCm", "Jockey position", "cm", "m"),
    ],
    outputUnits: [
      si("galvanometerCurrent", "Galvanometer current", "µA", "A"),
      si("junctionPotential", "Branch potential", "V"),
      si("calculatedUnknown", "Calculated unknown resistance", "Ω"),
    ],
    validRanges: [
      { id: "resistance", label: "Resistance", min: 1, max: 100, unit: "Ω" },
      {
        id: "wireLengthCm",
        label: "Wire length",
        min: 50,
        max: 200,
        unit: "cm",
      },
      {
        id: "jockeyPositionCm",
        label: "Jockey position",
        min: 0.5,
        unit: "cm",
      },
    ],
    benchmarkCases: meterBridgeBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "deflection-position",
        label: "Signed deflection vs position",
        xLabel: "l",
        yLabel: "I_g",
        direction: "increasing",
      },
    ],
    warnings: [
      "Real bridge-wire nonuniformity, lead resistance, thermoelectric offsets, and contact resistance are omitted.",
    ],
  },
  "kirchhoff-circuit": {
    experimentId: "kirchhoff-circuit",
    formulaName: "Kirchhoff mesh equations",
    formula: "ΣI=0; ΣΔV=0; A·I=E; P_sources=ΣI²R",
    status: statusForBenchmarks(kirchhoffBenchmarks),
    assumptions: [
      "Sources are ideal DC voltage sources.",
      "Resistors are ohmic and wires have negligible resistance.",
      "The circuit is in steady state with no reactive components.",
    ],
    inputUnits: [
      si("source1", "Source E1", "V"),
      si("source2", "Source E2", "V"),
      si("resistances", "Branch resistances", "Ω"),
    ],
    outputUnits: [
      si("mesh1", "Left mesh current", "mA", "A"),
      si("mesh2", "Right mesh current", "mA", "A"),
      si("sharedCurrent", "Shared branch current", "mA", "A"),
      si("residual", "KCL/KVL residual", "V / A"),
    ],
    validRanges: [
      { id: "source1", label: "Source E1", min: 0, max: 24, unit: "V" },
      { id: "source2", label: "Source E2", min: 0, max: 24, unit: "V" },
      {
        id: "resistances",
        label: "Branch resistance",
        min: 10,
        max: 1000,
        unit: "Ω",
      },
    ],
    benchmarkCases: kirchhoffBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "signed-loop-ledger",
        label: "Cumulative signed loop voltage",
        xLabel: "traversal step",
        yLabel: "cumulative voltage",
        shape: "qualitative",
      },
    ],
    warnings: [
      "The steady-state model omits source internal resistance, wire resistance, contact resistance, and transient effects.",
    ],
  },
  "heating-effect-current": {
    experimentId: "heating-effect-current",
    formulaName: "Joule heating with thermal loss",
    formula:
      "H_in=I²Rt; R(T)=R₀f_material(d₀/d)²[1+α(T−T₀)]; C dT/dt=I²R−k(T−T_a)",
    status: statusForBenchmarks(heatingEffectBenchmarks),
    assumptions: [
      "The current source holds the selected current constant.",
      "Wire temperature is spatially uniform in this lumped thermal model.",
      "Convective and conductive losses are represented by a linear temperature-loss coefficient.",
    ],
    inputUnits: [
      si("current", "Current", "A"),
      si("referenceResistance", "Reference resistance", "Ω"),
      si("diameter", "Wire diameter", "mm", "m"),
      si("duration", "Heating time", "s"),
    ],
    outputUnits: [
      si("temperature", "Temperature", "°C", "K"),
      si("power", "Electrical power", "W"),
      si("inputEnergy", "Electrical energy", "J"),
      si("heatLoss", "Thermal loss", "J"),
    ],
    validRanges: [
      { id: "current", label: "Current", min: 0, max: 5, unit: "A" },
      {
        id: "referenceResistance",
        label: "Reference resistance",
        min: 0.5,
        max: 20,
        unit: "Ω",
      },
      { id: "diameter", label: "Wire diameter", min: 0.2, max: 2, unit: "mm" },
      { id: "duration", label: "Heating time", min: 10, max: 300, unit: "s" },
    ],
    benchmarkCases: heatingEffectBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "temperature-time",
        label: "Temperature and input energy versus time",
        xLabel: "time",
        yLabel: "temperature / energy",
        direction: "increasing",
      },
    ],
    warnings: [
      "The classroom model omits temperature gradients, boiling, changing heat capacity, radiation, and power-supply current limits.",
    ],
  },
  "emi-faraday": {
    experimentId: "emi-faraday",
    formulaName: "Faraday-Lenz induction",
    formula: "Φ=BA exp[-(x/σ)²]; dΦ/dt=(dΦ/dx)v; ε=-N dΦ/dt; I=ε/R",
    status: statusForBenchmarks(emiFaradayBenchmarks),
    assumptions: [
      "The axial field through the coil is represented by a smooth Gaussian profile.",
      "The magnet moves at constant selected speed during a pass.",
      "The circuit is purely resistive and self-inductance is neglected.",
    ],
    inputUnits: [
      si("magnetStrength", "Magnet strength", "T"),
      si("speed", "Magnet speed", "m/s"),
      si("turns", "Coil turns", "turns", "1"),
      si("resistance", "Circuit resistance", "Ω"),
      si("position", "Magnet position", "cm", "m"),
    ],
    outputUnits: [
      si("flux", "Magnetic flux", "mWb", "Wb"),
      si("fluxRate", "Flux rate", "Wb/s"),
      si("emf", "Induced emf", "V"),
      si("current", "Induced current", "A"),
    ],
    validRanges: [
      {
        id: "magnetStrength",
        label: "Magnet strength",
        min: 0.1,
        max: 1.2,
        unit: "T",
      },
      { id: "speed", label: "Magnet speed", min: 0, max: 2, unit: "m/s" },
      { id: "turns", label: "Coil turns", min: 100, max: 1000, unit: "turns" },
      { id: "resistance", label: "Resistance", min: 1, max: 50, unit: "Ω" },
      {
        id: "position",
        label: "Magnet position",
        min: -0.24,
        max: 0.24,
        unit: "m",
      },
    ],
    benchmarkCases: emiFaradayBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "emf-position",
        label: "Induced emf versus pass time",
        xLabel: "time",
        yLabel: "emf",
        shape: "qualitative",
      },
    ],
    warnings: [
      "The smooth axial field is an instructional approximation; coil self-inductance, eddy currents, and magnetic hysteresis are omitted.",
    ],
  },
  "electrostatic-field-potential": {
    experimentId: "electrostatic-field-potential",
    formulaName: "Point-charge field and potential",
    formula: "E=kΣ(qᵢ r̂ᵢ/rᵢ²); V=kΣ(qᵢ/rᵢ); E=-grad V; W=-qΔV",
    status: statusForBenchmarks(electrostaticBenchmarks),
    assumptions: [
      "Charges are stationary point charges in vacuum.",
      "The test charge does not disturb the source configuration.",
      "An 0.08 m exclusion radius prevents displayed singularities.",
    ],
    inputUnits: [
      si("charge1", "Charge Q1", "μC", "C"),
      si("charge2", "Charge Q2", "μC", "C"),
      si("separation", "Separation", "m"),
      si("probeX", "Probe x", "m"),
      si("probeY", "Probe y", "m"),
    ],
    outputUnits: [
      si("fieldMagnitude", "Electric field", "N/C"),
      si("potential", "Potential", "V"),
      si("workByField", "Work by field", "J"),
    ],
    validRanges: [
      { id: "charge1", label: "Charge Q1", min: -20e-6, max: 20e-6, unit: "C" },
      { id: "charge2", label: "Charge Q2", min: -20e-6, max: 20e-6, unit: "C" },
      { id: "separation", label: "Separation", min: 0.2, max: 4, unit: "m" },
      { id: "probeX", label: "Probe x", min: -4, max: 4, unit: "m" },
      { id: "probeY", label: "Probe y", min: -3, max: 3, unit: "m" },
    ],
    benchmarkCases: electrostaticBenchmarks,
    tolerance: 1,
    graphExpectations: [
      {
        id: "field-map",
        label: "Field vectors and potential contours",
        xLabel: "x",
        yLabel: "y",
        shape: "qualitative",
      },
    ],
    warnings: [
      "The visualization clamps evaluation radius near point charges and omits dielectric polarization and radiation.",
    ],
  },

  "electric-power": {
    experimentId: "electric-power",
    formulaName: "Electric power and energy",
    formula: "I=V/R; P=VI=I²R=V²/R; E=Pt; 1 kWh=3.6×10⁶ J",
    status: statusForBenchmarks(electricPowerBenchmarks),
    assumptions: [
      "Appliances are represented by constant ohmic resistance.",
      "Supply voltage is constant during operation.",
      "All electrical work is counted as delivered energy/heat for this classroom model.",
    ],
    inputUnits: [
      si("voltage", "Voltage", "V"),
      si("resistance", "Resistance", "Ω"),
      si("operatingTimeHours", "Operating time", "h", "s"),
      si("fuseLimit", "Fuse limit", "A"),
    ],
    outputUnits: [
      si("current", "Current", "A"),
      si("powerVI", "Power", "W"),
      si("energyJ", "Energy", "J"),
      si("energyKWh", "Energy", "kWh", "J"),
    ],
    validRanges: [
      { id: "voltage", label: "Voltage", min: 0, max: 240, unit: "V" },
      { id: "resistance", label: "Resistance", min: 1, max: 1000, unit: "Ω" },
      {
        id: "operatingTimeHours",
        label: "Operating time",
        min: 0,
        max: 24,
        unit: "h",
      },
      { id: "fuseLimit", label: "Fuse limit", min: 1, max: 20, unit: "A" },
    ],
    benchmarkCases: electricPowerBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "energy-time",
        label: "Cumulative energy versus time",
        xLabel: "time",
        yLabel: "energy",
        shape: "linear",
      },
    ],
    warnings: [
      "Real appliances can be non-ohmic, reactive, thermostatically cycled, or voltage-dependent.",
    ],
  },
  "chemical-effects-current": {
    experimentId: "chemical-effects-current",
    formulaName: "Faraday electrolysis",
    formula: "Q=It; m=MIt/(nF); I=V/R_solution",
    status: statusForBenchmarks(chemicalEffectsBenchmarks),
    assumptions: [
      "Bulk electrolyte resistance scales with electrode gap and inversely with concentration.",
      "Current and thermal parameters remain constant during a run.",
      "Gas volumes use a classroom molar volume of 24.45 L/mol.",
    ],
    inputUnits: [
      si("voltage", "Voltage", "V"),
      si("electrodeGap", "Electrode spacing", "cm", "m"),
      si("concentration", "Relative concentration", "mol/L rel."),
      si("duration", "Duration", "s"),
    ],
    outputUnits: [
      si("current", "Current", "A"),
      si("charge", "Charge passed", "C"),
      si("depositedMassG", "Deposited mass", "g", "kg"),
      si("temperatureC", "Solution temperature", "°C", "K"),
    ],
    validRanges: [
      { id: "voltage", label: "Voltage", min: 0, max: 12, unit: "V" },
      {
        id: "electrodeGap",
        label: "Electrode spacing",
        min: 0.01,
        max: 0.05,
        unit: "m",
      },
      {
        id: "concentration",
        label: "Relative concentration",
        min: 0.25,
        max: 2,
      },
      { id: "duration", label: "Duration", min: 0, max: 600, unit: "s" },
    ],
    benchmarkCases: chemicalEffectsBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "mass-charge",
        label: "Deposited mass versus charge",
        xLabel: "charge",
        yLabel: "mass",
        shape: "linear",
      },
    ],
    warnings: [
      "The thermal model is a lumped classroom approximation; electrode overpotential, convection, and changing concentration are omitted.",
    ],
  },
  "internal-resistance-cell": {
    experimentId: "internal-resistance-cell",
    formulaName: "Cell terminal voltage and internal resistance",
    formula: "I=E/(R+r); V=E-Ir; P_internal=I²r; slope(V against I)=-r",
    status: statusForBenchmarks(internalResistanceBenchmarks),
    assumptions: [
      "The cell emf and internal resistance are constant during a reading.",
      "Meters are ideal and leads have negligible resistance.",
      "The safety relay interrupts an external resistance below 0.10 ohm.",
    ],
    inputUnits: [
      si("emf", "Cell emf", "V"),
      si("internalResistance", "Internal resistance", "Ω"),
      si("externalResistance", "External resistance", "Ω"),
    ],
    outputUnits: [
      si("current", "Circuit current", "A"),
      si("terminalVoltage", "Terminal voltage", "V"),
      si("lostVoltage", "Lost volts", "V"),
      si("internalPower", "Internal heating", "W"),
    ],
    validRanges: [
      { id: "emf", label: "Cell emf", min: 0.5, max: 12, unit: "V" },
      {
        id: "internalResistance",
        label: "Internal resistance",
        min: 0.05,
        max: 5,
        unit: "Ω",
      },
      {
        id: "externalResistance",
        label: "External resistance",
        min: 0,
        max: 20,
        unit: "Ω",
        warning: "The simulator opens its safety relay below 0.10 Ω.",
      },
    ],
    benchmarkCases: internalResistanceBenchmarks,
    tolerance: 1e-10,
    graphExpectations: [
      {
        id: "terminal-voltage-current",
        label: "Terminal voltage versus current",
        xLabel: "current",
        yLabel: "terminal voltage",
        direction: "decreasing",
      },
    ],
    warnings: [
      "Real emf and internal resistance vary with temperature, state of charge, chemistry, and current history.",
    ],
  },
  "capacitor-lab": {
    experimentId: "capacitor-lab",
    formulaName: "Parallel-plate capacitance and stored energy",
    formula: "C=κε0A/d; Q=CV; U=CV²/2; Cparallel=sum(Ci); 1/Cseries=sum(1/Ci)",
    status: statusForBenchmarks(capacitorBenchmarks),
    assumptions: [
      "Uniform field between ideal parallel plates.",
      "Fringing and leakage are neglected.",
      "Network capacitors are identical copies of the geometry capacitor.",
    ],
    inputUnits: [
      si("plateArea", "Plate area", "m²"),
      si("spacing", "Spacing", "mm", "m"),
      si("dielectric", "Dielectric constant", "unitless"),
      si("voltage", "Voltage", "V"),
    ],
    outputUnits: [
      si("equivalentCapacitance", "Equivalent capacitance", "F"),
      si("charge", "Charge", "C"),
      si("energy", "Stored energy", "J"),
      si("electricField", "Electric field", "V/m"),
    ],
    validRanges: [
      {
        id: "plateArea",
        label: "Plate area",
        min: 0.005,
        max: 0.05,
        unit: "m²",
      },
      { id: "spacing", label: "Spacing", min: 0.0005, max: 0.01, unit: "m" },
      { id: "dielectric", label: "Dielectric constant", min: 1, max: 10 },
      { id: "voltage", label: "Voltage", min: 0, max: 24, unit: "V" },
    ],
    benchmarkCases: capacitorBenchmarks,
    tolerance: 1e-18,
    graphExpectations: [
      {
        id: "combination-comparison",
        label: "Equivalent capacitance by arrangement",
        xLabel: "arrangement",
        yLabel: "capacitance",
        shape: "qualitative",
      },
    ],
    warnings: [
      "Fringing, dielectric breakdown, leakage, ESR, and transient circuit resistance are omitted.",
    ],
  },
  "ac-lcr-resonance": {
    experimentId: "ac-lcr-resonance",
    formulaName: "Series LCR resonance",
    formula: "XL=2πfL; XC=1/(2πfC); Z=sqrt(R²+(XL-XC)²); f0=1/(2πsqrt(LC))",
    status: statusForBenchmarks(lcrBenchmarks),
    assumptions: [
      "Ideal series components.",
      "Sinusoidal RMS source at steady state.",
      "No parasitic resistance, saturation, or frequency-dependent component loss.",
    ],
    inputUnits: [
      si("frequency", "Frequency", "Hz"),
      si("resistance", "Resistance", "Ω"),
      si("inductance", "Inductance", "mH", "H"),
      si("capacitance", "Capacitance", "μF", "F"),
      si("sourceVoltage", "Source voltage", "V RMS"),
    ],
    outputUnits: [
      si("xL", "Inductive reactance", "Ω"),
      si("xC", "Capacitive reactance", "Ω"),
      si("impedance", "Impedance", "Ω"),
      si("current", "Current", "A RMS"),
      si("phaseDeg", "Phase", "deg", "rad"),
    ],
    validRanges: [
      { id: "frequency", label: "Frequency", min: 1, max: 500, unit: "Hz" },
      { id: "resistance", label: "Resistance", min: 1, max: 500, unit: "Ω" },
      { id: "inductance", label: "Inductance", min: 0.001, max: 2, unit: "H" },
      {
        id: "capacitance",
        label: "Capacitance",
        min: 1e-7,
        max: 0.001,
        unit: "F",
      },
    ],
    benchmarkCases: lcrBenchmarks,
    tolerance: 1e-8,
    graphExpectations: [
      {
        id: "resonance-current",
        label: "Current versus frequency",
        xLabel: "frequency",
        yLabel: "current",
        shape: "qualitative",
      },
      {
        id: "phase-frequency",
        label: "Phase versus frequency",
        xLabel: "frequency",
        yLabel: "phase",
        shape: "qualitative",
      },
    ],
    warnings: [
      "Real inductors and capacitors have parasitic losses that lower Q and alter the response.",
    ],
  },
  "ac-generator": {
    experimentId: "ac-generator",
    formulaName: "Rotating-coil AC generator",
    formula: "NΦ = NBA cos(θ); ε = -d(NΦ)/dt = NBAω sin(θ)",
    status: statusForBenchmarks(acGeneratorValidation),
    assumptions: [
      "Uniform magnetic field across the coil.",
      "Rigid planar coil rotates at constant angular speed.",
      "Brush and slip-ring losses are neglected.",
    ],
    inputUnits: [
      si("turns", "Turns", "turns"),
      si("magneticField", "Magnetic field", "T"),
      si("coilArea", "Coil area", "m²"),
      si("angularSpeed", "Angular speed", "rad/s"),
      si("angleRad", "Coil angle", "deg", "rad"),
    ],
    outputUnits: [
      si("fluxLinkage", "Flux linkage", "Wb-turn"),
      si("emf", "Instantaneous emf", "V"),
      si("peakEmf", "Peak emf", "V"),
      si("frequency", "Frequency", "Hz"),
    ],
    validRanges: [
      { id: "turns", label: "Turns", min: 1, max: 500, unit: "turns" },
      {
        id: "magneticField",
        label: "Magnetic field",
        min: 0,
        max: 2,
        unit: "T",
      },
      { id: "coilArea", label: "Coil area", min: 0.005, max: 0.5, unit: "m²" },
      {
        id: "angularSpeed",
        label: "Angular speed",
        min: 0,
        max: 200,
        unit: "rad/s",
      },
    ],
    benchmarkCases: acGeneratorValidation,
    tolerance: 1e-10,
    graphExpectations: [
      {
        id: "emf-angle",
        label: "Emf versus angle",
        xLabel: "angle",
        yLabel: "emf",
        shape: "qualitative",
      },
      {
        id: "flux-angle",
        label: "Flux versus angle",
        xLabel: "angle",
        yLabel: "flux linkage",
        shape: "qualitative",
      },
    ],
    warnings: [
      "Real generators also have resistance, inductance, magnetic saturation, friction, and brush losses.",
    ],
  },
  "universal-gravitation": {
    experimentId: "universal-gravitation",
    formulaName: "Newtonian universal gravitation",
    formula:
      "F = Gm1m2/r^2; g = -sum(GMi(r-ri)/|r-ri|^3); V = -sum(GMi/|r-ri|)",
    status: statusForBenchmarks(universalGravitationBenchmarks),
    assumptions: [
      "Two fixed spherical point masses.",
      "Newtonian gravity in an inertial frame.",
      "Softening is used only near each displayed mass to avoid a visual singularity.",
    ],
    inputUnits: [
      si("massA", "Mass A", "kg"),
      si("massB", "Mass B", "kg"),
      si("separation", "Separation", "m"),
      si("probeX", "Probe x", "m"),
      si("probeY", "Probe y", "m"),
      si("softening", "Softening length", "m"),
    ],
    outputUnits: [
      si("forceMagnitude", "Mutual force", "N"),
      si("netFieldMagnitude", "Net field", "N/kg"),
      si("potential", "Potential", "J/kg"),
      si("zeroFieldX", "Zero-field x", "m"),
    ],
    validRanges: [
      { id: "massA", label: "Mass A", min: 1e20, max: 1e32, unit: "kg" },
      { id: "massB", label: "Mass B", min: 1e20, max: 1e32, unit: "kg" },
      { id: "separation", label: "Separation", min: 1e7, max: 1e13, unit: "m" },
    ],
    benchmarkCases: universalGravitationBenchmarks,
    tolerance: 1e-8,
    graphExpectations: [
      {
        id: "potential-line",
        label: "Potential along the mass axis",
        xLabel: "position",
        yLabel: "potential",
        shape: "qualitative",
      },
    ],
    warnings: [
      "The fixed-mass field map does not integrate orbital motion or relativistic effects.",
      "Softening changes the field inside the chosen epsilon radius.",
    ],
  },
  "satellite-orbit": {
    experimentId: "satellite-orbit",
    formulaName: "Inverse-square orbital motion",
    formula: "a = -mu r/|r|^3; v_orbit = sqrt(mu/r); v_escape = sqrt(2mu/r)",
    status: statusForBenchmarks(satelliteOrbitBenchmarks),
    assumptions: [
      "Isolated two-body system.",
      "Planet is a spherical point mass outside its surface.",
      "No atmosphere, thrust, oblateness, or third-body perturbations.",
    ],
    inputUnits: [
      si("planetMassEarths", "Planet mass", "Earth masses", "kg"),
      si("altitudeKm", "Altitude", "km", "m"),
      si("launchSpeedKmS", "Launch speed", "km/s", "m/s"),
      si("directionDeg", "Launch direction", "deg", "rad"),
      si("satelliteMassKg", "Satellite mass", "kg"),
    ],
    outputUnits: [
      si("speed", "Speed", "km/s", "m/s"),
      si("energy", "Mechanical energy", "J"),
      si("eccentricity", "Eccentricity", "unitless"),
      si("period", "Circular period", "min", "s"),
    ],
    validRanges: [
      {
        id: "planetMassEarths",
        label: "Planet mass",
        min: 0.2,
        max: 3,
        unit: "Earth masses",
      },
      { id: "altitudeKm", label: "Altitude", min: 200, max: 36000, unit: "km" },
      {
        id: "launchSpeedKmS",
        label: "Launch speed",
        min: 0,
        max: 30,
        unit: "km/s",
      },
    ],
    benchmarkCases: satelliteOrbitBenchmarks,
    tolerance: 1e-8,
    graphExpectations: [
      {
        id: "speed-altitude",
        label: "Speed vs altitude",
        xLabel: "altitude",
        yLabel: "speed",
        direction: "decreasing",
      },
    ],
    warnings: [
      "The numerical model omits atmospheric drag, thrust, planet rotation, oblateness, and third-body gravity.",
    ],
  },
  "uniform-motion": {
    experimentId: "uniform-motion",
    formulaName: "Uniform motion",
    formula: "x = x0 + vt",
    status: statusForBenchmarks(uniformMotionBenchmarks),
    assumptions: [
      "Velocity is constant.",
      "Motion is one-dimensional.",
      "Position is signed.",
    ],
    inputUnits: [
      si("x0", "Initial position", "m"),
      si("velocity", "Velocity", "m/s"),
      si("time", "Time", "s"),
    ],
    outputUnits: [
      si("x", "Final position", "m"),
      si("slope", "Graph slope", "m/s"),
    ],
    validRanges: [{ id: "time", label: "Time", min: 0, unit: "s" }],
    benchmarkCases: uniformMotionBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "distance-time",
        label: "Distance-time",
        xLabel: "time",
        yLabel: "position",
        shape: "linear",
      },
      {
        id: "velocity-time",
        label: "Velocity-time",
        xLabel: "time",
        yLabel: "velocity",
        shape: "constant",
      },
    ],
    warnings: ["Negative velocity is allowed; negative time is not."],
  },
  "vector-resolution": {
    experimentId: "vector-resolution",
    formulaName: "Orthogonal vector resolution",
    formula: "Ax=A cos(theta-phi); Ay=A sin(theta-phi); A=sqrt(Ax^2+Ay^2)",
    status: statusForBenchmarks(vectorResolutionBenchmarks),
    assumptions: [
      "The x-prime and y-prime axes remain perpendicular.",
      "Angles are measured counterclockwise and components preserve sign.",
      "All displayed vectors share one linear scale.",
    ],
    inputUnits: [
      si("magnitude", "Magnitude", "N"),
      si("angleDeg", "Vector angle", "degrees"),
      si("axisRotationDeg", "Axis rotation", "degrees"),
    ],
    outputUnits: [
      si("xComponent", "x-prime component", "N"),
      si("yComponent", "y-prime component", "N"),
      si("recombinedMagnitude", "Recombined magnitude", "N"),
    ],
    validRanges: [
      { id: "magnitude", label: "Magnitude", min: 5, max: 100, unit: "N" },
      { id: "angleDeg", label: "Angle", min: -180, max: 180, unit: "degrees" },
      {
        id: "axisRotationDeg",
        label: "Axis rotation",
        min: -90,
        max: 90,
        unit: "degrees",
      },
    ],
    benchmarkCases: vectorResolutionBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [],
    warnings: [
      "Component values are defined relative to the rotated x-prime/y-prime axes, not necessarily the screen axes.",
    ],
  },
  "work-power": {
    experimentId: "work-power",
    formulaName: "Work, power, and work-energy",
    formula: "W=integral(F dot ds); Pavg=W/dt; P=F dot v; Wnet=Delta K",
    status: statusForBenchmarks(workPowerBenchmarks),
    assumptions: [
      "Horizontal path with a constant applied-force magnitude and angle.",
      "Kinetic friction is mu_k times the reduced normal force N=max(0,mg-F sin theta).",
      "The load starts from rest and the applied force is constant.",
    ],
    inputUnits: [
      si("massKg", "Load mass", "kg"),
      si("forceN", "Applied force", "N"),
      si("distanceM", "Path distance", "m"),
      si("angleDeg", "Force angle", "degrees"),
      si("durationS", "Observation duration", "s"),
      si("frictionCoefficient", "Kinetic friction coefficient", "unitless"),
    ],
    outputUnits: [
      si("netWorkJ", "Net work", "J"),
      si("averageNetPowerW", "Average net power", "W"),
      si("instantaneousAppliedPowerW", "Instantaneous applied power", "W"),
      si("speedMps", "Speed", "m/s"),
    ],
    validRanges: [
      { id: "forceN", label: "Force", min: 20, max: 500, unit: "N" },
      { id: "distanceM", label: "Distance", min: 1, max: 20, unit: "m" },
      { id: "angleDeg", label: "Angle", min: -90, max: 180, unit: "degrees" },
      { id: "durationS", label: "Duration", min: 1, max: 30, unit: "s" },
      {
        id: "frictionCoefficient",
        label: "Kinetic friction",
        min: 0,
        max: 0.8,
        unit: "unitless",
      },
    ],
    benchmarkCases: workPowerBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "work-time",
        label: "Cumulative work",
        xLabel: "time",
        yLabel: "work",
        shape: "quadratic",
      },
    ],
    warnings: [
      "If the forward applied component does not exceed kinetic friction, this rest-start model does not move the load.",
    ],
  },
  friction: {
    experimentId: "friction",
    formulaName: "Static and kinetic friction",
    formula: "|fs| ≤ μsN; |fk| = μkN; N = mg cosθ",
    status: statusForBenchmarks(frictionBenchmarks),
    assumptions: [
      "Rigid block and surface with constant coefficients.",
      "Friction opposes relative motion or its tendency.",
      "The incline option fixes the plane at 20 degrees.",
    ],
    inputUnits: [
      si("mass", "Mass", "kg"),
      si("gravity", "Gravity", "m/s^2"),
      si("muS", "Static coefficient", "unitless"),
      si("muK", "Kinetic coefficient", "unitless"),
      si("appliedForce", "Applied force", "N"),
      si("inclineDegrees", "Incline angle", "deg", "rad"),
    ],
    outputUnits: [
      si("normalForce", "Normal force", "N"),
      si("maximumStaticFriction", "Static friction limit", "N"),
      si("kineticFriction", "Kinetic friction magnitude", "N"),
      si("frictionForce", "Signed friction force", "N"),
      si("acceleration", "Acceleration", "m/s^2"),
    ],
    validRanges: [
      {
        id: "mass",
        label: "Mass",
        min: 0,
        unit: "kg",
        warning: "Mass must be positive.",
      },
      { id: "muS", label: "Static coefficient", min: 0 },
      { id: "muK", label: "Kinetic coefficient", min: 0 },
    ],
    benchmarkCases: frictionBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "friction-normal",
        label: "f vs N",
        xLabel: "normal force",
        yLabel: "friction",
        shape: "linear",
      },
    ],
    warnings: [
      "No negative mass or coefficient; the interface constrains μk ≤ μs.",
    ],
  },
  "mass-and-weight": {
    experimentId: "mass-and-weight",
    formulaName: "Weight and apparent weight",
    formula: "W=mg; N=m(g+a); g(h)=g0[R/(R+h)]^2",
    status: statusForBenchmarks(massWeightBenchmarks),
    assumptions: [
      "Mass is invariant across location.",
      "Elevator acceleration is positive upward.",
      "The spring scale cannot exert a negative normal force.",
    ],
    inputUnits: [
      si("massKg", "Mass", "kg"),
      si("altitudeKm", "Altitude", "km", "m"),
      si("elevatorAccelerationMps2", "Elevator acceleration", "m/s^2"),
    ],
    outputUnits: [
      si("localGravityMps2", "Local gravitational field", "m/s^2"),
      si("trueWeightN", "True weight", "N"),
      si("apparentWeightN", "Apparent weight", "N"),
    ],
    validRanges: [
      { id: "massKg", label: "Mass", min: 0, unit: "kg" },
      { id: "altitudeKm", label: "Altitude", min: 0, unit: "km" },
    ],
    benchmarkCases: massWeightBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "weight-gravity",
        label: "Weight vs gravitational field",
        xLabel: "g",
        yLabel: "weight",
        shape: "linear",
      },
    ],
    warnings: ["Apparent weight is clamped at zero when contact is lost."],
  },
  "inclined-plane": {
    experimentId: "inclined-plane",
    formulaName: "Inclined-plane force balance",
    formula: "F∥=mg sinθ; N=mg cosθ; tanθc=μs",
    status: statusForBenchmarks(inclinedPlaneBenchmarks),
    assumptions: [
      "Rigid plane.",
      "Static friction opposes the impending direction up to μsN.",
      "Kinetic friction is modeled as 0.8 μsN after breakaway.",
    ],
    inputUnits: [
      si("angleDegrees", "Angle", "deg", "rad"),
      si("massKg", "Mass", "kg"),
      si("frictionCoefficient", "Static coefficient", "unitless"),
      si("appliedForceN", "Applied force upslope", "N"),
      si("gravity", "Gravity", "m/s^2"),
    ],
    outputUnits: [
      si("parallelWeightN", "Parallel weight", "N"),
      si("normalForceN", "Normal force", "N"),
      si("accelerationDownMps2", "Downslope acceleration", "m/s^2"),
    ],
    validRanges: [
      {
        id: "angleDegrees",
        label: "Angle",
        min: 0,
        max: 80,
        unit: "deg",
        warning: "Angles beyond classroom scope need warning.",
      },
      { id: "massKg", label: "Mass", min: 0, unit: "kg" },
    ],
    benchmarkCases: inclinedPlaneBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "angle-acceleration",
        label: "Angle vs acceleration",
        xLabel: "angle",
        yLabel: "acceleration",
        direction: "increasing",
      },
    ],
    warnings: [
      "Flat planes do not accelerate without an unbalanced applied force.",
    ],
  },
  "elastic-collision": {
    experimentId: "elastic-collision",
    formulaName: "1D elastic collision",
    formula: "v1=((m1-m2)/(m1+m2))u1 + (2m2/(m1+m2))u2",
    status: statusForBenchmarks(elasticCollisionBenchmarks),
    assumptions: [
      "One-dimensional collision.",
      "Perfectly elastic.",
      "No external impulse during collision.",
    ],
    inputUnits: [
      si("m1", "Mass 1", "kg"),
      si("m2", "Mass 2", "kg"),
      si("u1", "Initial velocity 1", "m/s"),
      si("u2", "Initial velocity 2", "m/s"),
    ],
    outputUnits: [
      si("v1", "Final velocity 1", "m/s"),
      si("v2", "Final velocity 2", "m/s"),
      si("energy", "Kinetic energy", "J"),
    ],
    validRanges: [
      { id: "m1", label: "Mass 1", min: 0, unit: "kg" },
      { id: "m2", label: "Mass 2", min: 0, unit: "kg" },
    ],
    benchmarkCases: elasticCollisionBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "energy-before-after",
        label: "Energy before/after",
        xLabel: "state",
        yLabel: "energy",
        shape: "constant",
      },
    ],
    warnings: ["Mass sum cannot be zero."],
  },
  "hooke-s-law": {
    experimentId: "hooke-s-law",
    formulaName: "Hooke's law",
    formula: "F = kx; xeq = mg/k; U = 1/2 kx^2",
    status: statusForBenchmarks(hookesLawBenchmarks),
    assumptions: [
      "The force-extension fit uses points within the elastic region.",
      "Extension is measured from the unloaded natural length.",
      "Optional permanent set is a clearly marked classroom deformation model.",
    ],
    inputUnits: [
      si("springConstant", "Spring constant", "N/m"),
      si("loadMassKg", "Attached mass", "kg"),
      si("naturalLengthM", "Natural length", "m"),
      si("damping", "Damping coefficient", "N*s/m"),
    ],
    outputUnits: [
      si("forceN", "Applied weight / restoring magnitude", "N"),
      si("equilibriumExtensionM", "Equilibrium extension", "m"),
      si("energyJ", "Elastic potential energy", "J"),
    ],
    validRanges: [
      { id: "springConstant", label: "Spring constant", min: 0, unit: "N/m" },
      { id: "loadMassKg", label: "Attached mass", min: 0, unit: "kg" },
    ],
    benchmarkCases: hookesLawBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "force-extension",
        label: "F-x graph",
        xLabel: "extension",
        yLabel: "force",
        shape: "linear",
      },
    ],
    warnings: ["Do not claim linearity beyond elastic limit."],
  },
  "circular-motion": {
    experimentId: "circular-motion",
    formulaName: "Centripetal force",
    formula: "Fc = m r omega^2",
    status: statusForBenchmarks(circularMotionBenchmarks),
    assumptions: [
      "Uniform circular motion.",
      "Centripetal force points inward.",
    ],
    inputUnits: [
      si("mass", "Mass", "kg"),
      si("radius", "Radius", "m"),
      si("omega", "Angular speed", "rad/s"),
    ],
    outputUnits: [
      si("force", "Centripetal force", "N"),
      si("speed", "Tangential speed", "m/s"),
      si("period", "Period", "s"),
    ],
    validRanges: [
      { id: "mass", label: "Mass", min: 0, unit: "kg" },
      { id: "radius", label: "Radius", min: 0, unit: "m" },
      { id: "omega", label: "Angular speed", min: 0, unit: "rad/s" },
    ],
    benchmarkCases: circularMotionBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "force-omega",
        label: "Fc vs omega",
        xLabel: "angular speed",
        yLabel: "force",
        shape: "quadratic",
      },
    ],
    warnings: [
      "Radius and angular speed must be positive for period and force outputs.",
    ],
  },
  "single-slit-diffraction": {
    experimentId: "single-slit-diffraction",
    formulaName: "Single slit minima",
    formula: "a sin(theta_m) = m lambda; y_m = D tan(theta_m)",
    status: statusForBenchmarks(singleSlitBenchmarks),
    assumptions: [
      "Exact screen geometry is used after the Fraunhofer minima condition.",
      "Scalar monochromatic Fraunhofer diffraction with a uniform slit.",
    ],
    inputUnits: [
      si("wavelengthNm", "Wavelength", "nm", "m"),
      si("slitWidthMm", "Slit width", "mm", "m"),
      si("screenDistanceM", "Screen distance", "m"),
      si("order", "Order", "integer"),
    ],
    outputUnits: [
      si("firstMinimaPosition", "First minima position", "m"),
      si("centralMaximumWidth", "Central maximum width", "m"),
    ],
    validRanges: [
      { id: "wavelengthNm", label: "Wavelength", min: 1, unit: "nm" },
      { id: "slitWidthMm", label: "Slit width", min: 0, unit: "mm" },
    ],
    benchmarkCases: singleSlitBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "central-width-slit",
        label: "Width vs slit width",
        xLabel: "slit width",
        yLabel: "central width",
        direction: "decreasing",
      },
    ],
    warnings: ["Never mix nm/mm/m without explicit conversion labels."],
  },
  "chladni-plate": {
    experimentId: "chladni-plate",
    formulaName: "Qualitative standing wave mode",
    formula: "z = A sin(n pi x/L) sin(m pi y/L) cos(omega t)",
    status: "qualitative-visual",
    assumptions: [
      "School-level qualitative mode model.",
      "Not a finite-element plate solver.",
    ],
    inputUnits: [
      si("modeN", "Mode n", "integer"),
      si("modeM", "Mode m", "integer"),
      si("frequency", "Frequency", "Hz"),
    ],
    outputUnits: [
      si("nodeLineCount", "Node line count", "relative"),
      si("complexity", "Pattern complexity", "relative"),
    ],
    validRanges: [
      { id: "modeN", label: "Mode n", min: 1 },
      { id: "modeM", label: "Mode m", min: 1 },
    ],
    benchmarkCases: chladniBenchmarks,
    tolerance: 0,
    graphExpectations: [
      {
        id: "mode-complexity",
        label: "Mode number vs node lines",
        xLabel: "mode",
        yLabel: "node lines",
        direction: "increasing",
      },
    ],
    warnings: ["Qualitative visual model only; no exact plate physics claim."],
  },
  "simple-pendulum": {
    experimentId: "simple-pendulum",
    formulaName: "Simple pendulum period",
    formula: "theta''+b theta'+(g/L)sin(theta)=0; T0=2pi sqrt(L/g)",
    status: statusForBenchmarks(simplePendulumBenchmarks),
    assumptions: [
      "Point-mass bob and massless rigid string.",
      "Small-angle period is an approximation, not the nonlinear equation of motion.",
      "Linear angular damping model.",
    ],
    inputUnits: [
      si("lengthM", "String length", "m"),
      si("amplitudeDeg", "Initial amplitude", "degrees"),
      si("gravityMps2", "Gravity", "m/s^2"),
      si("dampingPerS", "Damping", "s^-1"),
      si("bobMassKg", "Bob mass", "kg"),
    ],
    outputUnits: [
      si("periodS", "Period", "s"),
      si("angleDeg", "Angle", "degrees"),
      si("speedMps", "Bob speed", "m/s"),
    ],
    validRanges: [
      { id: "lengthM", label: "Length", min: 0.2, max: 2, unit: "m" },
      {
        id: "amplitudeDeg",
        label: "Amplitude",
        min: 5,
        max: 60,
        unit: "degrees",
      },
      {
        id: "gravityMps2",
        label: "Gravity",
        min: 1.62,
        max: 24.79,
        unit: "m/s^2",
      },
    ],
    benchmarkCases: simplePendulumBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "angle-time",
        label: "Angle vs time",
        xLabel: "time",
        yLabel: "angle",
        shape: "qualitative",
      },
    ],
    warnings: [
      "T0 is labeled approximate and large-angle correction is shown above 15 degrees.",
    ],
  },
  "shm-spring": {
    experimentId: "shm-spring",
    formulaName: "Linear spring-mass oscillator",
    formula: "m x'' + b x' + kx = F0 cos(omega_d t); omega_0=sqrt(k/m)",
    status: statusForBenchmarks(shmSpringBenchmarks),
    assumptions: [
      "The spring obeys Hooke's law and the cart moves on a level frictionless rail apart from viscous damping.",
      "Free motion uses the exact underdamped, critical, or overdamped linear solution.",
      "Driven mode displays the steady-state response to a 0.2 N sinusoidal drive.",
    ],
    inputUnits: [
      si("massKg", "Mass", "kg"),
      si("springConstantNm", "Spring constant", "N/m"),
      si("amplitudeM", "Release amplitude", "m"),
      si("dampingNsM", "Damping", "N·s/m"),
      si("driveFrequencyHz", "Drive frequency", "Hz"),
    ],
    outputUnits: [
      si("omega0", "Natural angular frequency", "rad/s"),
      si("periodS", "Period", "s"),
      si("x", "Displacement", "m"),
      si("v", "Velocity", "m/s"),
      si("acceleration", "Acceleration", "m/s²"),
      si("totalEnergyJ", "Mechanical energy", "J"),
    ],
    validRanges: [
      { id: "massKg", label: "Mass", min: 0.1, max: 2, unit: "kg" },
      {
        id: "springConstantNm",
        label: "Spring constant",
        min: 5,
        max: 50,
        unit: "N/m",
      },
      { id: "dampingNsM", label: "Damping", min: 0, max: 4, unit: "N·s/m" },
    ],
    benchmarkCases: shmSpringBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "phase-traces",
        label: "x, v and a versus time",
        xLabel: "time",
        yLabel: "state",
        shape: "qualitative",
      },
    ],
    warnings: [
      "Driven mode is a steady-state linear response; transient buildup is omitted.",
    ],
  },
  "projectile-motion": {
    experimentId: "projectile-motion",
    formulaName: "Parametric projectile motion",
    formula: "x=v0 cos(theta)t; y=h0+v0 sin(theta)t-gt^2/2",
    status: statusForBenchmarks(projectileLessonBenchmarks),
    assumptions: [
      "Uniform downward gravity.",
      "Exact range shortcut only for level-ground launch and landing without drag.",
      "Optional drag model uses deterministic quadratic velocity resistance.",
    ],
    inputUnits: [
      si("speedMps", "Launch speed", "m/s"),
      si("angleDeg", "Launch angle", "degrees"),
      si("heightM", "Launch height", "m"),
      si("gravityMps2", "Gravity", "m/s^2"),
    ],
    outputUnits: [
      si("rangeM", "Range", "m"),
      si("peakM", "Peak height", "m"),
      si("timeS", "Time of flight", "s"),
    ],
    validRanges: [
      { id: "speedMps", label: "Launch speed", min: 5, max: 50, unit: "m/s" },
      {
        id: "angleDeg",
        label: "Launch angle",
        min: 5,
        max: 85,
        unit: "degrees",
      },
      {
        id: "gravityMps2",
        label: "Gravity",
        min: 1.62,
        max: 24.79,
        unit: "m/s^2",
      },
    ],
    benchmarkCases: projectileLessonBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "horizontal-position",
        label: "Horizontal position vs time",
        xLabel: "time",
        yLabel: "x",
        shape: "linear",
      },
      {
        id: "vertical-position",
        label: "Vertical position vs time",
        xLabel: "time",
        yLabel: "y",
        shape: "quadratic",
      },
    ],
    warnings: [
      "The closed-form range equation is not used for elevated launches or air resistance.",
    ],
  },
  "rotational-dynamics": {
    experimentId: "rotational-dynamics",
    formulaName: "Rotational form of Newton's second law",
    formula: "tau=rF; I=Md^2/2+sum(mr^2); alpha=tau_net/I; L=I omega",
    status: statusForBenchmarks(rotationalDynamicsBenchmarks),
    assumptions: [
      "Rigid solid disk on a fixed axis.",
      "Applied force is tangential.",
      "Two point masses are symmetric.",
      "Axle friction is linear viscous damping.",
    ],
    inputUnits: [
      si("forceN", "Tangential force", "N"),
      si("leverArmM", "Lever arm", "m"),
      si("pointMassKg", "Point mass", "kg"),
      si("massRadiusM", "Mass radius", "m"),
      si("axleDampingNmS", "Axle damping", "N m s"),
    ],
    outputUnits: [
      si("appliedTorqueNm", "Torque", "N m"),
      si("inertiaKgm2", "Moment of inertia", "kg m^2"),
      si("angularAccelerationRadS2", "Angular acceleration", "rad/s^2"),
      si("angularMomentumKgM2S", "Angular momentum", "kg m^2/s"),
    ],
    validRanges: [
      { id: "forceN", label: "Force", min: 0, max: 10, unit: "N" },
      { id: "leverArmM", label: "Lever arm", min: 0.05, max: 0.4, unit: "m" },
      {
        id: "massRadiusM",
        label: "Mass radius",
        min: 0.05,
        max: 0.25,
        unit: "m",
      },
    ],
    benchmarkCases: rotationalDynamicsBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "torque-alpha",
        label: "Angular acceleration vs net torque",
        xLabel: "net torque",
        yLabel: "angular acceleration",
        shape: "linear",
      },
    ],
    warnings: [
      "The damping model is an ideal linear axle-friction approximation.",
    ],
  },
  "newton-s-second-law": {
    experimentId: "newton-s-second-law",
    formulaName: "Newton's second law",
    formula: "Fnet = Fapplied - Ffriction; a = Fnet/m; x = 1/2 at^2",
    status: statusForBenchmarks(newtonBenchmarks),
    assumptions: [
      "Each trial starts from rest at x = 0.",
      "Mass is positive and constant during a trial.",
      "One-dimensional motion with a fixed opposing-friction magnitude.",
    ],
    inputUnits: [
      si("appliedForceN", "Applied force", "N"),
      si("frictionN", "Friction", "N"),
      si("massKg", "Mass", "kg"),
      si("samplingIntervalS", "Sampling interval", "s"),
    ],
    outputUnits: [
      si("netForceN", "Net force", "N"),
      si("accelerationMps2", "Acceleration", "m/s^2"),
    ],
    validRanges: [
      { id: "massKg", label: "Mass", min: 0.5, max: 5, unit: "kg" },
      { id: "frictionN", label: "Friction", min: 0, max: 10, unit: "N" },
    ],
    benchmarkCases: newtonBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "force-acceleration",
        label: "Acceleration vs net force",
        xLabel: "net force",
        yLabel: "acceleration",
        shape: "linear",
      },
      {
        id: "inverse-mass-acceleration",
        label: "Acceleration vs inverse mass",
        xLabel: "inverse mass",
        yLabel: "acceleration",
        shape: "linear",
      },
    ],
    warnings: [
      "Friction cancels applied force until its threshold is exceeded.",
    ],
  },
  "conservation-of-energy": {
    experimentId: "conservation-of-energy",
    formulaName: "Mechanical energy conservation",
    formula: "KE + PE = constant",
    status: statusForBenchmarks(energyBenchmarks),
    assumptions: [
      "No non-conservative work.",
      "Uniform gravity.",
      "Closed mechanical system.",
    ],
    inputUnits: [
      si("mass", "Mass", "kg"),
      si("height", "Height", "m"),
      si("g", "Gravity", "m/s^2"),
    ],
    outputUnits: [si("energy", "Energy", "J"), si("speed", "Speed", "m/s")],
    validRanges: [
      { id: "mass", label: "Mass", min: 0, unit: "kg" },
      { id: "height", label: "Height", min: 0, unit: "m" },
    ],
    benchmarkCases: energyBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "energy-total",
        label: "Total energy",
        xLabel: "time",
        yLabel: "energy",
        shape: "constant",
      },
    ],
    warnings: ["Energy changes if friction or drag is enabled."],
  },
  "wave-lab": {
    experimentId: "wave-lab",
    formulaName: "Transverse-wave superposition and reflection",
    formula:
      "y=y1+y2; v=f lambda; fixed reflection adds pi phase; free reflection does not invert",
    status: statusForBenchmarks(waveLabBenchmarks),
    assumptions: [
      "Linear medium, so displacements obey algebraic superposition.",
      "Component waves have equal amplitude and frequency.",
      "Boundary modes use ideal rigid-fixed or slope-free endpoints.",
    ],
    inputUnits: [
      si("amplitudeM", "Amplitude", "m", "mm"),
      si("frequencyHz", "Frequency", "Hz"),
      si("wavelengthM", "Wavelength", "m", "cm"),
      si("phaseDeg", "Phase", "deg", "rad"),
    ],
    outputUnits: [
      si("speedMs", "Wave speed", "m/s"),
      si("resultant", "Resultant displacement", "m", "mm"),
      si("nodeEnvelopeM", "Node envelope", "m", "mm"),
    ],
    validRanges: [
      { id: "frequencyHz", label: "Frequency", min: 2, max: 30, unit: "Hz" },
      {
        id: "wavelengthM",
        label: "Wavelength",
        min: 0.01,
        max: 0.1,
        unit: "m",
      },
      {
        id: "amplitudeM",
        label: "Amplitude",
        min: 0.001,
        max: 0.015,
        unit: "m",
      },
    ],
    benchmarkCases: waveLabBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "component-resultant",
        label: "Component and resultant displacement",
        xLabel: "position",
        yLabel: "displacement",
        shape: "qualitative",
      },
    ],
    warnings: [
      "The ripple-tank view is a 2D teaching visualization of the same linear transverse-wave state.",
    ],
  },
  "sound-wave-anatomy": {
    experimentId: "sound-wave-anatomy",
    formulaName: "Longitudinal sound wave",
    formula: "v=f lambda; delta-p=rho v omega s_max",
    status: statusForBenchmarks(soundWaveAnatomyValidation),
    assumptions: [
      "Each listed medium is homogeneous and represented by a fixed wave speed.",
      "Pressure and particle displacement are modeled as small-amplitude plane waves.",
      "Visual particle displacement is amplified; the numerical micrometre reading follows the acoustic relation.",
    ],
    inputUnits: [
      si("frequency", "Frequency", "Hz"),
      si("pressure", "Pressure amplitude", "Pa"),
      si("probe", "Probe position", "m"),
    ],
    outputUnits: [
      si("wavelength", "Wavelength", "m"),
      si("speed", "Wave speed", "m/s"),
      si("displacement", "Particle displacement", "µm", "m"),
    ],
    validRanges: [
      { id: "frequency", label: "Frequency", min: 100, max: 1200, unit: "Hz" },
      {
        id: "pressure",
        label: "Pressure amplitude",
        min: 1,
        max: 20,
        unit: "Pa",
      },
    ],
    benchmarkCases: soundWaveAnatomyValidation,
    tolerance: 0.002,
    graphExpectations: [
      {
        id: "pressure-position",
        label: "Pressure versus position",
        xLabel: "position",
        yLabel: "pressure",
        shape: "qualitative",
      },
    ],
    warnings: [
      "Particle motion is magnified on screen; particles oscillate locally rather than traveling with the wave.",
    ],
  },
  "sound-pitch-loudness": {
    experimentId: "sound-pitch-loudness",
    formulaName: "Pitch, pressure level and relative intensity",
    formula:
      "T=1/f; p_rms=p_peak/sqrt(2); Lp=20 log10(p_rms/p_ref); I_rel proportional to p_peak^2",
    status: statusForBenchmarks(soundPitchBenchmarks),
    assumptions: [
      "The displayed pressure is a sinusoidal-equivalent peak pressure and uses p_ref = 20 micropascals.",
      "Waveform selection illustrates timbre; pitch remains tied to the fundamental frequency.",
      "Browser audio gain is capped and is not a calibrated SPL source.",
    ],
    inputUnits: [
      si("frequencyHz", "Frequency", "Hz"),
      si("peakPressurePa", "Peak pressure", "Pa"),
    ],
    outputUnits: [
      si("periodSeconds", "Period", "s"),
      si("rmsPressurePa", "RMS pressure", "Pa"),
      si("soundPressureLevelDb", "Sound pressure level", "dB"),
      si("relativeIntensity", "Relative intensity", "relative"),
    ],
    validRanges: [
      { id: "frequencyHz", label: "Frequency", min: 110, max: 880, unit: "Hz" },
      {
        id: "peakPressurePa",
        label: "Peak pressure",
        min: 0.02,
        max: 1.4,
        unit: "Pa",
      },
    ],
    benchmarkCases: soundPitchBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "pressure-time",
        label: "Pressure waveform",
        xLabel: "time",
        yLabel: "pressure",
        shape: "qualitative",
      },
    ],
    warnings: [
      "Displayed SPL is an ideal pressure calculation, not a measurement of the user's speakers or listening position.",
    ],
  },
  "young-double-slit": {
    experimentId: "young-double-slit",
    formulaName: "Young double-slit interference",
    formula:
      "beta=lambda D/d; delta=r1-r2; I/Imax=(1+mu cos(2 pi delta/lambda))/2",
    status: statusForBenchmarks(youngDoubleSlitBenchmarks),
    assumptions: [
      "The fringe-spacing shortcut uses the small-angle and far-field approximations.",
      "Exact geometric path lengths determine the selected-point phase and intensity.",
      "The coherence control scales fringe visibility between zero and one.",
    ],
    inputUnits: [
      si("wavelengthM", "Wavelength", "m", "nm"),
      si("slitSeparationM", "Slit separation", "m", "mm"),
      si("screenDistanceM", "Screen distance", "m"),
      si("probeYM", "Probe position", "m", "mm"),
    ],
    outputUnits: [
      si("betaM", "Fringe spacing", "m", "mm"),
      si("pathDifferenceM", "Path difference", "m", "µm"),
      si("phaseDifferenceRad", "Phase difference", "rad"),
      si("intensity", "Relative intensity", "relative"),
    ],
    validRanges: [
      {
        id: "wavelengthM",
        label: "Wavelength",
        min: 380e-9,
        max: 700e-9,
        unit: "m",
      },
      {
        id: "slitSeparationM",
        label: "Slit separation",
        min: 0.00005,
        max: 0.002,
        unit: "m",
      },
      {
        id: "screenDistanceM",
        label: "Screen distance",
        min: 0.2,
        max: 3,
        unit: "m",
      },
    ],
    benchmarkCases: youngDoubleSlitBenchmarks,
    tolerance: 1e-7,
    graphExpectations: [
      {
        id: "intensity-y",
        label: "Screen intensity",
        xLabel: "screen position",
        yLabel: "relative intensity",
        shape: "qualitative",
      },
    ],
    warnings: [
      "The app flags selected points outside the stated small-angle range and retains exact path geometry there.",
    ],
  },
};

export function getExperimentValidationMetadata(experimentId: string) {
  return experimentValidationRegistry[experimentId];
}

export function validationStatusForExperiment(experimentId: string) {
  return (
    getExperimentValidationMetadata(experimentId)?.status ?? "needs-benchmark"
  );
}

type ExperimentValidationSummary = Record<ValidationClaimStatus, number> & {
  total: number;
  failed: number;
  warnings: number;
};

const emptyExperimentValidationSummary: ExperimentValidationSummary = {
  total: 0,
  validated: 0,
  "formula-only": 0,
  "qualitative-visual": 0,
  "needs-benchmark": 0,
  "unsafe-claim": 0,
  failed: 0,
  warnings: 0,
};

export const experimentValidationSummary = Object.values(
  experimentValidationRegistry,
).reduce<ExperimentValidationSummary>(
  (summary, item) => {
    summary.total += 1;
    summary[item.status] += 1;
    if (item.benchmarkCases.some((benchmark) => !benchmark.pass))
      summary.failed += 1;
    if (item.warnings.length) summary.warnings += item.warnings.length;
    return summary;
  },
  { ...emptyExperimentValidationSummary },
);
