import type { PhysicsVisualDomain, VisualOverlay } from "./domainVisualContracts";
import type { ValidationClaimStatus } from "./validation";

export type Top30MigrationPhase =
  | "phase-1-foundation"
  | "phase-2-mechanics"
  | "phase-3-waves"
  | "phase-4-electricity-magnetism"
  | "phase-5-optics-fluids-thermal"
  | "phase-6-polish-validation";

export interface Top30PresetPlan {
  id: "beginner-demo" | "misconception-demo" | "real-world-demo";
  label: string;
  intent: string;
}

export interface Top30ExperimentMeta {
  id: string;
  domain: PhysicsVisualDomain;
  visualConcept: string;
  requiredOverlays: VisualOverlay[];
  requiredPresets: Top30PresetPlan[];
  validationType: ValidationClaimStatus;
  migrationPhase: Top30MigrationPhase;
  classroomFocus: string;
  mobilePriority: string;
}

const basePresets: Top30PresetPlan[] = [
  { id: "beginner-demo", label: "Beginner demo", intent: "Start with one obvious variable change and one observation." },
  { id: "misconception-demo", label: "Misconception demo", intent: "Expose the most common wrong prediction safely." },
  { id: "real-world-demo", label: "Real-world demo", intent: "Use values that feel connected to a classroom or daily-life example." },
];

const mechanicsOverlays: VisualOverlay[] = ["force-arrows", "velocity-arrows", "acceleration-arrows", "free-body-diagram", "motion-trail", "energy-bars", "graph-cursor", "slow-motion-replay"];
const wavesOverlays: VisualOverlay[] = ["wavefronts", "phase-markers", "amplitude-ruler", "detector-probe", "interference-map", "time-graph"];
const electricityOverlays: VisualOverlay[] = ["circuit-board", "glowing-wires", "charge-particles", "switch-states", "meters", "voltage-current-labels", "overload-hints"];
const magnetismOverlays: VisualOverlay[] = ["magnetic-field-lines", "compass-needles", "polarity-labels", "flux-loops", "induced-current-direction", "field-heat-map"];
const opticsOverlays: VisualOverlay[] = ["ray-tracing", "normal-lines", "focal-points", "angle-arcs", "image-screen", "prism-spectrum", "sign-convention"];
const fluidsOverlays: VisualOverlay[] = ["streamlines", "pressure-probes", "density-coloring", "buoyancy-arrows", "depth-rulers", "particle-flow"];
const thermalOverlays: VisualOverlay[] = ["particle-container", "temperature-map", "collision-density", "pressure-gauge", "energy-packets", "heat-flow-arrows"];

