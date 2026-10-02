import type { PhysicsIconName } from "./icons";

export interface ClientDemo {
  rank: number;
  title: string;
  path: string;
  icon: PhysicsIconName;
  category: "Flagship" | "Immersive Science" | "Interactive Lab" | "Education Platform";
  duration: string;
  pitch: string;
  show: string[];
  accent: "cyan" | "violet" | "amber" | "green";
}

export const clientDemos: ClientDemo[] = [
  { rank: 1, title: "Pro Lab Mission Program", path: "/pro-lab", icon: "rocket", category: "Flagship", duration: "4 min", accent: "amber", pitch: "A professional operations suite with six advanced scientific missions, procedures, anomalies, telemetry, and post-mission reporting.", show: ["Open the mission directory", "Enter launch operations", "Inject and resolve an anomaly"] },
  { rank: 2, title: "Build & Launch a Rocket", path: "/pro-lab/launch-vehicle", icon: "rocket", category: "Flagship", duration: "7 min", accent: "cyan", pitch: "Learners integrate the vehicle, load propellants, complete authentic go/no-go checks, and fly a virtual ascent.", show: ["Drag components into stack order", "Explain the purpose of each step", "Complete countdown and launch"] },
  { rank: 3, title: "Rocket Parts & Systems", path: "/rocket-lab/parts", icon: "settings", category: "Flagship", duration: "6 min", accent: "cyan", pitch: "A 225-component aerospace museum and engineering library with cutaway location, functional flows, inspection, and Build Lab integration.", show: ["Search IMU or turbopump", "Open engineering tabs", "Add a compatible part to the build"] },
  { rank: 4, title: "Scale of the Universe", path: "/physics/scale-of-universe", icon: "ruler", category: "Immersive Science", duration: "4 min", accent: "violet", pitch: "A powers-of-ten journey from subatomic scales to the observable universe with comparisons, guided journeys, and classroom controls.", show: ["Zoom across orders of magnitude", "Compare familiar objects", "Run a guided journey"] },
  { rank: 5, title: "String Theory 3D", path: "/string-theory", icon: "wave", category: "Immersive Science", duration: "3 min", accent: "violet", pitch: "Interactive theoretical-physics visuals connect vibrating modes, extra dimensions, and quantum-gravity concepts without overselling certainty.", show: ["Change vibration mode", "Inspect extra dimensions", "Open evidence boundaries"] },
  { rank: 6, title: "Particle Physics Explorer", path: "/particle-physics", icon: "atom", category: "Immersive Science", duration: "4 min", accent: "violet", pitch: "A visual Standard Model explorer covering quarks, leptons, force carriers, the Higgs field, and key interactions.", show: ["Open the Standard Model", "Inspect a particle family", "Compare interaction roles"] },
  { rank: 7, title: "Quantum Laboratory", path: "/quantum", icon: "atom", category: "Interactive Lab", duration: "4 min", accent: "violet", pitch: "Advanced experiments combine visual models, equations, adjustable parameters, and scientific interpretation.", show: ["Select a quantum experiment", "Change a parameter", "Connect graph and model"] },
  { rank: 8, title: "Earth Atmosphere Explorer", path: "/atmosphere", icon: "orbit", category: "Immersive Science", duration: "3 min", accent: "green", pitch: "An interactive vertical journey through atmospheric layers, phenomena, vehicles, and physical conditions.", show: ["Move between layers", "Compare temperature and altitude", "Inspect aurora and orbital regions"] },
  { rank: 9, title: "Astrophysics Observatory", path: "/astrophysics?concept=black-hole-lensing", icon: "orbit", category: "Immersive Science", duration: "4 min", accent: "violet", pitch: "Client-ready space science modules cover black-hole lensing, stellar evolution, galaxies, and the cosmic timeline.", show: ["Open black-hole lensing", "Change the observing model", "Visit the galaxy atlas"] },
  { rank: 10, title: "100+ Physics Innovations", path: "/physics-innovations", icon: "spark", category: "Education Platform", duration: "3 min", accent: "amber", pitch: "A searchable discovery timeline links major ideas, instruments, inventions, and their real-world impact.", show: ["Search laser or transistor", "Filter the timeline", "Open a milestone story"] },
  { rank: 11, title: "Chladni Plate", path: "/experiments/chladni-plate", icon: "wave", category: "Interactive Lab", duration: "3 min", accent: "cyan", pitch: "A memorable standing-wave demonstration where changing resonance produces increasingly complex nodal patterns.", show: ["Enable the visual model", "Sweep frequency", "Explain why particles collect at nodes"] },
  { rank: 12, title: "Single-Slit Diffraction", path: "/experiments/single-slit-diffraction", icon: "prism", category: "Interactive Lab", duration: "3 min", accent: "cyan", pitch: "Live optics visualization connects slit width and wavelength to diffraction geometry, graphs, formulas, and observations.", show: ["Change slit width", "Measure central maximum", "Compare model and equation"] },
  { rank: 13, title: "Video Motion Analysis", path: "/video", icon: "eye", category: "Interactive Lab", duration: "4 min", accent: "green", pitch: "Turn recorded motion into calibrated measurements, tracked positions, and evidence-ready analysis.", show: ["Load a sample", "Set scale and track motion", "Review the generated graph"] },
  { rank: 14, title: "Knowledge Graph", path: "/graph", icon: "orbit", category: "Education Platform", duration: "3 min", accent: "green", pitch: "A connected map shows how concepts, experiments, formulas, and curriculum outcomes reinforce one another.", show: ["Select a concept node", "Trace related experiments", "Open a linked learning asset"] },
  { rank: 15, title: "Teacher Insights & Deployment", path: "/insights-center", icon: "teacher", category: "Education Platform", duration: "5 min", accent: "green", pitch: "Close the presentation with assignments, readiness analytics, intervention signals, accessibility, and release-quality evidence.", show: ["Review class readiness", "Open an intervention", "Show validation and accessibility gates"] },
];
