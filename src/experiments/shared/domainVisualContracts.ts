export type PhysicsVisualDomain =
  | "mechanics"
  | "waves"
  | "electricity"
  | "magnetism"
  | "optics"
  | "fluids"
  | "thermodynamics";

export type VisualOverlay =
  | "force-arrows"
  | "velocity-arrows"
  | "acceleration-arrows"
  | "free-body-diagram"
  | "motion-trail"
  | "energy-bars"
  | "graph-cursor"
  | "slow-motion-replay"
  | "wavefronts"
  | "phase-markers"
  | "amplitude-ruler"
  | "detector-probe"
  | "interference-map"
  | "time-graph"
  | "circuit-board"
  | "glowing-wires"
  | "charge-particles"
  | "switch-states"
  | "meters"
  | "voltage-current-labels"
  | "overload-hints"
  | "magnetic-field-lines"
  | "compass-needles"
  | "polarity-labels"
  | "flux-loops"
  | "induced-current-direction"
  | "field-heat-map"
  | "ray-tracing"
  | "normal-lines"
  | "focal-points"
  | "angle-arcs"
  | "image-screen"
  | "prism-spectrum"
  | "sign-convention"
  | "streamlines"
  | "pressure-probes"
  | "density-coloring"
  | "buoyancy-arrows"
  | "depth-rulers"
  | "particle-flow"
  | "particle-container"
  | "temperature-map"
  | "collision-density"
  | "pressure-gauge"
  | "energy-packets"
  | "heat-flow-arrows";

export interface DomainVisualContract {
  domain: PhysicsVisualDomain;
  stageLanguage: string;
  requiredOverlays: VisualOverlay[];
  nonColorCues: string[];
  measurementExpectation: string;
}

export const domainVisualContracts: Record<PhysicsVisualDomain, DomainVisualContract> = {
  mechanics: {
    domain: "mechanics",
    stageLanguage: "A physical scene with bodies, tracks, force vectors, motion trails, free-body diagrams, energy bars, graph cursor, and replayable slow motion.",
    requiredOverlays: ["force-arrows", "velocity-arrows", "acceleration-arrows", "free-body-diagram", "motion-trail", "energy-bars", "graph-cursor", "slow-motion-replay"],
    nonColorCues: ["arrow labels", "dashed trails", "vector names", "numeric force badges"],
    measurementExpectation: "Every vector and graph cursor must show the measured value with SI units.",
  },
  waves: {
    domain: "waves",
    stageLanguage: "A synchronized wave tank or acoustic stage with wavefronts, phase markers, amplitude ruler, detector probe, interference map, and time graph.",
    requiredOverlays: ["wavefronts", "phase-markers", "amplitude-ruler", "detector-probe", "interference-map", "time-graph"],
    nonColorCues: ["crest/trough labels", "phase numbers", "amplitude ruler ticks", "probe readout"],
    measurementExpectation: "Wave speed, wavelength, frequency, phase, and detector amplitude must stay synchronized.",
  },
  electricity: {
    domain: "electricity",
    stageLanguage: "A circuit-board scene with glowing conductors, moving charge particles, switch states, meters, voltage/current labels, and overload hints.",
    requiredOverlays: ["circuit-board", "glowing-wires", "charge-particles", "switch-states", "meters", "voltage-current-labels", "overload-hints"],
    nonColorCues: ["charge arrows", "meter needles", "switch labels", "warning text"],
    measurementExpectation: "Voltage, current, resistance, and power must be shown at the component where they are measured.",
  },
  magnetism: {
    domain: "magnetism",
    stageLanguage: "A field-view scene with magnetic field lines, compass needles, polarity labels, flux loops, induced current direction, and field strength heat map.",
    requiredOverlays: ["magnetic-field-lines", "compass-needles", "polarity-labels", "flux-loops", "induced-current-direction", "field-heat-map"],
    nonColorCues: ["N/S text labels", "arrowed loops", "compass tick marks", "flux count"],
    measurementExpectation: "Field direction, flux change, and induced current direction must be distinguishable without relying on color alone.",
  },
  optics: {
    domain: "optics",
    stageLanguage: "A ray-bench scene with rays, normal lines, focal points, angle arcs, screen/image formation, prism spectrum, and sign convention overlay.",
    requiredOverlays: ["ray-tracing", "normal-lines", "focal-points", "angle-arcs", "image-screen", "prism-spectrum", "sign-convention"],
    nonColorCues: ["ray labels", "normal markers", "angle text", "screen labels"],
    measurementExpectation: "Object distance, image distance, angle, focal length, and screen position must be visible near the optical element.",
  },
  fluids: {
    domain: "fluids",
    stageLanguage: "A fluid tank or pipe scene with streamlines, pressure probes, density coloring, buoyancy arrows, depth rulers, and particle flow.",
    requiredOverlays: ["streamlines", "pressure-probes", "density-coloring", "buoyancy-arrows", "depth-rulers", "particle-flow"],
    nonColorCues: ["probe needles", "depth ticks", "arrow labels", "density legend"],
    measurementExpectation: "Depth, pressure, speed, density, and buoyant force must be measured at the probe location.",
  },
  thermodynamics: {
    domain: "thermodynamics",
    stageLanguage: "A particle-container scene with temperature color map, collision density, pressure gauge, energy packets, and heat-flow arrows.",
    requiredOverlays: ["particle-container", "temperature-map", "collision-density", "pressure-gauge", "energy-packets", "heat-flow-arrows"],
    nonColorCues: ["thermometer ticks", "pressure gauge needle", "packet labels", "particle speed trails"],
    measurementExpectation: "Temperature, pressure, volume, energy transfer, and particle collision rate must agree with the formula state.",
  },
};

export function visualContractForDomain(domain: PhysicsVisualDomain) {
  return domainVisualContracts[domain];
}