export const top30ExperimentRegistry: Record<string, Top30ExperimentMeta> = {
  "circular-motion": top30("circular-motion", "mechanics", "Orbital table with inward force vector, tangent velocity, radius ruler, omega dial, and quadratic force graph.", mechanicsOverlays, "validated", "phase-2-mechanics", "Centripetal force is inward while velocity is tangent."),
  "elastic-collision": top30("elastic-collision", "mechanics", "Air-track collision stage with slow-motion impact, momentum bars, kinetic-energy bars, and before/after velocity ghosts.", mechanicsOverlays, "validated", "phase-2-mechanics", "Momentum and kinetic energy both survive an ideal 1D elastic collision."),
  friction: top30("friction", "mechanics", "Surface texture stage with static threshold, kinetic slide, opposing friction vector, and acceleration graph cursor.", mechanicsOverlays, "validated", "phase-2-mechanics", "Friction can hold until a threshold, then motion changes state."),
  "hooke-s-law": top30("hooke-s-law", "mechanics", "Spring bench with extension ruler, restoring-force arrow, stored-energy bar, and linear F-x graph.", mechanicsOverlays, "validated", "phase-2-mechanics", "The restoring force is proportional and opposite to displacement."),
  "inclined-plane": top30("inclined-plane", "mechanics", "Tilted ramp with free-body decomposition, normal/friction arrows, downhill acceleration, and flat-plane edge-case replay.", mechanicsOverlays, "validated", "phase-2-mechanics", "Gravity splits into parallel and perpendicular components."),
  "uniform-motion": top30("uniform-motion", "mechanics", "Motion-track cinema with ghost trails, stopwatch markers, slope cursor, distance-time graph, and velocity-time strip.", mechanicsOverlays, "validated", "phase-2-mechanics", "Constant velocity appears as a straight distance-time graph."),
  "newton-s-second-law": top30("newton-s-second-law", "mechanics", "Force-cart lab with net-force vector, mass blocks, acceleration readout, and F/m benchmark panel.", mechanicsOverlays, "validated", "phase-2-mechanics", "Acceleration follows net force divided by mass."),
  "conservation-of-energy": top30("conservation-of-energy", "mechanics", "Energy skate track with height ruler, speed glow, kinetic/potential bars, and loss toggle.", mechanicsOverlays, "validated", "phase-2-mechanics", "Mechanical energy transfers between height and speed."),
  "simple-pendulum": top30("simple-pendulum", "mechanics", "Pendulum theater with length ruler, period timer, angle arc, damping trail, and small-angle warning.", mechanicsOverlays, "validated", "phase-2-mechanics", "Length controls period more than mass in the small-angle model."),
  "projectile-motion": top30("projectile-motion", "mechanics", "Launch arena with vector decomposition, ghost trajectory, peak/range labels, and synchronized x/y graphs.", mechanicsOverlays, "validated", "phase-2-mechanics", "Horizontal and vertical motion combine into one path."),

  "chladni-plate": top30("chladni-plate", "waves", "Vibrating plate with nodal sand migration, heat-map intensity, mode selector, and qualitative-model warning.", wavesOverlays, "qualitative-visual", "phase-3-waves", "Higher modes create more nodal structure."),
  "single-slit-diffraction": top30("single-slit-diffraction", "waves", "Slit-and-screen darkroom with adjustable aperture, spreading wavefronts, intensity bands, and minima rulers.", wavesOverlays, "validated", "phase-3-waves", "Narrower slits spread light more."),
  "wave-lab": top30("wave-lab", "waves", "Two-source ripple tank with draggable detector, phase markers, interference heat map, and amplitude-time graph.", wavesOverlays, "validated", "phase-3-waves", "Path difference controls constructive and destructive interference."),
  "young-double-slit": top30("young-double-slit", "waves", "Coherent-light bench with dual slits, fringe screen, path-difference probe, and fringe-spacing ruler.", wavesOverlays, "validated", "phase-3-waves", "Fringes come from coherent path difference."),
  "sound-wave-anatomy": top30("sound-wave-anatomy", "waves", "Air-column sound tunnel with compression bands, particle oscillation, amplitude ruler, and frequency pitch meter.", wavesOverlays, "validated", "phase-3-waves", "Sound transports energy while particles oscillate locally."),

  "ohms-law": top30("ohms-law", "electricity", "Circuit-board loop with glowing current flow, voltmeter, ammeter, resistor heat cue, and linear V-I graph.", electricityOverlays, "validated", "phase-4-electricity-magnetism", "Voltage, current, and resistance are measured at different parts of the circuit."),
  "series-parallel-resistance": top30("series-parallel-resistance", "electricity", "Configurable circuit board with branch current particles, equivalent resistance meter, and switchable topology.", electricityOverlays, "validated", "phase-4-electricity-magnetism", "Series and parallel paths change total resistance differently."),
  "emi-faraday": top30("emi-faraday", "magnetism", "Coil and magnet stage with flux ribbons, galvanometer needle, induced current arrow, and speed replay.", magnetismOverlays, "validated", "phase-4-electricity-magnetism", "Changing flux, not static flux, induces emf."),
  "ac-generator": top30("ac-generator", "magnetism", "Rotating coil generator with field poles, slip rings, current reversal, and synchronized sine output.", magnetismOverlays, "validated", "phase-4-electricity-magnetism", "A rotating coil makes alternating emf."),
  "transformer-lab": top30("transformer-lab", "magnetism", "Transformer core with linked flux, primary/secondary coil counts, voltage bars, and load warning.", magnetismOverlays, "validated", "phase-4-electricity-magnetism", "Turns ratio controls voltage in an ideal transformer."),
  electromagnet: top30("electromagnet", "magnetism", "Current-carrying coil with iron core, field-line density, compass probes, and polarity flip.", magnetismOverlays, "validated", "phase-4-electricity-magnetism", "Current and turns strengthen the magnetic field."),
  "magnetic-field-current": top30("magnetic-field-current", "magnetism", "Straight-wire field lab with circular field lines, compass ring, current slider, and right-hand rule overlay.", magnetismOverlays, "validated", "phase-4-electricity-magnetism", "Field direction wraps around current."),

  "reflection-plane-mirror": top30("reflection-plane-mirror", "optics", "Mirror bench with incident/reflected rays, normal line, angle arcs, and virtual image construction.", opticsOverlays, "validated", "phase-5-optics-fluids-thermal", "Angle of incidence equals angle of reflection."),
  "lens-formula": top30("lens-formula", "optics", "Ray bench with object, lens, focal points, screen image, sign convention, and equation cursor.", opticsOverlays, "validated", "phase-5-optics-fluids-thermal", "Image position follows focal length and object distance."),
  "prism-dispersion": top30("prism-dispersion", "optics", "Prism darkroom with white beam, normals, split spectrum, material selector, and deviation angle.", opticsOverlays, "validated", "phase-5-optics-fluids-thermal", "Different wavelengths refract by different amounts."),
  "total-internal-reflection": top30("total-internal-reflection", "optics", "Glass-water interface with critical angle dial, evanescent cue, and reflected/transmitted ray labels.", opticsOverlays, "validated", "phase-5-optics-fluids-thermal", "Beyond the critical angle, light reflects internally."),
  "human-eye-defects": top30("human-eye-defects", "optics", "Eye focus simulator with retina, cornea/lens, myopia/hyperopia focus point, and corrective lens selector.", opticsOverlays, "validated", "phase-5-optics-fluids-thermal", "Corrective lenses move focus back onto the retina."),

  buoyancy: top30("buoyancy", "fluids", "Water tank with submerged volume, displaced-fluid meter, buoyancy/weight arrows, density slider, and float state.", fluidsOverlays, "validated", "phase-5-optics-fluids-thermal", "Buoyant force equals weight of displaced fluid."),
  "bernoulli-fluid-flow": top30("bernoulli-fluid-flow", "fluids", "Venturi pipe with streamlines, pressure probes, speed particles, and pressure-speed tradeoff graph.", fluidsOverlays, "validated", "phase-5-optics-fluids-thermal", "Faster flow corresponds to lower static pressure in the ideal model."),
  "gas-laws": top30("gas-laws", "thermodynamics", "Particle container with piston, temperature map, pressure gauge, collision density, and P-V-T graph.", thermalOverlays, "validated", "phase-5-optics-fluids-thermal", "Pressure responds to temperature, volume, and particle collisions."),
};

function top30(
  id: string,
  domain: PhysicsVisualDomain,
  visualConcept: string,
  requiredOverlays: VisualOverlay[],
  validationType: ValidationClaimStatus,
  migrationPhase: Top30MigrationPhase,
  classroomFocus: string,
): Top30ExperimentMeta {
  return {
    id,
    domain,
    visualConcept,
    requiredOverlays,
    requiredPresets: basePresets,
    validationType,
    migrationPhase,
    classroomFocus,
    mobilePriority: "Visual first, sticky observation, collapsed controls, 44px controls, no horizontal overflow.",
  };
}

export const top30ExperimentIds = Object.keys(top30ExperimentRegistry);

export function getTop30ExperimentMeta(experimentId: string) {
  return top30ExperimentRegistry[experimentId];
}

export function isTop30Experiment(experimentId: string) {
  return Boolean(top30ExperimentRegistry[experimentId]);
}

export function listTop30ExperimentMeta() {
  return Object.values(top30ExperimentRegistry);
}

export function listTop30ByPhase(phase: Top30MigrationPhase) {
  return listTop30ExperimentMeta().filter((item) => item.migrationPhase === phase);
}
