import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ExperimentDefinition } from "../types";
import { iconForExperiment, PhysicsIcon } from "../lib/icons";
import { FullscreenButton } from "./FullscreenButton";
import { makePrismModel } from "../lib/prism";
import { getExperimentVisualizationSpec, isPanePending } from "../lib/experimentVisualizationSpecs";
import { PendingVisualizationCard } from "./PendingVisualizationCard";

type AnimationKind =
  | "projectile"
  | "graph3d"
  | "force"
  | "forceBalance"
  | "freeFall"
  | "massWeight"
  | "workPower"
  | "vector3d"
  | "rotationalDynamics"
  | "satelliteOrbit"
  | "uniformMotion"
  | "elasticCollision"
  | "hookesLaw"
  | "incline"
  | "energy"
  | "pendulum"
  | "circular"
  | "gravity"
  | "buoyancy"
  | "densityTank"
  | "fluid"
  | "bernoulliVenturi"
  | "thermal"
  | "calorimetry"
  | "thermoProcess"
  | "statisticalEnsemble"
  | "circuit"
  | "staticElectricity"
  | "electrostaticField"
  | "electrolysis"
  | "meterBridge"
  | "internalCell"
  | "kirchhoff3d"
  | "lcr3d"
  | "electromagnet"
  | "lorentz3d"
  | "induction"
  | "generator"
  | "transformer"
  | "lens"
  | "eye"
  | "prism"
  | "planeMirror3d"
  | "glassSlab3d"
  | "shadowEclipse3d"
  | "multipleReflection3d"
  | "opticalInstrument3d"
  | "waveLab3d"
  | "chladni3d"
  | "echo3d"
  | "soundPitch3d"
  | "springShm3d"
  | "spectrum3d"
  | "polarization3d"
  | "measurement3d"
  | "nuclearDecay3d"
  | "diode3d"
  | "energySources3d"
  | "quantumOperators3d"
  | "computationalWorkflow3d"
  | "interference"
  | "photoelectric"
  | "bohr"
  | "coupledOscillator"
  | "logic";

interface AnimationConfig {
  kind: AnimationKind;
  title: string;
  cue: string;
  cinematic?: boolean;
  steps?: string[];
}

const animationConfigs: Record<string, AnimationConfig> = {
  "projectile-motion": { kind: "projectile", title: "Cinematic projectile motion", cue: "Watch launch velocity split into horizontal and vertical components, then track the ball, shadow, peak, and range in one scene.", cinematic: true, steps: ["Resolve launch velocity", "Track x and y independently", "Locate peak and landing range"] },
  "distance-time-graph": { kind: "graph3d", title: "3D distance-time graph", cue: "A cart and its live graph move together, so the slope becomes visible as speed instead of just a formula.", cinematic: true, steps: ["Set speed", "Watch distance build", "Read slope as speed"] },
  "free-fall": { kind: "freeFall", title: "3D free-fall drop tower", cue: "A sphere drops through timer gates; equal-time ghost marks spread farther apart as speed increases.", cinematic: true, steps: ["Release from height", "Pass timer gates", "Read increasing velocity"] },
  "mass-and-weight": { kind: "massWeight", title: "3D mass and weight comparison", cue: "Mass stays on the balance while the spring scale stretches differently as local gravity changes.", cinematic: true, steps: ["Set mass", "Change local g", "Compare balance and spring scale"] },
  "work-power": { kind: "workPower", title: "3D work and power apparatus", cue: "A force pulls a load through a measured distance; the meter separates work in joules from power in watts.", cinematic: true, steps: ["Apply force", "Measure displacement", "Compare work and power"] },
  "vector-resolution": { kind: "vector3d", title: "3D vector decomposition", cue: "The resultant vector is projected onto coordinate axes so components reconstruct the original vector.", cinematic: true, steps: ["Set magnitude and angle", "Project onto axes", "Compare components"] },
  "rotational-dynamics": { kind: "rotationalDynamics", title: "3D torque flywheel", cue: "A tangential force on a lever arm creates torque; larger moment of inertia slows angular acceleration.", cinematic: true, steps: ["Set lever radius", "Apply tangential force", "Read angular acceleration"] },
  "satellite-orbit": { kind: "satelliteOrbit", title: "3D orbit and escape lab", cue: "A satellite carries a tangential velocity arrow while gravity points inward; high speed bends into escape.", cinematic: true, steps: ["Set orbital radius", "Compare circular speed", "Cross escape threshold"] },
  "newton-s-second-law": { kind: "force", title: "3D force and acceleration", cue: "The cart responds to net force; the red vector grows when force dominates friction." },
  friction: { kind: "force", title: "3D friction response", cue: "Surface drag opposes motion, showing why applied force must cross the friction threshold." },
  "balanced-unbalanced-forces": { kind: "forceBalance", title: "3D balanced forces", cue: "Opposite pulls compete on the same body; the net arrow only appears when one side wins.", steps: ["Compare left and right pulls", "Find net force", "Predict acceleration"] },
  "inclined-plane": { kind: "incline", title: "3D inclined plane", cue: "The block slides along a tilted plane while gravity splits into normal and parallel components." },
  "conservation-of-energy": { kind: "energy", title: "3D energy conversion", cue: "Height becomes speed as the ball rolls down the ramp; losses reduce the final motion." },
  "simple-pendulum": { kind: "pendulum", title: "3D pendulum swing", cue: "The bob swings in depth so length and damping become visible, not just numeric." },
  "circular-motion": { kind: "circular", title: "3D circular motion", cue: "The orbiting mass shows velocity around the circle and inward centripetal pull." },
  "universal-gravitation": { kind: "gravity", title: "3D gravity field map", cue: "A test mass orbits through nested field shells while the attraction arrow shrinks with distance squared.", cinematic: true, steps: ["Increase source mass", "Move the test mass away", "Watch inverse-square weakening"] },
  "uniform-motion": { kind: "uniformMotion", title: "3D uniform motion track", cue: "The cart passes equally spaced markers at equal time intervals, making constant velocity visible.", cinematic: true, steps: ["Set speed", "Watch equal spacing", "Read constant velocity"] },
  "elastic-collision": { kind: "elasticCollision", title: "3D elastic collision track", cue: "Two carts exchange velocity according to mass while momentum and kinetic energy bars stay balanced.", cinematic: true, steps: ["Set masses", "Watch collision", "Compare momentum and energy"] },
  "hooke-s-law": { kind: "hookesLaw", title: "3D Hooke's law spring rig", cue: "A hanging mass stretches a spring against a ruler; force and extension remain proportional inside the elastic region.", cinematic: true, steps: ["Set spring constant", "Add force", "Read extension"] },
  buoyancy: { kind: "buoyancy", title: "3D buoyancy tank", cue: "The block bobs in water while submerged volume represents displaced fluid." },
  "density-float-sink": { kind: "densityTank", title: "3D float-or-sink tank", cue: "The block settles to a depth set by density ratio, making floating, neutral buoyancy, and sinking easy to compare.", steps: ["Compare densities", "Watch submerged fraction", "Classify the object state"] },
  "fluid-pressure": { kind: "fluid", title: "3D fluid pressure", cue: "The pressure probe moves through depth; flow markers make pressure direction easier to see." },
  "force-and-pressure": { kind: "fluid", title: "3D pressure field", cue: "The same force over a smaller contact area creates a stronger pressure response." },
  "bernoulli-fluid-flow": { kind: "bernoulliVenturi", title: "3D Bernoulli venturi", cue: "Flow speeds up through the narrow throat while static pressure gauges drop, showing the pressure-speed tradeoff.", cinematic: true, steps: ["Compare wide and narrow area", "Watch throat velocity increase", "Read pressure drop"] },
  "heat-and-temperature": { kind: "thermal", title: "3D thermal particles", cue: "Particle speed and glow rise with temperature to separate heat energy from temperature reading." },
  "heat-transfer": { kind: "thermal", title: "3D heat transfer", cue: "Energy packets migrate through a slab, slowing when the material is thicker." },
  "gas-laws": { kind: "thermal", title: "3D gas container", cue: "Particles collide with the walls while volume and temperature change pressure." },
  "thermodynamic-process": { kind: "thermoProcess", title: "3D thermodynamic process piston", cue: "A gas piston, heat arrows, pressure gauge, and compact P-V path show how process type changes work and heat exchange.", cinematic: true, steps: ["Choose process type", "Watch piston and heat exchange", "Compare work on the P-V path"] },
  "calorimetry-mixing": { kind: "calorimetry", title: "3D calorimetry mixing", cue: "Hot and cold streams merge inside an insulated cup; the thermometer climbs toward the heat-balance temperature.", cinematic: true, steps: ["Pour hot sample", "Add cold sample", "Reach thermal equilibrium"] },
  "statistical-ensemble-lab": { kind: "statisticalEnsemble", title: "3D ensemble distribution", cue: "Particles occupy a state-space box while a histogram wall shows the mean and spread of the ensemble.", cinematic: true, steps: ["Sample many microstates", "Watch spread change", "Read ensemble mean"] },
  "ohms-law": { kind: "circuit", title: "3D charge flow", cue: "Charges move around the loop; bulb glow and carrier speed track current." },
  "series-parallel-resistance": { kind: "circuit", title: "3D circuit paths", cue: "The loop shows how resistance changes the visible charge-flow rate." },
  "electric-power": { kind: "circuit", title: "3D power output", cue: "The load glows as voltage and current combine into useful electrical power." },
  "heating-effect-current": { kind: "circuit", title: "3D Joule heating", cue: "The resistor warms as current rises, emphasizing the squared current effect." },
  "static-electricity": { kind: "staticElectricity", title: "3D static electricity", cue: "Charged bodies exchange charge, then attract or repel with visible field lines and force arrows.", cinematic: true, steps: ["Charge by contact", "Compare signs", "Watch force and spark cue"] },
  "chemical-effects-current": { kind: "electrolysis", title: "3D electrolysis cell", cue: "Ions move through electrolyte toward electrodes while bubbles rise and deposit builds on the cathode.", cinematic: true, steps: ["Apply DC supply", "Move ions", "Build deposit"] },
  "capacitor-lab": { kind: "circuit", title: "3D capacitor charging", cue: "Charge gathers on the plates while stored energy rises with voltage." },
  "electrostatic-field-potential": { kind: "electrostaticField", title: "3D field and potential map", cue: "Point charges create field arrows and potential-height rings; a test charge feels force along the field.", cinematic: true, steps: ["Place source charge", "Read field", "Compare potential"] },
  "kirchhoff-circuit": { kind: "kirchhoff3d", title: "3D Kirchhoff circuit board", cue: "Junction nodes split current across loop branches while KCL and KVL labels stay tied to the board.", cinematic: true, steps: ["Trace incoming current", "Split at junction", "Check loop drops"] },
  "ac-lcr-resonance": { kind: "lcr3d", title: "3D LCR resonance lab", cue: "R, L, and C sit in series with an AC source, phasor wheel, oscilloscope, and resonance curve marker.", cinematic: true, steps: ["Set frequency", "Compare reactances", "Find peak current"] },
  "meter-bridge": { kind: "meterBridge", title: "3D meter bridge board", cue: "A jockey probe moves along the one-meter wire until the galvanometer needle reaches null.", cinematic: true, steps: ["Set ratio", "Move jockey", "Find null"] },
  "internal-resistance-cell": { kind: "internalCell", title: "3D internal resistance cell", cue: "The cell separates EMF from terminal voltage and shows internal voltage drop as load current rises.", cinematic: true, steps: ["Set load", "Watch internal drop", "Compare E and V"] },
  "electromagnet": { kind: "electromagnet", title: "3D electromagnet", cue: "A helical coil produces pulsing magnetic field loops around an iron core." },
  "magnetic-field-current": { kind: "electromagnet", title: "3D magnetic field", cue: "Current through the conductor wraps field loops around it." },
  "lorentz-force": { kind: "lorentz3d", title: "3D Lorentz force lab", cue: "A charged particle enters a uniform magnetic field; velocity, field, and force vectors reveal q(v x B), with negative charge reversing the bend.", cinematic: true, steps: ["Set charge sign", "Enter uniform B field", "Read force and radius"] },
  "emi-faraday": { kind: "induction", title: "Cinematic Faraday induction", cue: "Flux ribbons pass through the coil, the magnet moves, and the galvanometer responds when flux changes quickly.", cinematic: true, steps: ["Move magnet", "Change magnetic flux", "Induce emf and current"] },
  "ac-generator": { kind: "generator", title: "Cinematic AC generator", cue: "The rotating coil cuts magnetic flux; slip rings feed brushes while the waveform grows and reverses in sync.", cinematic: true, steps: ["Rotate coil in field", "Flux changes continuously", "Output becomes AC sine wave"] },
  "transformer-lab": { kind: "transformer", title: "Cinematic transformer", cue: "Primary AC creates changing core flux, the secondary coil receives it, and the voltage bars compare the turns ratio.", cinematic: true, steps: ["Primary AC drives flux", "Core links both coils", "Turns ratio sets secondary voltage"] },
  "lens-formula": { kind: "lens", title: "Cinematic lens bench", cue: "Object rays, focal planes, and image screen line up in 3D so the lens equation becomes a spatial story.", cinematic: true, steps: ["Send principal rays", "Bend through lens", "Form real or virtual image"] },
  "mirror-formula": { kind: "lens", title: "3D ray bench", cue: "Rays reflect or focus so object distance and focal length become spatial." },
  "reflection-plane-mirror": { kind: "planeMirror3d", title: "3D plane mirror reflection", cue: "An object and its virtual image stay symmetric across the mirror while incident and reflected rays keep equal angles.", cinematic: true, steps: ["Set incidence angle", "Compare i and r", "Check equal object-image distance"] },
  "glass-slab-refraction": { kind: "glassSlab3d", title: "3D glass slab refraction", cue: "The ray bends at both slab faces; the emergent ray remains parallel to the incident ray but is laterally shifted.", cinematic: true, steps: ["Enter first face", "Refract inside glass", "Exit parallel with lateral shift"] },
  "shadows-eclipses": { kind: "shadowEclipse3d", title: "3D shadows and eclipses", cue: "A source, occluding body, and receiver line up so umbra and penumbra regions are visible in space.", cinematic: true, steps: ["Align source and body", "Trace full shadow", "Separate umbra from penumbra"] },
  "multiple-reflection": { kind: "multipleReflection3d", title: "3D multiple reflection", cue: "Two ideal mirror panels form a V; smaller angles create more repeated virtual images and a kaleidoscope pattern.", cinematic: true, steps: ["Set mirror angle", "Place object between mirrors", "Count repeated images carefully"] },
  "human-eye-defects": { kind: "eye", title: "3D realistic eye focus", cue: "Trace rays through the corrective lens, cornea, eye lens, and retina. Myopia focuses before the retina; hypermetropia focuses behind it.", cinematic: true, steps: ["Choose the defect", "Watch the uncorrected focus", "Add the correct lens type"] },
  "prism-dispersion": { kind: "prism", title: "3D prism dispersion", cue: "White light separates into colored rays after refraction through the prism." },
  "total-internal-reflection": { kind: "prism", title: "3D total internal reflection", cue: "The ray reflects inside the denser medium after crossing the critical angle." },
  "optical-instruments": { kind: "opticalInstrument3d", title: "3D microscope and telescope tube", cue: "Objective and eyepiece lenses form an intermediate image, then send a final virtual image direction to the eye.", cinematic: true, steps: ["Choose telescope or microscope", "Form the intermediate image", "Compare objective and eyepiece magnification"] },
  "young-double-slit": { kind: "interference", title: "3D interference fringes", cue: "Two coherent sources make bright and dark bands on a distant screen." },
  "single-slit-diffraction": { kind: "interference", title: "3D diffraction spread", cue: "A narrow opening spreads the wavefront into a broad pattern." },
  "sound-wave-anatomy": { kind: "interference", title: "3D sound wave", cue: "Compression bands travel forward while particles vibrate back and forth." },
  "wave-lab": { kind: "waveLab3d", title: "3D wave lab", cue: "A string wave shows amplitude, wavelength, frequency, speed, and local medium motion separately from wave propagation.", cinematic: true, steps: ["Set amplitude and frequency", "Watch local particles oscillate", "Read v = f lambda"] },
  "chladni-plate": { kind: "chladni3d", title: "3D Chladni plate", cue: "A vibrating plate forms mode-dependent nodal lines where sand collects while antinode regions move.", cinematic: true, steps: ["Set mode/frequency", "Find stationary nodes", "Compare sand accumulation"] },
  "echo-speed-sound": { kind: "echo3d", title: "3D echo timing lab", cue: "A sound pulse travels to a reflecting wall and returns, making the factor of two in echo distance visible.", cinematic: true, steps: ["Send pulse", "Reflect at wall", "Use distance = v t / 2"] },
  "sound-pitch-loudness": { kind: "soundPitch3d", title: "3D pitch and loudness lab", cue: "The source vibration and pressure rings separate frequency as pitch from amplitude as loudness/intensity cue.", cinematic: true, steps: ["Change frequency", "Change amplitude", "Compare wavelength and loudness cue"] },
  "shm-spring": { kind: "springShm3d", title: "3D spring-mass SHM", cue: "A mass oscillates about equilibrium with restoring force, velocity, amplitude limits, and energy exchange cues.", cinematic: true, steps: ["Displace the mass", "Watch F = -kx", "Compare kinetic and spring energy"] },
  "em-spectrum": { kind: "spectrum3d", title: "3D electromagnetic spectrum", cue: "A spectrum wall shows radio through gamma regions with wavelength decreasing as frequency increases.", cinematic: true, steps: ["Move along spectrum", "Find visible band", "Compare c = f lambda"] },
  "polarization-lab": { kind: "polarization3d", title: "3D polarization and Malus law", cue: "Polarizer and analyzer planes show transmission axes, angle theta, and transmitted intensity from I = I0 cos^2 theta.", cinematic: true, steps: ["Set analyzer angle", "Compare axes", "Read transmitted intensity"] },
  "measurement-errors": { kind: "measurement3d", title: "3D measurement uncertainty bench", cue: "A measured object, instrument scale, repeated markers, mean, and uncertainty range separate precision from error.", cinematic: true, steps: ["Read the scale", "Compare repeated readings", "Estimate uncertainty"] },
  "nuclear-decay": { kind: "nuclearDecay3d", title: "3D half-life decay population", cue: "A cluster of unstable nuclei changes state while a half-life ring and curve show statistical population decay.", cinematic: true, steps: ["Set half-life", "Watch decay events", "Read remaining nuclei"] },
  "semiconductor-diode": { kind: "diode3d", title: "3D PN junction and rectifier", cue: "P and N regions, depletion zone, carriers, I-V knee, and rectified waveform show forward and reverse bias behavior.", cinematic: true, steps: ["Set bias", "Watch depletion barrier", "Compare rectified output"] },
  "sources-of-energy": { kind: "energySources3d", title: "3D energy source comparison", cue: "Mini apparatus for solar, wind, hydro, fossil, and nuclear sources compare output, reliability, and emissions.", cinematic: true, steps: ["Select a source", "Compare output bars", "Balance benefits and limits"] },
  "advanced-quantum-operators": { kind: "quantumOperators3d", title: "3D quantum operator state space", cue: "A state vector, operator axis, eigenbasis, and measurement bars show qualitative operator action.", cinematic: true, steps: ["Set state", "Apply operator", "Read expectation"] },
  "computational-physics-workflow": { kind: "computationalWorkflow3d", title: "3D computational workflow", cue: "Problem, discretization, solver iterations, convergence, error estimate, and result panel form one numerical-method pipeline.", cinematic: true, steps: ["Discretize the model", "Iterate solver", "Check convergence error"] },
  "photoelectric-equation": { kind: "photoelectric", title: "3D photoelectric effect", cue: "Photons strike the metal; electrons leave only when photon energy beats work function." },
  "de-broglie-wavelength": { kind: "interference", title: "3D matter-wave spread", cue: "Higher accelerating voltage shortens wavelength and tightens diffraction." },
  "special-relativity-bridge": { kind: "graph3d", title: "3D spacetime bridge", cue: "A light-clock path and spacetime graph stretch as speed approaches light speed.", cinematic: true, steps: ["Set speed fraction", "Watch gamma grow", "Compare time and length readings"] },
  "bohr-model": { kind: "bohr", title: "Cinematic Bohr transition", cue: "Energy shells, electron jump path, photon pulse, and level ladder reveal why each spectral line has a fixed energy.", cinematic: true, steps: ["Choose energy levels", "Electron jumps shell", "Photon carries energy gap"] },
  "chaotic-coupled-oscillators": { kind: "coupledOscillator", title: "3D coupled oscillator chaos", cue: "Two linked pendulum arms exchange energy. Increase the angle or coupling and the phase trail spreads instead of closing into a simple loop.", cinematic: true, steps: ["Set nearby initial angles", "Watch energy swap between arms", "Compare regular loops with chaotic phase spread"] },
  "logic-gates": { kind: "logic", title: "3D logic gate", cue: "Inputs feed a digital gate and the output indicator switches between 0 and 1." },
};

interface Experiment3DAnimationProps {
  experiment: ExperimentDefinition;
  values: [number, number, number];
  outputs?: { label: string; value: string }[];
  timelineTime?: number | null;
  fixedShell?: boolean;
}

export function has3DAnimation(experimentId: string) {
  return Boolean(experimentId);
}

export function Experiment3DAnimation({ experiment, values, outputs = [], timelineTime = null, fixedShell = false }: Experiment3DAnimationProps) {
  const visualizationSpec = getExperimentVisualizationSpec(experiment.id);
  const isPending3D = !visualizationSpec || isPanePending(visualizationSpec.threeD);
  const config = useMemo(() => isPending3D ? undefined : animationConfigs[experiment.id] ?? fallback3DConfig(experiment), [experiment, isPending3D]);
  const panelRef = useRef<HTMLElement | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const timelineTimeRef = useRef<number | null>(timelineTime);
  const sendViewCommand = (command: "reset" | "front" | "top" | "zoom-in" | "zoom-out") => {
    mountRef.current?.dispatchEvent(new CustomEvent("three-view-command", { detail: command }));
  };

  useEffect(() => {
    timelineTimeRef.current = typeof timelineTime === "number" ? timelineTime : null;
  }, [timelineTime]);

  useEffect(() => {
    if (!config) return undefined;
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    } catch {
      const fallback = document.createElement("div");
      fallback.className = "three-lab-fallback";
      fallback.innerHTML = "<strong>3D view needs WebGL.</strong><span>The guided animation and calculator still work in this browser.</span>";
      mount.replaceChildren(fallback);
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x020617, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = config.cinematic ? 0.92 : 0.86;
    const hint = document.createElement("div");
    hint.className = "three-control-hint";
    hint.textContent = "Drag rotate | Wheel zoom | Shift/right-drag pan";
    mount.replaceChildren(renderer.domElement, hint);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x020617, config.cinematic ? 9 : 8, config.cinematic ? 22 : 18);
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
    const composer = config.cinematic ? new EffectComposer(renderer) : null;
    const bloomPass = config.cinematic ? new UnrealBloomPass(new THREE.Vector2(1, 1), 0.16, 0.28, 0.42) : null;
    const ssaoPass = config.cinematic ? new SSAOPass(scene, camera, 1, 1) : null;
    if (composer && bloomPass && ssaoPass) {
      ssaoPass.kernelRadius = 10;
      ssaoPass.minDistance = 0.001;
      ssaoPass.maxDistance = 0.12;
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(ssaoPass);
      composer.addPass(bloomPass);
    }
    const cameraTarget = new THREE.Vector3(0, -0.12, 0);
    const orbit = {
      theta: 0.58,
      phi: 1.18,
      radius: config.cinematic ? 7.2 : 6.6,
      target: cameraTarget.clone(),
    };
    const setCameraFromOrbit = () => {
      const spherical = new THREE.Spherical(orbit.radius, orbit.phi, orbit.theta);
      camera.position.setFromSpherical(spherical).add(orbit.target);
      camera.lookAt(orbit.target);
    };
    setCameraFromOrbit();

    scene.add(new THREE.HemisphereLight(0xcffafe, 0x0f172a, 1.08));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.28);
    keyLight.position.set(3, 5, 5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x22d3ee, config.cinematic ? 12 : 6, 12);
    rimLight.position.set(-3, 2.5, 3);
    scene.add(rimLight);
    const warmLight = new THREE.PointLight(0xfacc15, config.cinematic ? 8 : 4, 10);
    warmLight.position.set(3.2, 1.8, -2.8);
    scene.add(warmLight);

    const root = new THREE.Group();
    scene.add(root);
    try {
      addGrid(root);
      addCinematicSet(root, config.kind, Boolean(config.cinematic));
      buildScene(config.kind, root, values);
    } catch {
      const fallback = document.createElement("div");
      fallback.className = "three-lab-fallback";
      fallback.innerHTML = "<strong>3D scene could not render.</strong><span>The 2D visualization, sliders, graph, and calculator are still available for this lab.</span>";
      mount.replaceChildren(fallback);
      renderer.dispose();
      return undefined;
    }

    const pointerState = {
      active: false,
      mode: "orbit" as "orbit" | "pan",
      x: 0,
      y: 0,
    };
    const clampOrbit = () => {
      orbit.phi = clamp(orbit.phi, 0.28, Math.PI / 2.05);
      orbit.radius = clamp(orbit.radius, 3.1, 13);
    };
    const panCamera = (dx: number, dy: number) => {
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0);
      const up = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 1);
      const scale = orbit.radius * 0.0016;
      orbit.target.addScaledVector(right, -dx * scale);
      orbit.target.addScaledVector(up, dy * scale);
    };
    const onPointerDown = (event: PointerEvent) => {
      pointerState.active = true;
      pointerState.mode = event.button === 2 || event.shiftKey ? "pan" : "orbit";
      pointerState.x = event.clientX;
      pointerState.y = event.clientY;
      mount.setPointerCapture(event.pointerId);
      mount.classList.add("three-lab-canvas-dragging");
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!pointerState.active) return;
      const dx = event.clientX - pointerState.x;
      const dy = event.clientY - pointerState.y;
      pointerState.x = event.clientX;
      pointerState.y = event.clientY;
      if (pointerState.mode === "pan") {
        panCamera(dx, dy);
      } else {
        orbit.theta -= dx * 0.006;
        orbit.phi += dy * 0.006;
        clampOrbit();
      }
    };
    const onPointerUp = (event: PointerEvent) => {
      pointerState.active = false;
      mount.releasePointerCapture(event.pointerId);
      mount.classList.remove("three-lab-canvas-dragging");
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      orbit.radius *= event.deltaY > 0 ? 1.08 : 0.92;
      clampOrbit();
    };
    const onContextMenu = (event: MouseEvent) => event.preventDefault();
    const onViewCommand = (event: Event) => {
      const command = (event as CustomEvent<"reset" | "front" | "top" | "zoom-in" | "zoom-out">).detail;
      if (command === "reset") {
        orbit.theta = 0.58;
        orbit.phi = 1.18;
        orbit.radius = config.cinematic ? 7.2 : 6.6;
        orbit.target.copy(cameraTarget);
      }
      if (command === "front") {
        orbit.theta = 0;
        orbit.phi = 1.2;
      }
      if (command === "top") {
        orbit.theta = 0.01;
        orbit.phi = 0.32;
      }
      if (command === "zoom-in") orbit.radius *= 0.82;
      if (command === "zoom-out") orbit.radius *= 1.18;
      clampOrbit();
    };
    mount.addEventListener("pointerdown", onPointerDown);
    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerup", onPointerUp);
    mount.addEventListener("pointercancel", onPointerUp);
    mount.addEventListener("wheel", onWheel, { passive: false });
    mount.addEventListener("contextmenu", onContextMenu);
    mount.addEventListener("three-view-command", onViewCommand);

    const resize = () => {
      const width = Math.max(320, mount.clientWidth);
      const height = Math.max(300, mount.clientHeight);
      renderer.setSize(width, height, false);
      composer?.setSize(width, height);
      if (ssaoPass) {
        ssaoPass.width = width;
        ssaoPass.height = height;
      }
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      const t = timelineTimeRef.current ?? clock.getElapsedTime();
      rimLight.intensity = (config.cinematic ? 30 : 8) + Math.sin(t * 1.2) * (config.cinematic ? 5 : 1.2);
      warmLight.intensity = (config.cinematic ? 16 : 5) + Math.cos(t * 0.9) * (config.cinematic ? 4 : 0.8);
      updateObjects(root, t, values);
      setCameraFromOrbit();
      if (composer) composer.render();
      else renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      mount.removeEventListener("pointerdown", onPointerDown);
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerup", onPointerUp);
      mount.removeEventListener("pointercancel", onPointerUp);
      mount.removeEventListener("wheel", onWheel);
      mount.removeEventListener("contextmenu", onContextMenu);
      mount.removeEventListener("three-view-command", onViewCommand);
      resizeObserver.disconnect();
      composer?.dispose();
      renderer.dispose();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const material = mesh.material;
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else if (material) {
          const map = (material as THREE.MeshStandardMaterial | THREE.SpriteMaterial).map;
          map?.dispose?.();
          material?.dispose?.();
        }
      });
      mount.replaceChildren();
    };
  }, [config, experiment.id, values]);

  if (!config) {
    // VISUALIZATION_PHASE_2: Replace pending 3D roadmap cards with experiment-specific apparatus scenes by assigned phase.
    return <PendingVisualizationCard experiment={experiment} pane="threeD" />;
  }

  const cardClassName = config.cinematic ? "three-lab-card three-lab-card-cinematic mt-5 fullscreen-target" : "three-lab-card mt-5 fullscreen-target";
  const setPanelRef = (element: HTMLElement | null) => {
    panelRef.current = element;
  };
  const header = (
    <div className={fixedShell ? "visual-disclosure-summary visual-disclosure-summary-fixed" : "visual-disclosure-summary"}>
      <div className="flex items-center gap-3">
        <span className="card-icon">
          <PhysicsIcon name={iconForExperiment(experiment)} />
        </span>
        <div>
          <p className="ui-label text-cyan-300">3D animation</p>
          <h2 className="text-lg font-black text-slate-100">{config.title}</h2>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <FullscreenButton targetRef={panelRef} compact />
        <button className="three-view-btn" type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); sendViewCommand("reset"); }} title="Reset 3D camera">
          <PhysicsIcon name="settings" className="h-3.5 w-3.5" />
          Reset
        </button>
        <button className="three-view-btn" type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); sendViewCommand("front"); }} title="Front view">
          Front
        </button>
        <button className="three-view-btn" type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); sendViewCommand("top"); }} title="Top view">
          Top
        </button>
        <button className="three-view-icon-btn" type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); sendViewCommand("zoom-in"); }} title="Zoom in">
          +
        </button>
        <button className="three-view-icon-btn" type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); sendViewCommand("zoom-out"); }} title="Zoom out">
          -
        </button>
        <span className="status-chip border-cyan-300/40 bg-cyan-300/10 text-cyan-100">{config.cinematic ? "cinematic explainer" : "responds to sliders"}</span>
      </div>
    </div>
  );
  const body = (
    <div className={config.cinematic ? "visual-disclosure-body mt-3 grid gap-3 xl:grid-cols-[minmax(0,1fr)_260px]" : "visual-disclosure-body mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_210px]"}>
      <div ref={mountRef} className={config.cinematic ? "three-lab-canvas three-lab-canvas-cinematic" : "three-lab-canvas"}>
        <div className="three-control-hint">
          Drag rotate | Wheel zoom | Shift/right-drag pan
        </div>
      </div>
      <div className="grid content-start gap-2">
        <div className="rounded-md border border-cyan-300/25 bg-slate-950/75 p-3">
          <div className="text-xs font-black uppercase tracking-widest text-cyan-200">guide</div>
          <p className="mt-2 text-xs leading-5 text-slate-300">{config.cue}</p>
        </div>
        {config.steps && (
          <div className="rounded-md border border-amber-300/25 bg-amber-300/10 p-3">
            <div className="text-xs font-black uppercase tracking-widest text-amber-200">concept flow</div>
            <div className="mt-2 grid gap-2">
              {config.steps.map((step, index) => (
                <div key={step} className="flex items-start gap-2 text-xs leading-5 text-slate-200">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-300 text-[10px] font-black text-slate-950">{index + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {outputs.slice(0, 3).map((output) => (
          <div key={output.label} className="rounded-md border border-slate-700 bg-slate-950/75 p-2">
            <div className="text-xs text-slate-400">{output.label}</div>
            <div className="mt-1 break-words font-mono text-sm font-black text-cyan-300">{output.value}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (fixedShell) {
    return (
      <section ref={setPanelRef} id="three-d" className={cardClassName} aria-label={`${experiment.title} 3D animation`}>
        {header}
        {body}
      </section>
    );
  }

  return (
    <details ref={setPanelRef} id="three-d" className={cardClassName} aria-label={`${experiment.title} 3D animation`} open>
      <summary className="contents">{header}</summary>
      {body}
    </details>
  );
}

function fallback3DConfig(experiment: ExperimentDefinition): AnimationConfig {
  const category = experiment.category.toLowerCase();
  const id = experiment.id;
  const kind = fallback3DKind(experiment);
  const cinematic =
    category.includes("optic") ||
    category.includes("modern") ||
    category.includes("magnet") ||
    id.includes("orbit") ||
    id.includes("generator") ||
    id.includes("transformer");

  return {
    kind,
    title: `3D ${experiment.title} model`,
    cue: `Use the sliders, then rotate the scene with the pointer. The 3D model highlights the main interaction behind ${experiment.title}.`,
    cinematic,
    steps: fallback3DSteps(category, kind),
  };
}

function fallback3DKind(experiment: ExperimentDefinition): AnimationKind {
  const id = experiment.id;
  const category = experiment.category.toLowerCase();
  if (id.includes("projectile")) return "projectile";
  if (id.includes("distance") || id.includes("graph") || category.includes("measurement")) return "graph3d";
  if (id.includes("balanced")) return "forceBalance";
  if (id.includes("incline") || id.includes("ramp")) return "incline";
  if (id.includes("pendulum") || id.includes("shm") || id.includes("spring")) return "pendulum";
  if (id.includes("rotation") || id.includes("circular")) return "circular";
  if (id.includes("orbit") || id.includes("satellite") || id.includes("gravitation")) return "gravity";
  if (id.includes("buoyancy")) return "buoyancy";
  if (id.includes("density") || id.includes("float") || id.includes("sink")) return "densityTank";
  if (id.includes("fluid") || id.includes("bernoulli") || id.includes("pressure")) return "fluid";
  if (id.includes("calorimetry")) return "calorimetry";
  if (id.includes("gas") || id.includes("heat") || id.includes("thermal") || category.includes("thermo")) return "thermal";
  if (id.includes("generator")) return "generator";
  if (id.includes("transformer")) return "transformer";
  if (id.includes("emi") || id.includes("faraday") || id.includes("induction")) return "induction";
  if (id.includes("magnetic") || id.includes("electromagnet") || id.includes("lorentz") || category.includes("magnet")) return "electromagnet";
  if (id.includes("circuit") || id.includes("current") || id.includes("ohm") || id.includes("resistance") || id.includes("capacitor") || category.includes("electric")) return "circuit";
  if (id.includes("logic") || id.includes("diode") || category.includes("electronics")) return "logic";
  if (id.includes("prism") || id.includes("dispersion") || id.includes("internal") || id.includes("polarization") || id.includes("reflection")) return "prism";
  if (id.includes("eye")) return "eye";
  if (id.includes("lens") || id.includes("mirror") || category.includes("optic")) return "lens";
  if (id.includes("photoelectric")) return "photoelectric";
  if (id.includes("relativity")) return "graph3d";
  if (id.includes("bohr") || id.includes("nuclear")) return "bohr";
  if (id.includes("wave") || id.includes("sound") || id.includes("slit") || id.includes("diffraction") || id.includes("interference") || id.includes("chladni")) return "interference";
  if (category.includes("astronomy")) return "gravity";
  if (category.includes("fluid")) return "fluid";
  if (category.includes("wave")) return "interference";
  if (category.includes("modern")) return "bohr";
  if (category.includes("energy")) return "energy";
  return "force";
}

function fallback3DSteps(category: string, kind: AnimationKind) {
  if (kind === "eye") return ["Compare focus with retina", "Add a concave or convex correction", "Check clear-image formation"];
  if (kind === "planeMirror3d") return ["Set incidence angle", "Compare incident and reflected rays", "Verify virtual image distance"];
  if (kind === "glassSlab3d") return ["Enter the slab", "Bend by Snell's law", "Compare parallel emergent ray"];
  if (kind === "shadowEclipse3d") return ["Align source and occluder", "Find the umbra", "Find the penumbra"];
  if (kind === "multipleReflection3d") return ["Set mirror angle", "Watch virtual copies", "Check the image-count condition"];
  if (kind === "opticalInstrument3d") return ["Set objective and eyepiece", "Locate intermediate image", "Read angular magnification"];
  if (kind === "waveLab3d") return ["Set amplitude and frequency", "Track local medium motion", "Read v = f lambda"];
  if (kind === "chladni3d") return ["Set plate mode", "Find nodal lines", "Watch sand collect"];
  if (kind === "echo3d") return ["Send sound pulse", "Reflect from wall", "Halve round-trip time"];
  if (kind === "soundPitch3d") return ["Set frequency", "Set amplitude", "Compare pitch and loudness"];
  if (kind === "springShm3d") return ["Displace from equilibrium", "Watch restoring force", "Compare KE and spring PE"];
  if (kind === "spectrum3d") return ["Scan wavelength regions", "Find visible band", "Compare frequency inverse relation"];
  if (kind === "polarization3d") return ["Set analyzer angle", "Project field direction", "Read Malus intensity"];
  if (kind === "measurement3d") return ["Read the instrument", "Compare repeated markers", "Report mean and uncertainty"];
  if (kind === "nuclearDecay3d") return ["Start with nuclei population", "Advance half-lives", "Read remaining activity"];
  if (kind === "diode3d") return ["Set bias direction", "Watch carriers cross", "Compare rectified output"];
  if (kind === "energySources3d") return ["Select source type", "Compare output and reliability", "Check emissions tradeoff"];
  if (kind === "quantumOperators3d") return ["Set state vector", "Apply operator axis", "Measure eigenbasis projection"];
  if (kind === "computationalWorkflow3d") return ["Build mesh", "Run solver iterations", "Check convergence error"];
  if (kind === "lens" || kind === "prism") return ["Follow the incoming ray", "Watch the interaction surface", "Locate the image or pattern"];
  if (kind === "circuit" || kind === "logic") return ["Set the source/input", "Watch carriers or states move", "Read the output response"];
  if (kind === "staticElectricity" || kind === "electrostaticField") return ["Set charge and distance", "Watch field direction", "Read force or potential"];
  if (kind === "electrolysis") return ["Apply DC current", "Move ions", "Read deposit or bubbles"];
  if (kind === "meterBridge") return ["Set resistances", "Move jockey", "Find null balance"];
  if (kind === "internalCell") return ["Set load current", "Watch internal drop", "Compare E and V"];
  if (kind === "kirchhoff3d") return ["Trace branch currents", "Check KCL", "Compare voltage drops"];
  if (kind === "lcr3d") return ["Drive with AC", "Rotate phasors", "Find resonance peak"];
  if (kind === "lorentz3d") return ["Set charge sign", "Compare v and B", "Read force and path radius"];
  if (kind === "electromagnet" || kind === "induction" || kind === "generator" || kind === "transformer") return ["Create changing current or flux", "Watch the field link the device", "Compare the induced response"];
  if (kind === "thermal" || kind === "calorimetry") return ["Set energy input", "Watch particles redistribute energy", "Read the final thermal state"];
  if (kind === "thermoProcess") return ["Choose process type", "Watch pressure-volume change", "Compare heat and work"];
  if (kind === "statisticalEnsemble") return ["Sample many states", "Watch the distribution form", "Read mean and spread"];
  if (kind === "fluid" || kind === "buoyancy" || kind === "densityTank") return ["Set depth, density, or flow", "Watch pressure and buoyancy vectors", "Compare the final state"];
  if (kind === "interference") return ["Set frequency or opening", "Watch wavefronts overlap", "Read nodes, antinodes, or fringes"];
  if (kind === "bohr" || kind === "photoelectric") return ["Add energy", "Watch the quantum event", "Read the emitted or ejected signal"];
  if (category.includes("measurement")) return ["Take repeated readings", "See uncertainty spread", "Estimate the best value"];
  return ["Set one variable", "Watch the object respond", "Compare vector and result"];
}

function buildScene(kind: AnimationKind, root: THREE.Group, values: [number, number, number]) {
  const [a, b, c] = values;
  if (kind === "projectile") return buildProjectile(root, a, b, c);
  if (kind === "graph3d") return buildGraph3D(root, a, b, c);
  if (kind === "force") return buildForce(root, a, b, c);
  if (kind === "forceBalance") return buildForceBalance(root, a, b, c);
  if (kind === "freeFall") return buildFreeFall(root, a, b, c);
  if (kind === "massWeight") return buildMassWeight(root, a, b, c);
  if (kind === "workPower") return buildWorkPower(root, a, b, c);
  if (kind === "vector3d") return buildVector3D(root, a, b, c);
  if (kind === "rotationalDynamics") return buildRotationalDynamics(root, a, b, c);
  if (kind === "satelliteOrbit") return buildSatelliteOrbit(root, a, b, c);
  if (kind === "uniformMotion") return buildUniformMotion(root, a, b, c);
  if (kind === "elasticCollision") return buildElasticCollision(root, a, b, c);
  if (kind === "hookesLaw") return buildHookesLaw(root, a, b, c);
  if (kind === "incline") return buildIncline(root, a, b, c);
  if (kind === "energy") return buildEnergy(root, a, b, c);
  if (kind === "pendulum") return buildPendulum(root, a, b, c);
  if (kind === "circular") return buildCircular(root, a, b, c);
  if (kind === "gravity") return buildGravityMap(root, a, b, c);
  if (kind === "buoyancy") return buildBuoyancy(root, a, b, c);
  if (kind === "densityTank") return buildDensityTank(root, a, b, c);
  if (kind === "fluid") return buildFluid(root, a, b, c);
  if (kind === "bernoulliVenturi") return buildBernoulliVenturi(root, a, b, c);
  if (kind === "thermal") return buildThermal(root, a, b, c);
  if (kind === "calorimetry") return buildCalorimetry(root, a, b, c);
  if (kind === "thermoProcess") return buildThermoProcess(root, a, b, c);
  if (kind === "statisticalEnsemble") return buildStatisticalEnsemble(root, a, b, c);
  if (kind === "circuit") return buildCircuit(root, a, b, c);
  if (kind === "staticElectricity") return buildStaticElectricity(root, a, b, c);
  if (kind === "electrostaticField") return buildElectrostaticField(root, a, b, c);
  if (kind === "electrolysis") return buildElectrolysis(root, a, b, c);
  if (kind === "meterBridge") return buildMeterBridge(root, a, b, c);
  if (kind === "internalCell") return buildInternalCell(root, a, b, c);
  if (kind === "kirchhoff3d") return buildKirchhoff3D(root, a, b, c);
  if (kind === "lcr3d") return buildLcr3D(root, a, b, c);
  if (kind === "lorentz3d") return buildLorentz3D(root, a, b, c);
  if (kind === "electromagnet") return buildElectromagnet(root, a, b, c);
  if (kind === "induction") return buildInduction(root, a, b, c);
  if (kind === "generator") return buildGenerator(root, a, b, c);
  if (kind === "transformer") return buildTransformer(root, a, b, c);
  if (kind === "lens") return buildLens(root, a, b, c);
  if (kind === "eye") return buildEyeFocus(root, a, b, c);
  if (kind === "prism") return buildPrism(root, a, b, c);
  if (kind === "planeMirror3d") return buildPlaneMirror3D(root, a, b, c);
  if (kind === "glassSlab3d") return buildGlassSlab3D(root, a, b, c);
  if (kind === "shadowEclipse3d") return buildShadowEclipse3D(root, a, b, c);
  if (kind === "multipleReflection3d") return buildMultipleReflection3D(root, a, b, c);
  if (kind === "opticalInstrument3d") return buildOpticalInstrument3D(root, a, b, c);
  if (kind === "waveLab3d") return buildWaveLab3D(root, a, b, c);
  if (kind === "chladni3d") return buildChladni3D(root, a, b, c);
  if (kind === "echo3d") return buildEcho3D(root, a, b, c);
  if (kind === "soundPitch3d") return buildSoundPitch3D(root, a, b, c);
  if (kind === "springShm3d") return buildSpringShm3D(root, a, b, c);
  if (kind === "spectrum3d") return buildSpectrum3D(root, a, b, c);
  if (kind === "polarization3d") return buildPolarization3D(root, a, b, c);
  if (kind === "measurement3d") return buildMeasurement3D(root, a, b, c);
  if (kind === "nuclearDecay3d") return buildNuclearDecay3D(root, a, b, c);
  if (kind === "diode3d") return buildDiode3D(root, a, b, c);
  if (kind === "energySources3d") return buildEnergySources3D(root, a, b, c);
  if (kind === "quantumOperators3d") return buildQuantumOperators3D(root, a, b, c);
  if (kind === "computationalWorkflow3d") return buildComputationalWorkflow3D(root, a, b, c);
  if (kind === "interference") return buildInterference(root, a, b, c);
  if (kind === "photoelectric") return buildPhotoelectric(root, a, b, c);
  if (kind === "bohr") return buildBohr(root, a, b, c);
  if (kind === "coupledOscillator") return buildCoupledOscillator(root, a, b, c);
  return buildLogic(root, a, b, c);
}

function addGrid(root: THREE.Group) {
  const grid = new THREE.GridHelper(8, 16, 0x22d3ee, 0x334155);
  grid.position.y = -1.1;
  const gridMaterial = grid.material as THREE.Material;
  gridMaterial.opacity = 0.28;
  gridMaterial.transparent = true;
  root.add(grid);
}

function addCinematicSet(root: THREE.Group, kind: AnimationKind, cinematic: boolean) {
  const palette = paletteForKind(kind);
  const floorGlow = new THREE.Mesh(
    new THREE.RingGeometry(1.15, cinematic ? 3.6 : 2.7, 96),
    material(palette.primary, cinematic ? 0.18 : 0.1)
  );
  floorGlow.rotation.x = Math.PI / 2;
  floorGlow.position.y = -1.075;
  floorGlow.userData.role = "scan-ring";
  floorGlow.userData.speed = cinematic ? 0.28 : 0.18;
  root.add(floorGlow);

  const outerGlow = new THREE.Mesh(
    new THREE.RingGeometry(3.85, 3.92, 128),
    material(palette.hot, 0.26)
  );
  outerGlow.rotation.x = Math.PI / 2;
  outerGlow.position.y = -1.06;
  outerGlow.userData.role = "halo-ring";
  outerGlow.userData.speed = 0.16;
  root.add(outerGlow);

  for (let index = 0; index < (cinematic ? 42 : 24); index += 1) {
    const particle = sphere(index % 7 === 0 ? 0.035 : 0.023, index % 5 === 0 ? palette.hot : index % 2 === 0 ? palette.primary : palette.secondary, 0.42);
    particle.position.set(
      -3.5 + ((index * 1.37) % 7),
      -0.8 + ((index * 0.41) % 2.25),
      -2.2 + ((index * 0.83) % 4.4)
    );
    particle.userData.role = "ambient-spark";
    particle.userData.seed = index * 0.73;
    particle.userData.speed = 0.55 + (index % 6) * 0.12;
    root.add(particle);
  }

  for (let index = 0; index < 4; index += 1) {
    const rail = tube([
      new THREE.Vector3(-3.65, -1.04, -1.8 + index * 1.2),
      new THREE.Vector3(3.65, -1.04, -1.8 + index * 1.2),
    ], 0.008, index % 2 ? palette.primary : palette.secondary, 0.28);
    rail.userData.role = "wave-shift";
    rail.userData.speed = 0.3 + index * 0.08;
    root.add(rail);
  }

  const beacon = sphere(0.08, palette.hot, 0.85);
  beacon.position.set(-3.4, 1.45, -1.9);
  beacon.userData.role = "beacon";
  beacon.userData.power = cinematic ? 1.8 : 1.1;
  root.add(beacon);
}

function paletteForKind(kind: AnimationKind) {
  if (kind === "thermal" || kind === "calorimetry" || kind === "thermoProcess" || kind === "statisticalEnsemble") return { primary: 0xf97316, secondary: 0x38bdf8, hot: 0xfacc15 };
  if (kind === "circuit" || kind === "staticElectricity" || kind === "electrostaticField" || kind === "electrolysis" || kind === "meterBridge" || kind === "internalCell" || kind === "kirchhoff3d" || kind === "lcr3d" || kind === "electromagnet" || kind === "lorentz3d" || kind === "induction" || kind === "generator" || kind === "transformer") return { primary: 0x22d3ee, secondary: 0xfacc15, hot: 0xf97316 };
  if (kind === "lens" || kind === "eye" || kind === "prism" || kind === "planeMirror3d" || kind === "glassSlab3d" || kind === "shadowEclipse3d" || kind === "multipleReflection3d" || kind === "opticalInstrument3d" || kind === "interference" || kind === "waveLab3d" || kind === "chladni3d" || kind === "echo3d" || kind === "soundPitch3d" || kind === "springShm3d" || kind === "spectrum3d" || kind === "polarization3d" || kind === "measurement3d" || kind === "nuclearDecay3d" || kind === "diode3d" || kind === "energySources3d" || kind === "quantumOperators3d" || kind === "computationalWorkflow3d") return { primary: 0x67e8f9, secondary: 0xa78bfa, hot: 0xfacc15 };
  if (kind === "gravity" || kind === "bohr" || kind === "photoelectric") return { primary: 0xa78bfa, secondary: 0x22d3ee, hot: 0xfacc15 };
  if (kind === "buoyancy" || kind === "densityTank" || kind === "fluid" || kind === "bernoulliVenturi") return { primary: 0x38bdf8, secondary: 0x0ea5e9, hot: 0xa3e635 };
  if (kind === "force" || kind === "forceBalance" || kind === "incline" || kind === "freeFall" || kind === "massWeight" || kind === "workPower" || kind === "vector3d" || kind === "rotationalDynamics" || kind === "uniformMotion" || kind === "elasticCollision" || kind === "hookesLaw") return { primary: 0x38bdf8, secondary: 0xf43f5e, hot: 0xfacc15 };
  return { primary: 0x22d3ee, secondary: 0x38bdf8, hot: 0xfacc15 };
}

function buildProjectile(root: THREE.Group, speed: number, angle: number, gravity: number) {
  const theta = THREE.MathUtils.degToRad(clamp(angle, 5, 85));
  const range = clamp((speed * speed * Math.sin(2 * theta)) / Math.max(1, gravity), 2, 12);
  const height = clamp((speed * speed * Math.sin(theta) ** 2) / (2 * Math.max(1, gravity)), 1, 5);
  const points = Array.from({ length: 120 }, (_, index) => {
    const u = index / 119;
    return new THREE.Vector3(-3.45 + u * 6.9, -0.84 + 4 * height * u * (1 - u) / 5, -1.35 + u * 1.85);
  });
  root.add(tube(points, 0.052, 0x22d3ee, 1));
  root.add(tube(points.map((point) => new THREE.Vector3(point.x, -1.05, point.z)), 0.02, 0x64748b, 0.85));
  points.filter((_, index) => index % 12 === 0).forEach((point, index) => {
    const ghost = sphere(0.095, 0x22d3ee, 0.28 + index * 0.018);
    ghost.position.copy(point);
    root.add(ghost);
    const shadow = sphere(0.045, 0x334155, 0.65);
    shadow.scale.set(1.8, 0.2, 1);
    shadow.position.set(point.x, -1.04, point.z);
    root.add(shadow);
  });
  const ball = sphere(0.26, 0x22d3ee);
  ball.userData.role = "path";
  ball.userData.path = points;
  root.add(ball);
  const launch = new THREE.Vector3(-3.45, -0.84, -1.35);
  addArrow(root, launch, new THREE.Vector3(-2.1, -0.84 + Math.sin(theta) * 1.5, -0.98), 0x38bdf8);
  addArrow(root, launch.clone().add(new THREE.Vector3(0, 0.05, 0.12)), launch.clone().add(new THREE.Vector3(1.2, 0.05, 0.12)), 0x34d399);
  addArrow(root, launch.clone().add(new THREE.Vector3(0.1, 0, -0.18)), launch.clone().add(new THREE.Vector3(0.1, Math.sin(theta) * 1.25, -0.18)), 0xfacc15);
  const peak = points[Math.floor(points.length / 2)];
  addMarker(root, peak, 0xfacc15);
  addMarker(root, points[points.length - 1], 0x34d399);
  root.add(label("vx constant", new THREE.Vector3(-2.55, -0.5, -1.0), 0x34d399));
  root.add(label("vy changes", new THREE.Vector3(-3.15, 0.55, -1.45), 0xfacc15));
  root.add(label("peak", peak.clone().add(new THREE.Vector3(0.15, 0.35, 0)), 0xfacc15));
  root.add(label(`range ${range.toFixed(1)} m`, points[points.length - 1].clone().add(new THREE.Vector3(-0.55, 0.3, 0.1)), 0x34d399));
  addPlatform(root);
  root.userData.scaleHint = range;
}

function buildGraph3D(root: THREE.Group, speed: number, time: number, startDistance: number) {
  addPlatform(root);
  const track = box(5.8, 0.08, 0.22, 0x64748b, 0.9);
  track.position.set(-0.35, -0.72, -0.95);
  root.add(track);
  const ticks = 6;
  for (let index = 0; index <= ticks; index += 1) {
    const x = -3.1 + index * (5.5 / ticks);
    const tick = box(0.035, 0.24, 0.04, 0x94a3b8, 0.78);
    tick.position.set(x, -0.58, -0.95);
    root.add(tick);
  }

  const distance = startDistance + speed * time;
  const travel = clamp(distance / 300, 0.15, 1);
  const cartPath = [
    new THREE.Vector3(-3.1, -0.42, -0.95),
    new THREE.Vector3(-3.1 + travel * 5.5, -0.42, -0.95),
  ];
  const cart = box(0.55, 0.32, 0.42, 0x38bdf8);
  cart.userData.role = "path";
  cart.userData.path = cartPath;
  root.add(cart);
  [-0.18, 0.18].forEach((x) => {
    const wheel = cylinder(0.08, 0.08, 0.08, 0x020617);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, -0.2, 0.24);
    wheel.userData.role = "wheel";
    cart.add(wheel);
  });

  const origin = new THREE.Vector3(-2.65, -0.94, 0.78);
  addArrow(root, origin, origin.clone().add(new THREE.Vector3(2.65, 0, 0)), 0x94a3b8);
  addArrow(root, origin, origin.clone().add(new THREE.Vector3(0, 1.75, 0)), 0x94a3b8);
  const maxDistance = Math.max(1, startDistance + speed * Math.max(1, time), 120);
  const graphPoints = Array.from({ length: 50 }, (_, index) => {
    const u = index / 49;
    const y = clamp((startDistance + speed * time * u) / maxDistance, 0, 1);
    return new THREE.Vector3(origin.x + u * 2.55, origin.y + y * 1.6, origin.z);
  });
  root.add(tube(graphPoints, 0.014, 0xfacc15, 0.94));
  const graphMarker = sphere(0.09, 0xfacc15);
  graphMarker.userData.role = "path";
  graphMarker.userData.path = graphPoints;
  root.add(graphMarker);
  const slopeArrowStart = graphPoints[Math.max(4, Math.floor(graphPoints.length * 0.35))];
  const slopeArrowEnd = graphPoints[Math.min(graphPoints.length - 1, Math.floor(graphPoints.length * 0.74))];
  addArrow(root, slopeArrowStart, slopeArrowEnd, speed > 0 ? 0x34d399 : 0x64748b);
  root.add(label("motion track", new THREE.Vector3(-2.25, -0.12, -0.95), 0x38bdf8));
  root.add(label("slope = speed", new THREE.Vector3(-1.3, 1.15, 0.78), 0xfacc15));
  root.add(label(speed === 0 ? "rest line" : "uniform motion", new THREE.Vector3(1.1, 0.58, 0.78), 0x34d399));
}

function buildForce(root: THREE.Group, force: number, mass: number, friction: number) {
  addPlatform(root);
  const cart = box(1.1, 0.45, 0.75, 0x38bdf8);
  cart.position.set(-0.8, -0.78, 0);
  cart.userData.role = "cart";
  root.add(cart);
  [-1.15, -0.45].forEach((x) => {
    const wheel = cylinder(0.14, 0.14, 0.15, 0x0f172a);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, -1.04, 0.42);
    wheel.userData.role = "wheel";
    root.add(wheel);
  });
  addArrow(root, new THREE.Vector3(0, -0.72, 0), new THREE.Vector3(clamp(force / Math.max(1, mass), 0.8, 2.6), -0.72, 0), 0xf43f5e);
  addArrow(root, new THREE.Vector3(-1.7, -0.72, 0), new THREE.Vector3(-1.7 - clamp(friction, 0.4, 1.4), -0.72, 0), 0xfacc15);
}

function buildForceBalance(root: THREE.Group, leftForce: number, rightForce: number, mass: number) {
  addPlatform(root);
  const net = rightForce - leftForce;
  const body = box(1.15, 0.58, 0.82, Math.abs(net) < 0.01 ? 0x94a3b8 : 0x38bdf8);
  body.position.set(0, -0.72, 0);
  body.userData.role = Math.abs(net) < 0.01 ? "pulse" : "force-balance";
  body.userData.direction = Math.sign(net);
  body.userData.power = clamp(Math.abs(net) / Math.max(1, mass), 0.25, 2.2);
  root.add(body);
  [-0.38, 0.38].forEach((x) => {
    const wheel = cylinder(0.13, 0.13, 0.14, 0x020617);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, -0.35, 0.48);
    wheel.userData.role = "wheel";
    body.add(wheel);
  });

  const leftLength = clamp(leftForce / 80, 0.35, 2.15);
  const rightLength = clamp(rightForce / 80, 0.35, 2.15);
  addArrow(root, new THREE.Vector3(-0.72, -0.66, 0), new THREE.Vector3(-0.72 - leftLength, -0.66, 0), 0xf43f5e);
  addArrow(root, new THREE.Vector3(0.72, -0.66, 0), new THREE.Vector3(0.72 + rightLength, -0.66, 0), 0x34d399);
  if (Math.abs(net) > 0.01) {
    const direction = Math.sign(net);
    addArrow(root, new THREE.Vector3(0, 0.08, 0), new THREE.Vector3(direction * clamp(Math.abs(net) / Math.max(1, mass), 0.7, 2.7), 0.08, 0), 0xfacc15);
  } else {
    const lock = ring(0.42, 0x94a3b8);
    lock.position.set(0, 0.12, 0);
    lock.userData.role = "field";
    lock.userData.phase = 0;
    lock.userData.power = 1.1;
    root.add(lock);
  }
  root.add(label("left pull", new THREE.Vector3(-2.45, -0.28, 0), 0xf43f5e));
  root.add(label("right pull", new THREE.Vector3(2.25, -0.28, 0), 0x34d399));
  root.add(label(Math.abs(net) < 0.01 ? "balanced" : `net ${net.toFixed(0)} N`, new THREE.Vector3(-0.15, 0.62, 0), 0xfacc15));
}

function buildFreeFall(root: THREE.Group, height: number, initialSpeed: number, gravity: number) {
  addPlatform(root);
  const drop = clamp(height / 120, 0.15, 1);
  [-0.7, 0.7].forEach((x) => {
    const post = box(0.06, 4.2, 0.06, 0x64748b, 0.92);
    post.position.set(x, 0.86, 0);
    root.add(post);
  });
  for (let index = 0; index < 5; index += 1) {
    const gate = box(1.55, 0.035, 0.035, 0x22d3ee, 0.72);
    gate.position.set(0, 2.55 - index * 0.78, 0);
    root.add(gate);
  }
  const ball = sphere(0.18, 0xfacc15);
  ball.userData.role = "path";
  ball.userData.path = [new THREE.Vector3(0, 2.65, 0), new THREE.Vector3(0, 2.65 - drop * 3.25, 0)];
  root.add(ball);
  for (let index = 0; index < 6; index += 1) {
    const ghost = sphere(0.08, 0x67e8f9, 0.18 + index * 0.08);
    ghost.position.set(0.36, 2.45 - index * index * 0.115, 0);
    root.add(ghost);
  }
  addArrow(root, new THREE.Vector3(0.95, 2.25, 0), new THREE.Vector3(0.95, 1.25, 0), 0xf43f5e);
  root.add(label("g downward", new THREE.Vector3(1.08, 1.72, 0), 0xf43f5e));
  root.add(label(`v = u + gt | g ${(gravity || 9.81).toFixed(1)}`, new THREE.Vector3(-1.95, -0.6, 0.2), 0x67e8f9));
  root.add(label("air resistance ignored", new THREE.Vector3(-1.95, -0.92, 0.2), 0xfacc15));
}

function buildMassWeight(root: THREE.Group, mass: number, gravity: number, _unused: number) {
  addPlatform(root);
  const m = clamp(mass, 0.2, 80);
  const g = clamp(gravity || 9.81, 1.6, 25);
  const stretch = clamp((m * g) / 450, 0.25, 1.35);
  const planet = sphere(1.05, g > 15 ? 0xf97316 : g < 4 ? 0x94a3b8 : 0x38bdf8, 0.62);
  planet.scale.y = 0.18;
  planet.position.set(0.9, -0.98, 0);
  root.add(planet);
  const stand = box(0.08, 2.25, 0.08, 0x64748b);
  stand.position.set(1.15, 0.05, 0);
  const arm = box(1.0, 0.06, 0.08, 0x64748b);
  arm.position.set(0.68, 1.13, 0);
  root.add(stand, arm);
  root.add(tube(Array.from({ length: 30 }, (_, index) => new THREE.Vector3(0.3 + Math.sin(index * Math.PI) * 0.09, 1.06 - index * (stretch / 30), 0)), 0.018, 0x67e8f9, 1));
  const block = box(0.45, 0.38, 0.45, 0xfacc15);
  block.position.set(0.3, 1.0 - stretch, 0);
  root.add(block);
  const balance = box(1.8, 0.06, 0.12, 0xfacc15);
  balance.position.set(-1.55, 0.18, 0);
  root.add(balance);
  [-2.25, -0.85].forEach((x) => {
    const pan = cylinder(0.28, 0.34, 0.06, 0x38bdf8);
    pan.position.set(x, -0.03, 0);
    root.add(pan);
  });
  addArrow(root, new THREE.Vector3(1.78, 0.95, 0), new THREE.Vector3(1.78, -0.08, 0), 0xf43f5e);
  root.add(label(`mass ${m.toFixed(1)} kg unchanged`, new THREE.Vector3(-2.55, 0.86, 0.2), 0x67e8f9));
  root.add(label(`weight ${(m * g).toFixed(1)} N`, new THREE.Vector3(0.62, -0.64, 0.2), 0xfacc15));
}

function buildWorkPower(root: THREE.Group, force: number, distance: number, time: number) {
  addPlatform(root);
  const ramp = box(3.9, 0.12, 0.72, 0x64748b, 0.9);
  ramp.rotation.z = -0.22;
  ramp.position.set(-0.35, -0.6, 0);
  root.add(ramp);
  const load = box(0.58, 0.42, 0.52, 0x38bdf8);
  load.position.set(-1.35, -0.15, 0);
  load.userData.role = "cart";
  root.add(load);
  addArrow(root, new THREE.Vector3(-1.0, 0.15, 0), new THREE.Vector3(0.45, 0.47, 0), 0x22d3ee);
  addArrow(root, new THREE.Vector3(-1.5, -0.95, 0.28), new THREE.Vector3(1.45, -0.95, 0.28), 0x34d399);
  const work = force * distance;
  const power = work / Math.max(0.1, time);
  root.add(label(`F ${force.toFixed(1)} N`, new THREE.Vector3(0.08, 0.76, 0.2), 0x22d3ee));
  root.add(label(`d ${distance.toFixed(1)} m`, new THREE.Vector3(-0.8, -0.82, 0.45), 0x34d399));
  root.add(label(`W ${work.toFixed(1)} J | P ${power.toFixed(1)} W`, new THREE.Vector3(-2.35, 1.35, 0.2), 0xfacc15));
}

function buildVector3D(root: THREE.Group, magnitude: number, angle: number, zFactor: number) {
  addPlatform(root);
  const mag = clamp(magnitude, 1, 30) / 8;
  const theta = THREE.MathUtils.degToRad(clamp(angle, -170, 170));
  const z = clamp(zFactor || 0, -10, 10) / 8;
  const origin = new THREE.Vector3(0, -0.8, 0);
  const end = new THREE.Vector3(Math.cos(theta) * mag, Math.sin(theta) * mag - 0.8, z);
  addArrow(root, origin, new THREE.Vector3(2.6, -0.8, 0), 0x94a3b8);
  addArrow(root, origin, new THREE.Vector3(0, 1.6, 0), 0x94a3b8);
  addArrow(root, origin, new THREE.Vector3(0, -0.8, 2.2), 0x94a3b8);
  addArrow(root, origin, end, 0xfacc15);
  addArrow(root, origin, new THREE.Vector3(end.x, -0.8, 0), 0x22d3ee);
  addArrow(root, new THREE.Vector3(end.x, -0.8, 0), new THREE.Vector3(end.x, end.y, 0), 0x34d399);
  addArrow(root, new THREE.Vector3(end.x, end.y, 0), end, 0xf43f5e);
  root.add(label(`x ${(Math.cos(theta) * magnitude).toFixed(1)}`, new THREE.Vector3(end.x / 2, -0.55, 0.08), 0x22d3ee));
  root.add(label(`y ${(Math.sin(theta) * magnitude).toFixed(1)}`, new THREE.Vector3(end.x + 0.12, (end.y - 0.8) / 2, 0.08), 0x34d399));
}

function buildRotationalDynamics(root: THREE.Group, force: number, radius: number, inertia: number) {
  addPlatform(root);
  const r = clamp(radius, 0.3, 3) * 0.45;
  const wheel = cylinder(1.15, 1.15, 0.24, 0x38bdf8, 0.65);
  wheel.rotation.x = Math.PI / 2;
  wheel.userData.role = "spin";
  wheel.userData.speed = clamp(force / Math.max(0.2, inertia), 0.3, 4);
  root.add(wheel);
  const arm = box(r * 2, 0.08, 0.1, 0xfacc15);
  arm.position.set(r / 2, 0, 0.2);
  root.add(arm);
  addArrow(root, new THREE.Vector3(r, 0, 0.35), new THREE.Vector3(r, 0.95, 0.35), 0xf43f5e);
  addArrow(root, new THREE.Vector3(-0.8, -0.9, 0.35), new THREE.Vector3(0.55, -0.9, 0.35), 0x22d3ee);
  root.add(label(`tau ${(force * radius).toFixed(1)} N m`, new THREE.Vector3(-2.2, 1.25, 0.2), 0xfacc15));
  root.add(label(`alpha ${(force * radius / Math.max(0.2, inertia)).toFixed(2)} rad/s^2`, new THREE.Vector3(-2.2, 0.9, 0.2), 0x67e8f9));
}

function buildSatelliteOrbit(root: THREE.Group, massFactor: number, radius: number, speed: number) {
  addPlatform(root);
  const planet = sphere(0.72, 0x38bdf8, 0.95);
  planet.userData.role = "pulse";
  root.add(planet);
  const r = clamp(radius, 1, 12) * 0.18 + 1.25;
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(r, 0.014, 12, 96), material(speed > Math.sqrt(Math.max(0.1, massFactor) / Math.max(1, radius)) * 10 ? 0xf43f5e : 0x22d3ee, 0.9));
  orbit.rotation.x = Math.PI / 2;
  root.add(orbit);
  const satellite = sphere(0.16, 0xfacc15);
  satellite.position.set(r, 0, 0);
  satellite.userData.role = "orbit";
  satellite.userData.radius = r;
  satellite.userData.speed = 0.18 + speed * 0.03;
  root.add(satellite);
  addArrow(root, new THREE.Vector3(r, 0.04, 0), new THREE.Vector3(r, 0.04, 0.9), 0x22d3ee);
  addArrow(root, new THREE.Vector3(r, 0.04, 0), new THREE.Vector3(0.35, 0.04, 0), 0xf43f5e);
  root.add(label("velocity tangent", new THREE.Vector3(r - 0.2, 0.42, 0.85), 0x22d3ee));
  root.add(label("gravity inward", new THREE.Vector3(0.65, 0.42, 0.12), 0xf43f5e));
  root.add(label("not to scale", new THREE.Vector3(-1.9, -0.84, 0.2), 0xfacc15));
}

function buildUniformMotion(root: THREE.Group, speed: number, time: number, start: number) {
  addPlatform(root);
  const track = box(5.7, 0.08, 0.28, 0x64748b, 0.9);
  track.position.set(0, -0.62, 0);
  root.add(track);
  for (let index = 0; index < 8; index += 1) {
    const marker = box(0.035, 0.28, 0.05, 0xfacc15, 0.86);
    marker.position.set(-2.5 + index * 0.72, -0.42, 0.18);
    root.add(marker);
  }
  const travel = clamp((start + speed * time) / 120, -1, 1);
  const cart = box(0.58, 0.34, 0.45, 0x38bdf8);
  cart.position.set(-2.2 + travel * 3.8, -0.28, 0);
  cart.userData.role = "cart";
  root.add(cart);
  addArrow(root, cart.position.clone().add(new THREE.Vector3(0.4, 0.2, 0)), cart.position.clone().add(new THREE.Vector3(1.35, 0.2, 0)), 0x22d3ee);
  root.add(label(`constant v ${speed.toFixed(1)} m/s`, new THREE.Vector3(-2.35, 0.75, 0.2), 0x67e8f9));
  root.add(label("equal distance in equal time", new THREE.Vector3(-1.15, -0.98, 0.35), 0xfacc15));
}

function buildElasticCollision(root: THREE.Group, mass1: number, mass2: number, speed: number) {
  addPlatform(root);
  const track = box(5.8, 0.08, 0.34, 0x64748b, 0.9);
  track.position.set(0, -0.62, 0);
  root.add(track);
  const m1 = clamp(mass1, 0.5, 10);
  const m2 = clamp(mass2, 0.5, 10);
  const cart1 = box(0.45 + m1 * 0.04, 0.35, 0.45, 0x38bdf8);
  cart1.position.set(-1.2, -0.27, 0);
  cart1.userData.role = "force-balance";
  cart1.userData.power = 1;
  cart1.userData.direction = 1;
  const cart2 = box(0.45 + m2 * 0.04, 0.35, 0.45, 0xfacc15);
  cart2.position.set(1.1, -0.27, 0);
  cart2.userData.role = "force-balance";
  cart2.userData.power = 0.7;
  cart2.userData.direction = -1;
  root.add(cart1, cart2);
  addArrow(root, new THREE.Vector3(-1.85, 0.12, 0), new THREE.Vector3(-0.8, 0.12, 0), 0x22d3ee);
  addArrow(root, new THREE.Vector3(1.75, 0.12, 0), new THREE.Vector3(0.85, 0.12, 0), 0xf43f5e);
  root.add(label(`m1 ${m1.toFixed(1)} kg`, new THREE.Vector3(-2.2, 0.62, 0.2), 0x67e8f9));
  root.add(label(`m2 ${m2.toFixed(1)} kg`, new THREE.Vector3(0.8, 0.62, 0.2), 0xfacc15));
  root.add(label("momentum and KE conserved", new THREE.Vector3(-1.6, -0.95, 0.25), 0x34d399));
}

function buildHookesLaw(root: THREE.Group, springConstant: number, force: number, extensionInput: number) {
  addPlatform(root);
  const k = clamp(springConstant, 5, 200);
  const f = clamp(force || extensionInput || 10, 0, 80);
  const extension = clamp(f / k, 0.06, 0.72);
  const stand = box(0.08, 2.3, 0.08, 0x64748b);
  stand.position.set(-0.72, 0.1, 0);
  const arm = box(1.1, 0.08, 0.08, 0x64748b);
  arm.position.set(-0.18, 1.22, 0);
  root.add(stand, arm);
  root.add(tube(Array.from({ length: 36 }, (_, index) => new THREE.Vector3(0.22 + Math.sin(index * Math.PI) * 0.09, 1.15 - index * (extension / 18), 0)), 0.018, 0x67e8f9, 1));
  const mass = box(0.48, 0.38, 0.48, extension > 0.45 ? 0xf43f5e : 0xfacc15);
  mass.position.set(0.22, 1.15 - extension * 2.1, 0);
  root.add(mass);
  addArrow(root, mass.position.clone().add(new THREE.Vector3(0.48, 0.2, 0)), mass.position.clone().add(new THREE.Vector3(0.48, -0.55, 0)), 0xf43f5e);
  addArrow(root, mass.position.clone().add(new THREE.Vector3(-0.48, 0, 0)), mass.position.clone().add(new THREE.Vector3(-0.48, 0.68, 0)), 0x22d3ee);
  root.add(label(`F ${f.toFixed(1)} N`, new THREE.Vector3(0.86, 0.34, 0.2), 0xf43f5e));
  root.add(label(`x ${(f / k).toFixed(3)} m`, new THREE.Vector3(-0.1, -0.82, 0.2), 0x67e8f9));
  root.add(label(extension > 0.45 ? "elastic limit warning" : "within elastic limit", new THREE.Vector3(-2.0, -0.95, 0.2), extension > 0.45 ? 0xf43f5e : 0x34d399));
}

function buildIncline(root: THREE.Group, mass: number, angle: number, friction: number) {
  root.userData.hasInclineBlock = true;
  const g = 9.81;
  const m = Math.max(0.1, mass);
  const theta = THREE.MathUtils.degToRad(clamp(angle, 1, 80));
  const mu = clamp(friction, 0, 2);
  const rampLength = 4.6;
  const rampThickness = 0.18;
  const rampDepth = 1.7;
  const blockHeight = 0.44;
  const blockWidth = 0.65;
  const rampCenter = new THREE.Vector3(0, -0.55, 0);
  const tangent = new THREE.Vector3(Math.cos(theta), -Math.sin(theta), 0).normalize();
  const normal = new THREE.Vector3(Math.sin(theta), Math.cos(theta), 0).normalize();
  const clearance = rampThickness / 2 + blockHeight / 2 + 0.035;
  const slideStart = -rampLength * 0.34;
  const slideEnd = rampLength * 0.34;
  const normalForce = m * g * Math.cos(theta);
  const gravityDownPlane = m * g * Math.sin(theta);
  const frictionForce = mu * normalForce;
  const netDownPlane = gravityDownPlane - frictionForce;
  const acceleration = Math.max(0, netDownPlane / m);
  const moving = acceleration > 0.015;

  const ramp = box(rampLength, rampThickness, rampDepth, 0x475569);
  ramp.rotation.z = -theta;
  ramp.position.copy(rampCenter);
  root.add(ramp);

  const contactStrip = box(rampLength * 0.94, 0.018, rampDepth * 0.86, moving ? 0x22d3ee : 0xfacc15);
  contactStrip.rotation.z = -theta;
  contactStrip.position.copy(rampCenter.clone().addScaledVector(normal, rampThickness / 2 + 0.018));
  root.add(contactStrip);

  const block = box(blockWidth, blockHeight, 0.62, moving ? 0x22d3ee : 0xfacc15);
  block.rotation.z = -theta;
  block.position.copy(pointOnIncline(rampCenter, tangent, normal, slideStart, clearance));
  block.userData.role = "incline-block";
  block.userData.rampCenter = rampCenter;
  block.userData.tangent = tangent;
  block.userData.normal = normal;
  block.userData.clearance = clearance;
  block.userData.slideStart = slideStart;
  block.userData.slideEnd = slideEnd;
  block.userData.speed = moving ? clamp(Math.sqrt(acceleration) * 0.42, 0.32, 2.8) : 0;
  block.userData.moving = moving;
  block.userData.theta = theta;
  root.add(block);

  const samplePosition = pointOnIncline(rampCenter, tangent, normal, -0.2, clearance + 0.42);
  addArrow(root, samplePosition, samplePosition.clone().add(new THREE.Vector3(0, -clamp(m * g / 55, 0.45, 1.3), 0)), 0xf43f5e);
  addArrow(root, samplePosition, samplePosition.clone().addScaledVector(normal, clamp(normalForce / 55, 0.35, 1.25)), 0x38bdf8);
  addArrow(root, samplePosition, samplePosition.clone().addScaledVector(tangent, -clamp(frictionForce / 55, 0.25, 1.1)), 0xfacc15);
  if (moving) {
    addArrow(root, samplePosition.clone().addScaledVector(normal, -0.2), samplePosition.clone().addScaledVector(tangent, clamp(netDownPlane / 55, 0.35, 1.45)), 0x34d399);
  }
  root.add(label(`a = ${acceleration.toFixed(2)} m/s^2`, samplePosition.clone().add(new THREE.Vector3(0.15, 0.55, 0.08)), moving ? 0x34d399 : 0xfacc15));
  root.add(label(moving ? "block stays on ramp surface" : "static friction holds", pointOnIncline(rampCenter, tangent, normal, slideEnd - 0.35, clearance + 0.26), moving ? 0x22d3ee : 0xfacc15));
}

function buildEnergy(root: THREE.Group, mass: number, height: number, loss: number) {
  const ramp = box(4.4, 0.16, 1.35, 0x64748b);
  ramp.rotation.z = -0.45;
  ramp.position.set(-0.35, -0.3, 0);
  root.add(ramp);
  const ball = sphere(0.22 + clamp(mass / 80, 0, 0.12), 0xfacc15);
  ball.userData.role = "slide";
  ball.userData.theta = 0.45;
  ball.userData.speed = clamp(height * (1 - loss), 0.4, 5);
  root.add(ball);
  addArrow(root, new THREE.Vector3(-2.3, 0.75, 0), new THREE.Vector3(-2.3, -0.65, 0), 0x34d399);
}

function buildPendulum(root: THREE.Group, length: number, _mass: number, damping: number) {
  const pivot = sphere(0.09, 0xfacc15);
  pivot.position.set(0, 1.5, 0);
  root.add(pivot);
  const pendulum = new THREE.Group();
  pendulum.position.copy(pivot.position);
  pendulum.userData.role = "pendulum";
  pendulum.userData.length = clamp(length, 0.9, 2.8);
  pendulum.userData.damping = clamp(damping, 0, 0.45);
  const rod = cylinder(0.025, 0.025, pendulum.userData.length, 0x94a3b8);
  rod.position.y = -pendulum.userData.length / 2;
  pendulum.add(rod);
  const bob = sphere(0.2, 0x22d3ee);
  bob.position.y = -pendulum.userData.length;
  pendulum.add(bob);
  root.add(pendulum);
}

function buildCircular(root: THREE.Group, mass: number, radius: number, omega: number) {
  const r = clamp(radius, 1.1, 2.7);
  root.add(ring(r, 0x22d3ee));
  const orbit = sphere(0.16 + clamp(mass / 100, 0, 0.12), 0x38bdf8);
  orbit.userData.role = "orbit";
  orbit.userData.radius = r;
  orbit.userData.speed = clamp(omega, 0.4, 6);
  root.add(orbit);
  addArrow(root, new THREE.Vector3(r, -0.75, 0), new THREE.Vector3(0.2, -0.75, 0), 0xf43f5e);
}

function buildGravityMap(root: THREE.Group, centralMass: number, testMass: number, distance: number) {
  const sourceRadius = 0.36 + clamp(centralMass / 10, 0, 0.34);
  const orbitRadius = clamp(distance / 14, 0.95, 3.1);
  const planet = sphere(sourceRadius, 0x38bdf8);
  planet.position.y = -0.4;
  planet.userData.role = "pulse";
  root.add(planet);

  for (let index = 1; index <= 5; index += 1) {
    const r = 0.52 + index * 0.5;
    const shell = line(Array.from({ length: 96 }, (_, step) => {
      const theta = (step / 95) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(theta) * r, -0.4, Math.sin(theta) * r);
    }), index === 1 ? 0x22d3ee : 0x334155);
    shell.userData.role = "field";
    shell.userData.phase = index * 0.3;
    shell.userData.power = clamp(centralMass / (index * 6), 0.25, 1.35);
    root.add(shell);
  }

  const satellite = sphere(0.12 + clamp(testMass / 1000, 0, 0.12), 0xfacc15);
  satellite.userData.role = "orbit";
  satellite.userData.radius = orbitRadius;
  satellite.userData.speed = clamp(centralMass / Math.sqrt(Math.max(1, distance)), 0.25, 2.7);
  root.add(satellite);
  const pullStart = new THREE.Vector3(orbitRadius, -0.55, 0);
  const pullEnd = new THREE.Vector3(clamp(sourceRadius + 0.15, 0.55, 0.9), -0.45, 0);
  addArrow(root, pullStart, pullEnd, 0xf43f5e);
  addArrow(root, new THREE.Vector3(-2.8, 1.05, 0), new THREE.Vector3(-2.8, 1.05 - clamp(centralMass / Math.max(1, distance), 0.35, 1.35), 0), 0x34d399);
  root.add(label("source mass", new THREE.Vector3(-0.55, 0.45, 0), 0x38bdf8));
  root.add(label("1 / r^2 field", new THREE.Vector3(-2.3, 1.45, 0), 0x34d399));
  root.add(label("test mass", new THREE.Vector3(orbitRadius - 0.6, 0.42, 0.2), 0xfacc15));
}

function buildBuoyancy(root: THREE.Group, objectDensity: number, fluidDensity: number, _unused = 0) {
  const tank = box(3.8, 1.6, 1.8, 0x38bdf8, 0.16);
  tank.position.y = -0.35;
  root.add(tank);
  const water = box(3.65, 1.05, 1.65, 0x0ea5e9, 0.38);
  water.position.y = -0.55;
  water.userData.role = "water";
  root.add(water);
  const block = box(0.72, 0.58, 0.72, objectDensity < fluidDensity ? 0xa3e635 : 0x94a3b8);
  block.position.y = objectDensity < fluidDensity ? -0.12 : -0.72;
  block.userData.role = "float";
  root.add(block);
  addArrow(root, new THREE.Vector3(1.45, -0.75, 0), new THREE.Vector3(1.45, 0.35, 0), 0x34d399);
}

function buildDensityTank(root: THREE.Group, fluidDensity: number, volume: number, objectDensity: number) {
  const tankFrame = box(3.95, 1.75, 1.9, 0x94a3b8, 0.1);
  tankFrame.position.y = -0.35;
  root.add(tankFrame);
  const water = box(3.7, 1.18, 1.68, 0x0ea5e9, 0.38);
  water.position.y = -0.55;
  water.userData.role = "water";
  root.add(water);
  const fraction = clamp(objectDensity / Math.max(1, fluidDensity), 0.08, 1.25);
  const floats = fraction < 0.98;
  const neutral = fraction >= 0.98 && fraction <= 1.02;
  const blockHeight = 0.45 + clamp(volume / 28, 0, 0.25);
  const block = box(0.85, blockHeight, 0.85, floats ? 0xa3e635 : neutral ? 0xfacc15 : 0xf97316, 0.92);
  block.position.y = floats ? -0.08 - fraction * 0.25 : neutral ? -0.48 : -0.95;
  block.userData.role = "float";
  root.add(block);

  const submergedHeight = clamp(blockHeight * Math.min(1, fraction), 0.08, blockHeight);
  const submerged = box(0.9, submergedHeight, 0.9, 0x22d3ee, 0.22);
  submerged.position.set(0, block.position.y - blockHeight / 2 + submergedHeight / 2, 0);
  root.add(submerged);
  addArrow(root, new THREE.Vector3(1.45, -0.8, 0), new THREE.Vector3(1.45, -0.8 + clamp(fluidDensity / 900, 0.55, 1.45), 0), 0x34d399);
  addArrow(root, new THREE.Vector3(-1.45, 0.1, 0), new THREE.Vector3(-1.45, 0.1 - clamp(objectDensity / 1600, 0.45, 1.55), 0), 0xf43f5e);
  [0, 1, 2, 3, 4].forEach((index) => {
    const bubble = sphere(0.045, 0x67e8f9, 0.55);
    bubble.position.set(-1.35 + index * 0.62, -0.92 + (index % 2) * 0.36, 0.62 - index * 0.12);
    bubble.userData.role = "particle";
    bubble.userData.seed = index * 1.7;
    bubble.userData.speed = 0.9 + index * 0.18;
    root.add(bubble);
  });
  root.add(label("buoyant force", new THREE.Vector3(1.65, 0.65, 0), 0x34d399));
  root.add(label("weight", new THREE.Vector3(-1.9, -0.15, 0), 0xf43f5e));
  root.add(label(floats ? "floats" : neutral ? "neutral" : "sinks", new THREE.Vector3(-0.35, 0.78, 0), floats ? 0xa3e635 : neutral ? 0xfacc15 : 0xf97316));
}

function buildFluid(root: THREE.Group, force: number, area: number, depth: number) {
  buildBuoyancy(root, 500, 1000);
  const probe = sphere(0.14, 0xf43f5e);
  probe.position.set(-1.2, clamp(0.25 - depth / 80, -1, 0.35), 0);
  probe.userData.role = "pulse";
  root.add(probe);
  addArrow(root, new THREE.Vector3(-2.2, probe.position.y, 0), new THREE.Vector3(-2.2 + clamp(force / Math.max(area, 0.2), 0.5, 1.9), probe.position.y, 0), 0xf43f5e);
}

function buildBernoulliVenturi(root: THREE.Group, density: number, wideArea: number, flowRate: number) {
  addPlatform(root);
  const rho = clamp(density || 1000, 600, 1400);
  const areaWide = clamp(wideArea || 4, 1.2, 8);
  const q = clamp(flowRate || 3, 0.5, 10);
  const areaThroat = Math.max(0.45, areaWide * 0.42);
  const vWide = q / areaWide;
  const vNarrow = q / areaThroat;
  const pressureDrop = 0.5 * rho * (vNarrow * vNarrow - vWide * vWide);
  const wideRadius = clamp(areaWide / 8, 0.42, 0.82);
  const throatRadius = clamp(areaThroat / 8, 0.2, 0.42);
  const inlet = cylinder(wideRadius, wideRadius, 1.3, 0x38bdf8, 0.32);
  inlet.rotation.z = Math.PI / 2;
  inlet.position.set(-2.15, -0.25, 0);
  const throat = cylinder(throatRadius, throatRadius, 1.05, 0x22d3ee, 0.46);
  throat.rotation.z = Math.PI / 2;
  throat.position.set(0, -0.25, 0);
  const outlet = cylinder(wideRadius, wideRadius, 1.3, 0x38bdf8, 0.32);
  outlet.rotation.z = Math.PI / 2;
  outlet.position.set(2.15, -0.25, 0);
  root.add(inlet, throat, outlet);
  root.add(tube([new THREE.Vector3(-1.5, -0.25, 0), new THREE.Vector3(-0.65, -0.25, 0)], 0.09, 0x67e8f9, 0.28));
  root.add(tube([new THREE.Vector3(0.65, -0.25, 0), new THREE.Vector3(1.5, -0.25, 0)], 0.09, 0x67e8f9, 0.28));
  const flowPath = [
    new THREE.Vector3(-2.85, -0.25, 0),
    new THREE.Vector3(-1.3, -0.25, 0),
    new THREE.Vector3(-0.45, -0.25, 0),
    new THREE.Vector3(0.45, -0.25, 0),
    new THREE.Vector3(1.3, -0.25, 0),
    new THREE.Vector3(2.85, -0.25, 0),
  ];
  for (let index = 0; index < 16; index += 1) {
    const particle = sphere(index % 3 === 0 ? 0.055 : 0.04, 0x67e8f9, 0.78);
    particle.userData.role = "path";
    particle.userData.path = flowPath;
    particle.userData.offset = index / 16;
    root.add(particle);
  }
  const tapWide = box(0.08, clamp(1.2 - pressureDrop / 90000, 0.35, 1.2), 0.08, 0xfacc15, 0.92);
  tapWide.position.set(-2.15, 0.62, 0);
  const tapNarrow = box(0.08, clamp(0.45 + pressureDrop / 150000, 0.22, 0.85), 0.08, 0xf43f5e, 0.92);
  tapNarrow.position.set(0, 0.42, 0);
  root.add(tapWide, tapNarrow);
  addArrow(root, new THREE.Vector3(-2.8, -0.95, 0.35), new THREE.Vector3(-1.75, -0.95, 0.35), 0x22d3ee);
  addArrow(root, new THREE.Vector3(-0.45, -0.95, 0.35), new THREE.Vector3(1.05, -0.95, 0.35), 0x34d399);
  root.add(label("wide: high P, low v", new THREE.Vector3(-2.95, 1.28, 0.25), 0xfacc15));
  root.add(label("throat: low P, high v", new THREE.Vector3(-0.85, 1.08, 0.25), 0xf43f5e));
  root.add(label(`v1 ${vWide.toFixed(2)} | v2 ${vNarrow.toFixed(2)}`, new THREE.Vector3(-1.35, -1.02, 0.65), 0x67e8f9));
  root.add(label(`Delta P ${(pressureDrop / 1000).toFixed(1)} kPa`, new THREE.Vector3(0.95, 1.28, 0.25), 0xa3e635));
  root.add(label("steady incompressible ideal flow", new THREE.Vector3(-2.45, -1.2, 0.25), 0xfacc15));
}

function buildThermal(root: THREE.Group, temperature: number, mass: number, volume: number) {
  const chamber = box(3.4, 1.8, 1.8, 0xf97316, 0.12);
  root.add(chamber);
  const count = 26;
  for (let index = 0; index < count; index += 1) {
    const particle = sphere(0.055 + clamp(mass / 100, 0, 0.04), index % 3 === 0 ? 0xfacc15 : 0xfb923c);
    particle.position.set(((index % 7) - 3) * 0.42, -0.65 + Math.floor(index / 7) * 0.42, ((index % 5) - 2) * 0.26);
    particle.userData.role = "particle";
    particle.userData.speed = clamp((temperature + 30) / 180 + volume / 10, 0.3, 3);
    particle.userData.seed = index;
    root.add(particle);
  }
}

function buildCalorimetry(root: THREE.Group, hotMass: number, hotTemperature: number, coldMass: number) {
  const coldTemperature = 25;
  const finalTemperature = (Math.max(0.01, hotMass) * hotTemperature + Math.max(0.01, coldMass) * coldTemperature) / (Math.max(0.01, hotMass) + Math.max(0.01, coldMass));
  const calorimeter = cylinder(0.82, 0.95, 1.45, 0x94a3b8, 0.22);
  calorimeter.position.set(0, -0.38, 0);
  root.add(calorimeter);
  const mixedWaterHeight = clamp((hotMass + coldMass) / 5, 0.28, 1.05);
  const mixedWater = cylinder(0.72, 0.78, mixedWaterHeight, 0x38bdf8, 0.42);
  mixedWater.position.set(0, -1.04 + mixedWaterHeight / 2, 0);
  mixedWater.userData.role = "water";
  root.add(mixedWater);

  const hotBeaker = cylinder(0.36, 0.42, 0.82, 0xf97316, 0.24);
  hotBeaker.position.set(-2.1, 0.15, 0);
  root.add(hotBeaker);
  const coldBeaker = cylinder(0.36, 0.42, 0.82, 0x38bdf8, 0.24);
  coldBeaker.position.set(2.1, 0.15, 0);
  root.add(coldBeaker);
  root.add(tube([new THREE.Vector3(-1.8, -0.1, 0), new THREE.Vector3(-1.2, -0.55, 0.15), new THREE.Vector3(-0.55, -0.55, 0.04)], 0.035, 0xf97316, 0.72));
  root.add(tube([new THREE.Vector3(1.8, -0.1, 0), new THREE.Vector3(1.2, -0.55, -0.15), new THREE.Vector3(0.55, -0.55, -0.04)], 0.035, 0x38bdf8, 0.72));

  const thermometer = box(0.09, 1.5, 0.09, 0xe2e8f0, 0.58);
  thermometer.position.set(1.15, -0.18, 0.18);
  root.add(thermometer);
  const mercuryHeight = clamp((finalTemperature - 20) / 80, 0.08, 1);
  const mercury = box(0.055, mercuryHeight * 1.24, 0.055, finalTemperature > 60 ? 0xf43f5e : 0xfacc15, 0.94);
  mercury.position.set(1.15, -0.86 + mercuryHeight * 0.62, 0.18);
  mercury.userData.role = "pulse";
  root.add(mercury);

  for (let index = 0; index < 28; index += 1) {
    const isHot = index % 2 === 0;
    const particle = sphere(0.047, isHot ? 0xf97316 : 0x38bdf8, 0.82);
    particle.position.set(((index % 7) - 3) * 0.17, -0.86 + Math.floor(index / 7) * 0.16, ((index % 5) - 2) * 0.13);
    particle.userData.role = "particle";
    particle.userData.seed = index * 0.77;
    particle.userData.speed = clamp((isHot ? hotTemperature : coldTemperature) / 50, 0.6, 2.8);
    root.add(particle);
  }
  const balanceGlow = ring(0.98, finalTemperature > 55 ? 0xf97316 : 0xfacc15);
  balanceGlow.position.y = 0.32;
  balanceGlow.userData.role = "field";
  balanceGlow.userData.phase = 0.5;
  balanceGlow.userData.power = 1.15;
  root.add(balanceGlow);
  root.add(label("hot sample", new THREE.Vector3(-2.55, 0.95, 0), 0xf97316));
  root.add(label("cold sample", new THREE.Vector3(1.58, 0.95, 0), 0x38bdf8));
  root.add(label(`Tf ${finalTemperature.toFixed(1)} C`, new THREE.Vector3(-0.48, 1.22, 0), finalTemperature > 55 ? 0xf97316 : 0xfacc15));
}

function buildThermoProcess(root: THREE.Group, pressure: number, deltaVolume: number, processInput: number) {
  addPlatform(root);
  const processIndex = Math.abs(Math.round(processInput || 0)) % 4;
  const process = ["isothermal", "adiabatic", "isobaric", "isochoric"][processIndex];
  const volume = process === "isochoric" ? 3 : clamp(3 + deltaVolume, 0.8, 7);
  const pistonY = clamp(0.95 - volume * 0.18, -0.25, 0.78);
  const shellColor = process === "adiabatic" ? 0xfacc15 : 0x38bdf8;
  const chamber = cylinder(0.78, 0.78, 1.9, shellColor, 0.18);
  chamber.position.set(-1.35, -0.12, 0);
  root.add(chamber);
  const piston = cylinder(0.7, 0.7, 0.14, 0xe2e8f0, 0.72);
  piston.position.set(-1.35, pistonY, 0);
  piston.userData.role = process === "isochoric" ? "pulse" : "piston";
  piston.userData.power = clamp(Math.abs(deltaVolume) / 4, 0.25, 1.4);
  root.add(piston);
  const rod = box(0.08, 1.2, 0.08, 0x94a3b8, 0.92);
  rod.position.set(-1.35, pistonY + 0.7, 0);
  root.add(rod);
  for (let index = 0; index < 18; index += 1) {
    const particle = sphere(0.045, index % 3 === 0 ? 0xfacc15 : 0xfb923c, 0.88);
    particle.position.set(-1.78 + (index % 5) * 0.2, -0.78 + Math.floor(index / 5) * 0.22, ((index % 4) - 1.5) * 0.18);
    particle.userData.role = "particle";
    particle.userData.seed = index * 0.81;
    particle.userData.speed = process === "isothermal" ? 0.9 : process === "adiabatic" ? 1.35 : 1.05;
    root.add(particle);
  }
  if (process !== "adiabatic") {
    addArrow(root, new THREE.Vector3(-2.9, -0.15, 0.34), new THREE.Vector3(-2.15, -0.15, 0.2), 0xf97316);
    root.add(label("heat exchange", new THREE.Vector3(-3.05, 0.22, 0.35), 0xf97316));
  } else {
    const insulation = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.035, 12, 72), material(0xfacc15, 0.72));
    insulation.position.set(-1.35, -0.12, 0);
    insulation.rotation.x = Math.PI / 2;
    root.add(insulation);
    root.add(label("adiabatic insulation", new THREE.Vector3(-2.45, 0.95, 0.25), 0xfacc15));
  }
  const gauge = ring(0.42, 0xe2e8f0);
  gauge.position.set(0.15, 0.7, 0);
  root.add(gauge);
  addArrow(root, new THREE.Vector3(0.15, 0.7, 0), new THREE.Vector3(0.15 + Math.cos(pressure / 115) * 0.34, 0.7 + Math.sin(pressure / 115) * 0.34, 0), 0xf43f5e);
  root.add(label(`P ${pressure.toFixed(0)} kPa`, new THREE.Vector3(-0.2, 1.28, 0), 0xf43f5e));

  const origin = new THREE.Vector3(1.1, -0.95, 0.15);
  addArrow(root, origin, origin.clone().add(new THREE.Vector3(1.85, 0, 0)), 0x94a3b8);
  addArrow(root, origin, origin.clone().add(new THREE.Vector3(0, 1.55, 0)), 0x94a3b8);
  const pathPoints = process === "isobaric"
    ? [new THREE.Vector3(1.25, -0.15, 0.15), new THREE.Vector3(2.72, -0.15, 0.15)]
    : process === "isochoric"
      ? [new THREE.Vector3(1.85, -0.72, 0.15), new THREE.Vector3(1.85, 0.48, 0.15)]
      : Array.from({ length: 42 }, (_, index) => {
        const u = index / 41;
        return new THREE.Vector3(1.25 + u * 1.55, 0.48 - (process === "adiabatic" ? u ** 1.4 : u ** 1.15) * 1.25, 0.15);
      });
  const pvPath = tube(pathPoints, 0.025, process === "adiabatic" ? 0xfacc15 : 0x22d3ee, 0.95);
  pvPath.userData.role = "field";
  pvPath.userData.power = 0.8;
  root.add(pvPath);
  const tracer = sphere(0.07, 0xfacc15);
  tracer.userData.role = "path";
  tracer.userData.path = pathPoints;
  root.add(tracer);
  root.add(label(`P-V ${process}`, new THREE.Vector3(1.15, 0.88, 0.2), 0x67e8f9));
  root.add(label(`work ${(process === "isochoric" ? 0 : pressure * (volume - 3) / 100).toFixed(2)} kJ`, new THREE.Vector3(1.16, -1.2, 0.35), 0xfacc15));
  root.add(label("quasi-static ideal gas", new THREE.Vector3(-2.75, -1.08, 0.25), 0x94a3b8));
}

function buildStatisticalEnsemble(root: THREE.Group, temperature: number, particleInput: number, interaction: number) {
  addPlatform(root);
  const spread = clamp(temperature / 900 + interaction * 0.28, 0.18, 1.08);
  const particleCount = Math.round(clamp(particleInput || 70, 24, 120));
  const boxFrame = box(2.6, 1.8, 1.8, 0x22d3ee, 0.1);
  boxFrame.position.set(-1.35, -0.05, 0);
  root.add(boxFrame);
  for (let index = 0; index < 34; index += 1) {
    const energyRank = Math.abs(((index * 17) % 33) - 16) / 16;
    const isHighEnergy = energyRank < spread;
    const particle = sphere(isHighEnergy ? 0.055 : 0.04, isHighEnergy ? 0xfacc15 : 0x38bdf8, 0.86);
    particle.position.set(
      -2.42 + ((index * 31) % 210) / 100,
      -0.75 + ((index * 19) % 150) / 100,
      -0.76 + ((index * 23) % 150) / 100
    );
    particle.userData.role = "particle";
    particle.userData.seed = index * 0.61;
    particle.userData.speed = 0.35 + spread * 1.8 + (index % 5) * 0.05;
    root.add(particle);
  }
  const bins = [0.22, 0.48, 0.78, 1, 0.82, 0.5, 0.26];
  bins.forEach((heightBase, index) => {
    const height = clamp(heightBase * spread * 1.25, 0.12, 1.35);
    const bar = box(0.18, height, 0.24, index === 3 ? 0xfacc15 : 0x22d3ee, 0.82);
    bar.position.set(0.95 + index * 0.28, -1.0 + height / 2, 0.1);
    bar.userData.role = "pulse";
    bar.userData.power = 0.3 + height;
    root.add(bar);
  });
  const wall = box(2.25, 1.55, 0.04, 0x0f172a, 0.52);
  wall.position.set(1.82, -0.2, 0.28);
  root.add(wall);
  const meanMarker = box(0.035, 1.45, 0.08, 0xf43f5e, 0.92);
  meanMarker.position.set(1.78, -0.2, 0.42);
  meanMarker.userData.role = "pulse";
  meanMarker.userData.power = 0.9;
  root.add(meanMarker);
  root.add(label(`samples ${particleCount}`, new THREE.Vector3(-2.58, 1.28, 0.25), 0x67e8f9));
  root.add(label(`spread ${spread.toFixed(2)}`, new THREE.Vector3(-0.55, 1.16, 0.25), 0xfacc15));
  root.add(label("histogram wall", new THREE.Vector3(1.08, 0.92, 0.45), 0x22d3ee));
  root.add(label("mean", new THREE.Vector3(1.84, 0.6, 0.55), 0xf43f5e));
  root.add(label("qualitative ensemble model", new THREE.Vector3(-2.55, -1.22, 0.25), 0x94a3b8));
}

function buildCircuit(root: THREE.Group, voltage: number, resistance: number, _unused = 0) {
  const path = rectanglePath(2.8, 1.45);
  root.add(line(path, 0x94a3b8));
  const battery = box(0.5, 0.85, 0.45, 0x22d3ee);
  battery.position.set(-1.45, -0.85, 0);
  root.add(battery);
  const resistor = box(0.9, 0.35, 0.35, 0xfacc15);
  resistor.position.set(0, 0.65, 0);
  root.add(resistor);
  const bulb = sphere(0.32, 0xfde68a);
  bulb.position.set(1.5, -0.05, 0);
  bulb.userData.role = "bulb";
  bulb.userData.power = clamp(voltage / Math.max(1, resistance), 0.15, 4);
  root.add(bulb);
  for (let index = 0; index < 8; index += 1) {
    const charge = sphere(0.06, 0x22d3ee);
    charge.userData.role = "charge";
    charge.userData.path = path;
    charge.userData.offset = index / 8;
    charge.userData.speed = clamp(voltage / Math.max(1, resistance), 0.18, 3);
    root.add(charge);
  }
}

function buildStaticElectricity(root: THREE.Group, chargeA: number, chargeB: number, distance: number) {
  addPlatform(root);
  const q1 = chargeA >= 0 ? 1 : -1;
  const q2 = chargeB >= 0 ? 1 : -1;
  const gap = clamp(distance || 3, 1, 8) * 0.38;
  const left = sphere(0.46, q1 > 0 ? 0xf43f5e : 0x38bdf8, 0.92);
  const right = sphere(0.46, q2 > 0 ? 0xf43f5e : 0x38bdf8, 0.92);
  left.position.set(-gap, -0.18, 0);
  right.position.set(gap, -0.18, 0);
  left.userData.role = "pulse";
  right.userData.role = "pulse";
  root.add(left, right);
  root.add(label(q1 > 0 ? "+" : "-", left.position.clone().add(new THREE.Vector3(-0.08, 0.08, 0.5)), 0xffffff));
  root.add(label(q2 > 0 ? "+" : "-", right.position.clone().add(new THREE.Vector3(-0.08, 0.08, 0.5)), 0xffffff));
  for (let index = 0; index < 8; index += 1) {
    const y = -0.65 + index * 0.18;
    const curve = tube([
      new THREE.Vector3(-gap + 0.35, y, 0),
      new THREE.Vector3(0, y + (q1 === q2 ? (index < 4 ? -0.42 : 0.42) : 0.25 * Math.sin(index)), 0.18),
      new THREE.Vector3(gap - 0.35, y, 0),
    ], 0.01, q1 === q2 ? 0xfacc15 : 0x22d3ee, 0.58);
    curve.userData.role = "field";
    curve.userData.phase = index * 0.2;
    root.add(curve);
  }
  const direction = q1 === q2 ? -1 : 1;
  addArrow(root, left.position.clone().add(new THREE.Vector3(0, 0.65, 0)), left.position.clone().add(new THREE.Vector3(direction * 0.95, 0.65, 0)), q1 === q2 ? 0xf97316 : 0x34d399);
  addArrow(root, right.position.clone().add(new THREE.Vector3(0, 0.65, 0)), right.position.clone().add(new THREE.Vector3(-direction * 0.95, 0.65, 0)), q1 === q2 ? 0xf97316 : 0x34d399);
  if (Math.abs(chargeA * chargeB) / Math.max(1, distance) > 25) {
    const spark = tube([new THREE.Vector3(-0.25, 0.1, 0.1), new THREE.Vector3(0.05, 0.42, -0.05), new THREE.Vector3(0.25, 0.04, 0.12)], 0.022, 0xfacc15, 0.95);
    spark.userData.role = "wave-shift";
    root.add(spark);
  }
  root.add(label(q1 === q2 ? "repulsion" : "attraction", new THREE.Vector3(-0.5, 1.18, 0.2), q1 === q2 ? 0xf97316 : 0x34d399));
  root.add(label("qualitative charge model", new THREE.Vector3(-2.6, -1.0, 0.25), 0x94a3b8));
}

function buildElectrostaticField(root: THREE.Group, charge: number, distance: number, testCharge: number) {
  addPlatform(root);
  const q = charge >= 0 ? 1 : -1;
  const source = sphere(0.34, q > 0 ? 0xf43f5e : 0x38bdf8, 0.95);
  source.userData.role = "pulse";
  root.add(source);
  for (let index = 0; index < 12; index += 1) {
    const angle = (index / 12) * Math.PI * 2;
    const start = new THREE.Vector3(Math.cos(angle) * 0.5, -0.18, Math.sin(angle) * 0.5);
    const end = new THREE.Vector3(Math.cos(angle) * 2.35 * q, -0.18, Math.sin(angle) * 2.35 * q);
    addArrow(root, start, end, 0x22d3ee);
  }
  [0.75, 1.25, 1.85].forEach((radius, index) => {
    const equipotential = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.012, 10, 96), material(index === 0 ? 0xfacc15 : 0x67e8f9, 0.38));
    equipotential.rotation.x = Math.PI / 2;
    root.add(equipotential);
  });
  const r = clamp(distance || 2, 0.7, 6) * 0.45;
  const test = sphere(0.13, testCharge >= 0 ? 0xfacc15 : 0xa78bfa, 0.95);
  test.position.set(r, 0.08, 0.35);
  root.add(test);
  addArrow(root, test.position, test.position.clone().add(new THREE.Vector3(q * Math.sign(testCharge || 1) * 0.85, 0, 0)), 0xf43f5e);
  root.add(label("point charge", new THREE.Vector3(-0.48, 0.62, 0.2), q > 0 ? 0xf43f5e : 0x38bdf8));
  root.add(label("equipotential rings", new THREE.Vector3(0.85, -1.05, 0.25), 0xfacc15));
  root.add(label(`E ~ 1/r^2 | V ~ 1/r`, new THREE.Vector3(-2.55, 1.18, 0.25), 0x67e8f9));
  root.add(label("singularity visually clamped", new THREE.Vector3(-2.55, -1.22, 0.25), 0x94a3b8));
}

function buildElectrolysis(root: THREE.Group, current: number, time: number, chargeScale: number) {
  addPlatform(root);
  const beaker = cylinder(1.05, 1.18, 1.5, 0x38bdf8, 0.18);
  beaker.position.set(0, -0.38, 0);
  root.add(beaker);
  const electrolyte = cylinder(0.94, 1.04, 1.08, 0x22d3ee, 0.28);
  electrolyte.position.set(0, -0.62, 0);
  root.add(electrolyte);
  const anode = box(0.16, 1.45, 0.12, 0xf97316, 0.92);
  const cathode = box(0.16, 1.45, 0.12, 0x94a3b8, 0.92);
  anode.position.set(-0.55, -0.15, 0);
  cathode.position.set(0.55, -0.15, 0);
  root.add(anode, cathode);
  const deposit = box(0.2, clamp(current * time * (chargeScale || 1) / 80, 0.08, 0.75), 0.16, 0xfacc15, 0.9);
  deposit.position.set(0.55, -0.88 + deposit.scale.y * 0.1, 0.1);
  root.add(deposit);
  for (let index = 0; index < 22; index += 1) {
    const ion = sphere(0.045, index % 2 ? 0x38bdf8 : 0xf43f5e, 0.86);
    ion.position.set(-0.72 + ((index * 37) % 140) / 100, -0.9 + ((index * 19) % 100) / 100, -0.45 + ((index * 23) % 90) / 100);
    ion.userData.role = "path";
    ion.userData.path = index % 2 ? [ion.position.clone(), new THREE.Vector3(0.48, -0.35, ion.position.z)] : [ion.position.clone(), new THREE.Vector3(-0.48, -0.35, ion.position.z)];
    ion.userData.offset = index / 22;
    root.add(ion);
  }
  for (let index = 0; index < 8; index += 1) {
    const bubble = sphere(0.035, 0xe0f2fe, 0.7);
    bubble.position.set(index % 2 ? -0.55 : 0.55, -0.86 + index * 0.12, 0.2);
    bubble.userData.role = "bubble";
    bubble.userData.speed = 0.35 + index * 0.05;
    root.add(bubble);
  }
  root.add(label("anode +", new THREE.Vector3(-1.15, 0.8, 0.2), 0xf97316));
  root.add(label("cathode - deposit", new THREE.Vector3(0.5, 0.8, 0.2), 0xfacc15));
  root.add(label("simplified electrolysis model", new THREE.Vector3(-2.55, -1.18, 0.2), 0x94a3b8));
}

function buildMeterBridge(root: THREE.Group, known: number, balanceInput: number, unknown: number) {
  addPlatform(root);
  const board = box(5.8, 0.16, 1.05, 0x92400e, 0.68);
  board.position.set(0, -0.78, 0);
  root.add(board);
  const wire = box(5.3, 0.045, 0.06, 0xfacc15, 0.95);
  wire.position.set(0, -0.58, 0.28);
  root.add(wire);
  const l = clamp(balanceInput || (known / Math.max(1, known + unknown)) * 100, 8, 92);
  const x = -2.65 + (l / 100) * 5.3;
  const jockey = cylinder(0.045, 0.045, 1.2, 0xe2e8f0, 0.95);
  jockey.position.set(x, 0.04, 0.28);
  jockey.rotation.z = 0.12;
  root.add(jockey);
  const nullMeter = ring(0.32, 0xfacc15);
  nullMeter.position.set(0, 0.42, -0.42);
  root.add(nullMeter);
  const needle = box(0.035, 0.5, 0.035, 0xfacc15, 0.95);
  needle.position.set(0, 0.42, -0.37);
  needle.rotation.z = THREE.MathUtils.degToRad(clamp(l - 50, -35, 35));
  root.add(needle);
  const knownBox = box(0.9, 0.32, 0.42, 0x22d3ee, 0.9);
  knownBox.position.set(-1.85, -0.3, -0.25);
  const unknownBox = box(0.9, 0.32, 0.42, 0xa78bfa, 0.9);
  unknownBox.position.set(1.85, -0.3, -0.25);
  root.add(knownBox, unknownBox);
  root.add(label(`l ${l.toFixed(1)} cm`, new THREE.Vector3(x - 0.3, 0.74, 0.35), 0xfacc15));
  root.add(label("jockey probe", new THREE.Vector3(x - 0.45, 1.02, 0.35), 0xe2e8f0));
  root.add(label("galvanometer null", new THREE.Vector3(-0.55, 0.96, -0.4), 0xfacc15));
  root.add(label("uniform wire; contact resistance ignored", new THREE.Vector3(-2.65, -1.16, 0.25), 0x94a3b8));
}

function buildInternalCell(root: THREE.Group, emf: number, loadResistance: number, internalResistance: number) {
  addPlatform(root);
  const e = clamp(emf || 12, 1, 24);
  const load = clamp(loadResistance || 8, 0.5, 100);
  const internal = clamp(internalResistance || 1, 0.1, 10);
  const current = e / (load + internal);
  const terminal = e - current * internal;
  const cell = box(1.4, 0.72, 0.65, 0x22d3ee, 0.9);
  cell.position.set(-1.75, -0.45, 0);
  root.add(cell);
  const internalBlock = box(0.5, 0.36, 0.48, 0xf97316, 0.85);
  internalBlock.position.set(-1.32, -0.45, 0.04);
  internalBlock.userData.role = "pulse";
  internalBlock.userData.power = clamp(current * internal, 0.25, 2.5);
  root.add(internalBlock);
  const loadBox = box(1.0, 0.46, 0.46, 0xfacc15, 0.9);
  loadBox.position.set(1.35, -0.45, 0);
  root.add(loadBox);
  const path = rectanglePath(3.8, 1.35);
  root.add(line(path, 0x94a3b8));
  for (let index = 0; index < 10; index += 1) {
    const charge = sphere(0.05, 0x22d3ee, 0.85);
    charge.userData.role = "charge";
    charge.userData.path = path;
    charge.userData.offset = index / 10;
    charge.userData.speed = clamp(current, 0.2, 3);
    root.add(charge);
  }
  const meter = ring(0.34, 0x67e8f9);
  meter.position.set(1.35, 0.58, 0);
  root.add(meter);
  root.add(label(`EMF ${e.toFixed(1)} V`, new THREE.Vector3(-2.35, 0.28, 0.2), 0x67e8f9));
  root.add(label(`terminal ${terminal.toFixed(2)} V`, new THREE.Vector3(0.75, 1.02, 0.2), 0x67e8f9));
  root.add(label("internal drop Ir", new THREE.Vector3(-1.75, -1.12, 0.25), 0xf97316));
  root.add(label("linear internal resistance model", new THREE.Vector3(-2.65, -1.35, 0.25), 0x94a3b8));
}

function buildKirchhoff3D(root: THREE.Group, voltage: number, r1: number, r2: number) {
  addPlatform(root);
  const board = box(4.9, 0.12, 2.2, 0x0f172a, 0.62);
  board.position.set(0, -0.82, 0);
  root.add(board);
  const nodes = [new THREE.Vector3(-1.9, -0.55, 0), new THREE.Vector3(1.9, -0.55, 0), new THREE.Vector3(0, -0.55, 0.75), new THREE.Vector3(0, -0.55, -0.75)];
  nodes.forEach((node) => {
    const pad = cylinder(0.12, 0.12, 0.04, 0xfacc15, 0.95);
    pad.position.copy(node);
    root.add(pad);
  });
  root.add(tube([nodes[0], nodes[2], nodes[1]], 0.035, 0x22d3ee, 0.95));
  root.add(tube([nodes[0], nodes[3], nodes[1]], 0.035, 0xa78bfa, 0.95));
  root.add(tube([new THREE.Vector3(-2.55, -0.55, 0), nodes[0]], 0.035, 0xfacc15, 0.95));
  root.add(tube([nodes[1], new THREE.Vector3(2.55, -0.55, 0)], 0.035, 0xfacc15, 0.95));
  const resistorA = box(0.72, 0.26, 0.26, 0x22d3ee, 0.9);
  resistorA.position.set(0, -0.35, 0.75);
  const resistorB = box(0.72, 0.26, 0.26, 0xa78bfa, 0.9);
  resistorB.position.set(0, -0.35, -0.75);
  root.add(resistorA, resistorB);
  root.add(label("KCL: I in = I1 + I2", new THREE.Vector3(-2.45, 0.35, 0.25), 0xfacc15));
  root.add(label(`V drops: R1 ${r1.toFixed(1)}, R2 ${r2.toFixed(1)}`, new THREE.Vector3(-0.85, 0.95, 0.25), 0x67e8f9));
  root.add(label(`source ${voltage.toFixed(1)} V`, new THREE.Vector3(1.55, 0.35, 0.25), 0xfacc15));
  root.add(label("ideal circuit elements", new THREE.Vector3(-2.35, -1.18, 0.25), 0x94a3b8));
}

function buildLcr3D(root: THREE.Group, resistance: number, frequency: number, capacitance: number) {
  addPlatform(root);
  const f = clamp(frequency || 50, 1, 1000);
  const c = clamp(capacitance || 10, 0.1, 100);
  const l = 0.1;
  const f0 = 1 / (2 * Math.PI * Math.sqrt(l * c * 1e-6));
  const near = Math.abs(f - f0) / Math.max(1, f0) < 0.18;
  const path = rectanglePath(3.9, 1.35);
  root.add(line(path, near ? 0x34d399 : 0x94a3b8));
  const resistor = box(0.72, 0.26, 0.26, 0xfacc15, 0.9);
  resistor.position.set(-1.15, 0.66, 0);
  root.add(resistor);
  const coil = helix(0.65, 0.22, 8, 0xa78bfa);
  coil.position.set(0.15, 0.66, 0);
  root.add(coil);
  const capA = box(0.06, 0.72, 0.36, 0x67e8f9, 0.95);
  const capB = box(0.06, 0.72, 0.36, 0x67e8f9, 0.95);
  capA.position.set(1.28, 0.66, 0);
  capB.position.set(1.46, 0.66, 0);
  root.add(capA, capB);
  const phasor = ring(0.48, 0x22d3ee);
  phasor.position.set(-1.35, -0.28, 0);
  root.add(phasor);
  addArrow(root, new THREE.Vector3(-1.35, -0.28, 0), new THREE.Vector3(-0.85, -0.28, 0), 0x34d399);
  addArrow(root, new THREE.Vector3(-1.35, -0.28, 0), new THREE.Vector3(-1.35, near ? 0.25 : 0.05, 0), 0xf43f5e);
  const curve = Array.from({ length: 56 }, (_, index) => {
    const u = index / 55;
    const peak = near ? 1.15 : 0.45 + 0.25 * Math.sin(u * Math.PI);
    return new THREE.Vector3(0.45 + u * 2.25, -0.85 + Math.sin(u * Math.PI) * peak, 0.35);
  });
  root.add(tube(curve, 0.018, near ? 0x34d399 : 0x22d3ee, 0.95));
  root.add(label(near ? "resonance peak" : `f0 ${f0.toFixed(0)} Hz`, new THREE.Vector3(0.68, 0.98, 0.25), near ? 0x34d399 : 0xfacc15));
  root.add(label(`R ${resistance.toFixed(1)} ohm | RMS AC`, new THREE.Vector3(-2.55, -1.15, 0.25), 0x94a3b8));
  root.add(label("sinusoidal steady state", new THREE.Vector3(0.8, -1.22, 0.25), 0x94a3b8));
}

function buildLorentz3D(root: THREE.Group, chargeInput: number, speedInput: number, fieldInput: number) {
  addPlatform(root);
  const qSign = chargeInput >= 0 ? 1 : -1;
  const chargeMagnitude = Math.max(0.1, Math.abs(chargeInput || 1));
  const speed = clamp(speedInput || 4, 0.2, 12);
  const field = clamp(Math.abs(fieldInput || 1), 0.1, 8);
  const forceDirection = -qSign;
  const radius = clamp(speed / (chargeMagnitude * field) * 1.45, 0.55, 2.4);
  const forceMag = chargeMagnitude * speed * field;

  const fieldBox = box(3.4, 1.8, 1.7, 0x22d3ee, 0.1);
  fieldBox.position.set(0.35, -0.18, 0);
  root.add(fieldBox);
  for (let x = -1; x <= 2; x += 1) {
    for (let y = -1; y <= 1; y += 1) {
      const symbol = qSign > 0 ? "B out" : "B out";
      root.add(label(symbol, new THREE.Vector3(x * 0.72, y * 0.42 - 0.18, -0.78), 0x67e8f9));
      addArrow(root, new THREE.Vector3(x * 0.72, y * 0.42 - 0.18, -0.42), new THREE.Vector3(x * 0.72, y * 0.42 - 0.18, 0.42), 0x22d3ee);
    }
  }

  const start = new THREE.Vector3(-2.65, -0.18, 0);
  const entry = new THREE.Vector3(-0.85, -0.18, 0);
  const pathPoints = [
    start,
    entry,
    ...Array.from({ length: 48 }, (_, index) => {
      const theta = (index / 47) * Math.PI * 0.82;
      return new THREE.Vector3(
        -0.85 + Math.sin(theta) * radius,
        -0.18 + forceDirection * (1 - Math.cos(theta)) * radius,
        0.05 + Math.sin(theta) * 0.12
      );
    }),
  ];
  root.add(tube(pathPoints, 0.025, qSign > 0 ? 0xfacc15 : 0xa78bfa, 0.9));
  const charge = sphere(0.16, qSign > 0 ? 0xfacc15 : 0xa78bfa, 0.95);
  charge.userData.role = "path";
  charge.userData.path = pathPoints;
  root.add(charge);

  addArrow(root, new THREE.Vector3(-2.55, 0.34, 0), new THREE.Vector3(-1.35, 0.34, 0), 0x34d399);
  root.add(label("v", new THREE.Vector3(-1.95, 0.62, 0.12), 0x34d399));
  addArrow(root, new THREE.Vector3(-0.75, -0.18, 0.55), new THREE.Vector3(-0.75, -0.18, 1.32), 0x22d3ee);
  root.add(label("B out of page", new THREE.Vector3(-0.58, 0.18, 1.05), 0x67e8f9));
  addArrow(root, new THREE.Vector3(-0.42, -0.18, 0), new THREE.Vector3(-0.42, -0.18 + forceDirection * 1.05, 0), qSign > 0 ? 0xf43f5e : 0xfb7185);
  root.add(label(qSign > 0 ? "F downward" : "F upward", new THREE.Vector3(-0.18, -0.18 + forceDirection * 1.12, 0.12), 0xf43f5e));

  const radiusCue = ring(radius, 0xfacc15);
  radiusCue.position.set(-0.85, -0.18 + forceDirection * radius, 0);
  radiusCue.rotation.x = Math.PI / 2;
  radiusCue.scale.y = 0.32;
  root.add(radiusCue);
  root.add(label(`r = mv/|q|B ~ ${radius.toFixed(2)} m`, new THREE.Vector3(0.72, -1.18, 0.22), 0xfacc15));
  root.add(label(`F = q(v x B) | ${forceMag.toFixed(1)} N cue`, new THREE.Vector3(-2.65, 1.18, 0.22), 0x67e8f9));
  root.add(label(qSign > 0 ? "positive charge" : "negative charge reverses force", new THREE.Vector3(-2.65, -1.16, 0.22), qSign > 0 ? 0xfacc15 : 0xa78bfa));
  root.add(label("uniform B; non-relativistic; v perpendicular B", new THREE.Vector3(0.25, 1.18, 0.22), 0x94a3b8));
}

function buildElectromagnet(root: THREE.Group, turns: number, current: number, core: number) {
  const coreMesh = cylinder(0.28, 0.28, 3.5, 0x64748b);
  coreMesh.rotation.z = Math.PI / 2;
  root.add(coreMesh);
  root.add(helix(1.75, 0.45, Math.round(clamp(turns / 30, 6, 18)), 0xf97316));
  for (let index = 0; index < 5; index += 1) {
    const field = ring(0.75 + index * 0.3, 0x22d3ee);
    field.rotation.y = Math.PI / 2;
    field.userData.role = "field";
    field.userData.phase = index * 0.35;
    field.userData.power = clamp(current * core, 0.4, 5);
    root.add(field);
  }
  addArrow(root, new THREE.Vector3(-2.4, 0.68, 0), new THREE.Vector3(-1.35, 0.68, 0), 0xfacc15);
  root.add(label("conventional current", new THREE.Vector3(-2.55, 1.02, 0.2), 0xfacc15));
  root.add(label("N", new THREE.Vector3(1.82, 0.35, 0.2), 0xf43f5e));
  root.add(label("S", new THREE.Vector3(-2.12, 0.35, 0.2), 0x38bdf8));
  root.add(label("core", new THREE.Vector3(-0.25, -0.72, 0.2), 0x94a3b8));
  root.add(label("ideal solenoid approximation", new THREE.Vector3(-2.65, -1.18, 0.2), 0x94a3b8));
}

function buildInduction(root: THREE.Group, turns: number, flux: number, time: number) {
  const current = Math.max(0.4, flux / Math.max(1, time));
  buildElectromagnet(root, turns, current, 1.3);
  const magnet = new THREE.Group();
  const north = box(0.55, 0.55, 0.58, 0xf43f5e);
  const south = box(0.55, 0.55, 0.58, 0x38bdf8);
  north.position.z = 0.3;
  south.position.z = -0.3;
  magnet.add(north, south);
  magnet.userData.role = "magnet";
  root.add(magnet);
  for (let index = 0; index < 7; index += 1) {
    const ribbon = tube([
      new THREE.Vector3(-2.55, -0.75 + index * 0.25, -0.8),
      new THREE.Vector3(-0.8, -0.35 + Math.sin(index) * 0.18, -0.15),
      new THREE.Vector3(0.85, -0.35 + Math.cos(index) * 0.18, 0.15),
      new THREE.Vector3(2.45, -0.75 + index * 0.25, 0.8),
    ], 0.012, 0x22d3ee, 0.18 + index * 0.05);
    ribbon.userData.role = "field";
    ribbon.userData.phase = index * 0.3;
    ribbon.userData.power = clamp(current * 9, 0.5, 4);
    root.add(ribbon);
  }
  const dialBase = cylinder(0.42, 0.42, 0.08, 0x334155, 0.92);
  dialBase.rotation.x = Math.PI / 2;
  dialBase.position.set(2.55, -0.85, 0);
  root.add(dialBase);
  const needle = box(0.07, 0.62, 0.04, 0xfacc15);
  needle.position.set(2.55, -0.85, 0.04);
  needle.userData.role = "needle";
  needle.userData.power = clamp(current * 8, 0.4, 2.4);
  root.add(needle);
  root.add(label("moving magnet", new THREE.Vector3(-2.55, 0.95, 0), 0xf43f5e));
  root.add(label("changing flux", new THREE.Vector3(0, 1.12, 0), 0x22d3ee));
  root.add(label("induced emf", new THREE.Vector3(2.15, -0.2, 0), 0xfacc15));
}

function buildGenerator(root: THREE.Group, turns: number, field: number, frequency: number) {
  const poles = [box(0.55, 2.25, 0.78, 0xf43f5e), box(0.55, 2.25, 0.78, 0x38bdf8)];
  poles[0].position.x = -1.8;
  poles[1].position.x = 1.8;
  root.add(...poles);
  root.add(label("N", new THREE.Vector3(-1.8, 1.55, 0), 0xf43f5e));
  root.add(label("S", new THREE.Vector3(1.8, 1.55, 0), 0x38bdf8));
  const coil = new THREE.Group();
  coil.userData.role = "spin";
  coil.userData.speed = clamp(frequency / 10, 0.5, 8);
  coil.add(tube([new THREE.Vector3(-0.85, -0.75, 0), new THREE.Vector3(0.85, -0.75, 0), new THREE.Vector3(0.85, 0.75, 0), new THREE.Vector3(-0.85, 0.75, 0), new THREE.Vector3(-0.85, -0.75, 0)], 0.025, 0xfacc15, 0.95));
  coil.add(box(0.18, 0.18, 1.85, 0xfacc15, 0.85));
  root.add(coil);
  const rings = [ring(0.26, 0xfacc15), ring(0.36, 0xfacc15)];
  rings.forEach((item, index) => {
    item.rotation.x = Math.PI / 2;
    item.position.set(0.95 + index * 0.22, -0.9, 0);
    item.userData.role = "spin";
    item.userData.speed = clamp(frequency / 10, 0.5, 8);
    root.add(item);
  });
  const waveform = sineWave(2.8, 0.62, clamp(turns * field / 250, 0.18, 0.95), 0x22d3ee);
  waveform.position.x = 0.1;
  waveform.userData.role = "wave-shift";
  waveform.userData.speed = clamp(frequency / 20, 0.25, 4);
  root.add(waveform);
  root.add(label("rotating coil", new THREE.Vector3(-0.65, 1.34, 0), 0xfacc15));
  root.add(label("AC output", new THREE.Vector3(1.35, -0.2, -1.2), 0x22d3ee));
}

function buildTransformer(root: THREE.Group, primaryVoltage: number, primaryTurns: number, secondaryTurns: number) {
  const core = box(2.9, 1.65, 0.5, 0x64748b, 0.46);
  root.add(core);
  const primary = helix(0.95, 0.42, Math.round(clamp(primaryTurns / 80, 5, 13)), 0xf97316);
  primary.position.x = -0.85;
  root.add(primary);
  const secondary = helix(0.95, 0.42, Math.round(clamp(secondaryTurns / 100, 5, 16)), 0x22d3ee);
  secondary.position.x = 0.85;
  root.add(secondary);
  for (let index = 0; index < 5; index += 1) {
    const fieldLoop = roundedFluxLoop(1.65 + index * 0.05, 0.78 + index * 0.03, 0x34d399);
    fieldLoop.userData.role = "field";
    fieldLoop.userData.phase = index * 0.22;
    fieldLoop.userData.power = clamp(primaryVoltage / 80, 0.5, 3);
    root.add(fieldLoop);
  }
  const ratio = secondaryTurns / Math.max(1, primaryTurns);
  const primaryBar = box(0.2, clamp(primaryVoltage / 120, 0.25, 1.45), 0.16, 0xf97316, 0.86);
  primaryBar.position.set(-2.35, -0.95 + primaryBar.scale.y * 0, -0.95);
  root.add(primaryBar);
  const secondaryBar = box(0.2, clamp((primaryVoltage * ratio) / 120, 0.25, 1.6), 0.16, 0x22d3ee, 0.86);
  secondaryBar.position.set(2.35, -0.95, -0.95);
  root.add(secondaryBar);
  root.add(label("primary AC", new THREE.Vector3(-1.65, 1.25, 0), 0xf97316));
  root.add(label("shared flux core", new THREE.Vector3(0, 1.35, 0), 0x34d399));
  root.add(label(ratio >= 1 ? "step-up" : "step-down", new THREE.Vector3(1.62, 1.25, 0), 0x22d3ee));
}

function buildLens(root: THREE.Group, a: number, b: number, _unused = 0) {
  const bench = box(6.5, 0.045, 0.08, 0x475569, 0.72);
  bench.position.y = -0.82;
  root.add(bench);
  const lens = sphere(0.95, 0x67e8f9, 0.34);
  lens.scale.set(0.18, 1.45, 1.02);
  root.add(lens);
  const objectDistance = clamp(a / 8, 0.8, 2.8);
  const focalRatio = clamp(a / Math.max(1, b), 0.28, 2);
  const objectX = -2.5;
  const imageX = clamp(1.15 + focalRatio * 1.2, 1.35, 3.15);
  const objectArrow = box(0.06, 1.0, 0.06, 0xf43f5e);
  objectArrow.position.set(objectX, -0.3, 0);
  root.add(objectArrow);
  addArrow(root, new THREE.Vector3(objectX, 0.2, 0), new THREE.Vector3(objectX, 0.8, 0), 0xf43f5e);
  const screen = box(0.05, 1.85, 1.25, 0x334155, 0.5);
  screen.position.x = imageX;
  root.add(screen);
  [-0.58, 0, 0.58].forEach((y, index) => {
    const z = (index - 1) * 0.28;
    root.add(tube([new THREE.Vector3(objectX, 0.55, z), new THREE.Vector3(0, y * 0.18, z * 0.5), new THREE.Vector3(imageX, -0.55, z * -0.4)], 0.014, index === 1 ? 0xffffff : 0xfacc15, 0.86));
  });
  const photon = sphere(0.08, 0xfacc15);
  photon.userData.role = "path";
  photon.userData.path = [new THREE.Vector3(objectX, 0.55, 0), new THREE.Vector3(0, 0.05, 0), new THREE.Vector3(imageX, -0.55, 0)];
  root.add(photon);
  addMarker(root, new THREE.Vector3(-objectDistance, -0.82, 0), 0xfacc15);
  addMarker(root, new THREE.Vector3(objectDistance, -0.82, 0), 0xfacc15);
  root.add(label("object", new THREE.Vector3(objectX - 0.25, 1.1, 0), 0xf43f5e));
  root.add(label("convex lens", new THREE.Vector3(-0.15, 1.55, 0), 0x67e8f9));
  root.add(label("image screen", new THREE.Vector3(imageX - 0.35, 1.1, 0), 0x22d3ee));
  root.add(label("F", new THREE.Vector3(objectDistance, -0.45, 0), 0xfacc15));
}

function buildEyeFocus(root: THREE.Group, focusCm: number, retinaCm: number, defectMode: number) {
  const mode = Math.round(defectMode);
  const retinaX = 2.15;
  const focusOffset = mode === 0 ? clamp((focusCm - retinaCm) * 0.42, -0.42, 0.42) : clamp((focusCm - retinaCm) * 0.72, -0.9, 0.9);
  const uncorrectedFocusX = retinaX + focusOffset;
  const correctedFocusX = mode === 0 ? uncorrectedFocusX : retinaX;
  const lensColor = mode === 1 ? 0xa78bfa : mode === 2 ? 0x34d399 : 0x67e8f9;
  addPlatform(root);

  const eyeShell = sphere(1.42, 0xf8fafc, 0.18);
  eyeShell.scale.set(1.48, 0.86, 0.82);
  eyeShell.position.set(0.95, 0.12, 0);
  root.add(eyeShell);

  const vitreousGlow = sphere(1.28, 0xf97316, 0.12);
  vitreousGlow.scale.set(1.36, 0.74, 0.72);
  vitreousGlow.position.set(1.02, 0.12, 0);
  root.add(vitreousGlow);

  const cornea = sphere(0.52, 0x67e8f9, 0.26);
  cornea.scale.set(0.34, 0.96, 0.86);
  cornea.position.set(-0.92, 0.12, 0);
  root.add(cornea);

  const iris = ring(0.42, 0x38bdf8);
  iris.rotation.y = Math.PI / 2;
  iris.position.set(-0.64, 0.12, 0);
  root.add(iris);
  const pupil = sphere(0.16, 0x020617, 0.92);
  pupil.scale.set(0.32, 1, 1);
  pupil.position.set(-0.66, 0.12, 0);
  root.add(pupil);

  const eyeLens = sphere(0.42, 0xfacc15, 0.34);
  eyeLens.scale.set(0.42, 1.18, 0.88);
  eyeLens.position.set(-0.18, 0.12, 0);
  root.add(eyeLens);

  const retina = new THREE.Mesh(
    new THREE.SphereGeometry(1.18, 48, 24, -Math.PI / 4.3, Math.PI / 2.15, Math.PI / 4, Math.PI / 2),
    material(0xfb7185, 0.34)
  );
  retina.scale.set(0.38, 1.02, 0.92);
  retina.position.set(retinaX + 0.08, 0.12, 0);
  retina.rotation.y = Math.PI / 2;
  root.add(retina);

  const opticNerve = box(1.1, 0.22, 0.28, 0xf97316, 0.58);
  opticNerve.position.set(2.95, 0.06, 0.04);
  opticNerve.rotation.z = -0.08;
  root.add(opticNerve);

  if (mode > 0) {
    const correctiveLens = sphere(0.5, lensColor, 0.3);
    correctiveLens.scale.set(mode === 1 ? 0.14 : 0.34, 1.36, 1.02);
    correctiveLens.position.set(-2.15, 0.12, 0);
    root.add(correctiveLens);
    root.add(label(mode === 1 ? "concave lens" : "convex lens", new THREE.Vector3(-2.62, 1.42, 0), lensColor));
  }

  [-0.44, 0, 0.44].forEach((y, index) => {
    const z = (index - 1) * 0.18;
    const start = new THREE.Vector3(-3.25, y + 0.12, z);
    const correction = new THREE.Vector3(mode > 0 ? -2.15 : -1.74, mode === 1 ? y * 0.42 + 0.12 : mode === 2 ? y * 0.16 + 0.12 : y * 0.32 + 0.12, z * 0.58);
    const crystalline = new THREE.Vector3(-0.18, 0.12, z * 0.28);
    const uncorrectedEnd = new THREE.Vector3(uncorrectedFocusX, 0.12, z * -0.12);
    const correctedEnd = new THREE.Vector3(correctedFocusX, 0.12, z * -0.12);
    root.add(tube([start, correction, crystalline, uncorrectedEnd], 0.012, 0xfb7185, 0.42));
    root.add(tube([start.clone().add(new THREE.Vector3(0, 0.02, 0)), correction, crystalline, correctedEnd], 0.018, index === 1 ? 0xffffff : 0xfacc15, 0.92));
  });

  const photon = sphere(0.075, 0xfacc15);
  photon.userData.role = "path";
  photon.userData.path = [
    new THREE.Vector3(-3.25, 0.12, 0),
    new THREE.Vector3(mode > 0 ? -2.15 : -1.74, 0.12, 0),
    new THREE.Vector3(-0.18, 0.12, 0),
    new THREE.Vector3(correctedFocusX, 0.12, 0),
  ];
  root.add(photon);

  addMarker(root, new THREE.Vector3(uncorrectedFocusX, 0.12, -0.42), Math.abs(uncorrectedFocusX - retinaX) < 0.14 ? 0x34d399 : 0xfb7185);
  addMarker(root, new THREE.Vector3(correctedFocusX, 0.12, 0.42), Math.abs(correctedFocusX - retinaX) < 0.14 ? 0x34d399 : 0xfb7185);
  addArrow(root, new THREE.Vector3(-0.18, 1.06, 0), new THREE.Vector3(correctedFocusX, 0.34, 0), 0x22d3ee);
  root.add(label("cornea", new THREE.Vector3(-1.23, -0.72, 0), 0x67e8f9));
  root.add(label("eye lens", new THREE.Vector3(-0.54, 1.32, 0), 0xfacc15));
  root.add(label("retina screen", new THREE.Vector3(1.66, 1.42, 0), 0xfb7185));
  root.add(label(mode === 1 ? "myopia: before retina" : mode === 2 ? "hypermetropia: behind retina" : "normal: on retina", new THREE.Vector3(-2.55, -1.0, 0), mode === 0 ? 0x34d399 : 0xfacc15));
}

function buildPrism(root: THREE.Group, prismAngle: number, meanIndex: number, dispersion: number) {
  const model = makePrismModel(prismAngle, meanIndex, dispersion);
  const prism = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 1.2, 3), material(0xa78bfa, 0.32));
  prism.rotation.set(Math.PI / 2, 0, Math.PI / 6);
  root.add(prism);
  const screen = box(0.08, 1.9, 1.05, 0xe2e8f0, 0.42);
  screen.position.set(3.05, 0.08, 0);
  root.add(screen);
  root.add(line([new THREE.Vector3(-3.1, 0.55, 0), new THREE.Vector3(-0.55, 0.12, 0)], 0xffffff));
  root.add(line([new THREE.Vector3(-0.52, 0.12, 0), new THREE.Vector3(0.48, -0.02, 0)], 0xfde047));
  root.add(line([new THREE.Vector3(-0.55, 0.52, 0), new THREE.Vector3(-0.2, -0.32, 0)], 0x94a3b8, 0.65));
  root.add(line([new THREE.Vector3(0.25, 0.38, 0), new THREE.Vector3(0.75, -0.48, 0)], 0x94a3b8, 0.65));
  if (model.tirInside) {
    root.add(line([new THREE.Vector3(0.48, -0.02, 0), new THREE.Vector3(-0.25, -0.58, 0)], 0xfacc15));
    root.add(label("total internal reflection", new THREE.Vector3(0.65, 0.82, 0), 0xf43f5e));
  } else {
    model.rays.forEach((ray, index) => {
      const color = new THREE.Color(ray.color).getHex();
      const y = -0.54 + index * 0.18 + clamp(model.spreadDeg / 8, 0, 0.32);
      const z = (index - 3) * 0.06;
      root.add(line([new THREE.Vector3(0.48, -0.02, 0), new THREE.Vector3(2.95, y, z)], color));
      if (index === 0 || index === model.rays.length - 1) {
        root.add(label(ray.name.toLowerCase(), new THREE.Vector3(3.12, y, z), color));
      }
    });
  }
  model.rays.forEach((ray, index) => {
    const band = box(0.04, 0.1, 0.92, new THREE.Color(ray.color).getHex(), 0.82);
    band.position.set(3.12, -0.54 + index * 0.18 + clamp(model.spreadDeg / 8, 0, 0.32), 0);
    root.add(band);
  });
  root.add(label(`A ${model.prismAngleDeg.toFixed(0)} deg`, new THREE.Vector3(-0.15, -1.05, 0), 0xfacc15));
  root.add(label(`n ${model.meanIndex.toFixed(3)}`, new THREE.Vector3(-0.75, 0.95, 0), 0x67e8f9));
  root.add(label(`Dm ${model.minimumDeviationDeg.toFixed(1)} deg`, new THREE.Vector3(0.95, 0.92, 0), 0xfacc15));
  root.add(label(model.material.name.toLowerCase(), new THREE.Vector3(1.75, -1.02, 0), 0xe2e8f0));
}

function buildPlaneMirror3D(root: THREE.Group, incidenceInput: number, reflectionInput: number, distanceInput: number) {
  addPlatform(root);
  const incidence = THREE.MathUtils.degToRad(clamp(incidenceInput || reflectionInput || 35, 5, 78));
  const distance = clamp((distanceInput || 50) / 28, 0.8, 2.25);
  const mirror = box(0.08, 2.35, 1.65, 0x93c5fd, 0.36);
  mirror.position.set(0, -0.05, 0);
  root.add(mirror);
  const backing = box(0.05, 2.35, 1.65, 0x1e293b, 0.72);
  backing.position.set(0.06, -0.05, 0);
  root.add(backing);

  const object = sphere(0.18, 0xf43f5e, 0.95);
  object.position.set(-distance, -0.42, -0.26);
  root.add(object);
  addArrow(root, object.position.clone().add(new THREE.Vector3(0, -0.22, 0)), object.position.clone().add(new THREE.Vector3(0, 0.64, 0)), 0xf43f5e);

  const image = sphere(0.18, 0x34d399, 0.34);
  image.position.set(distance, -0.42, -0.26);
  root.add(image);
  root.add(line([
    image.position.clone().add(new THREE.Vector3(0, -0.52, 0)),
    image.position.clone().add(new THREE.Vector3(0, 0.72, 0)),
  ], 0x34d399, 0.38));

  const hit = new THREE.Vector3(0, -0.02, -0.08);
  const incidentStart = new THREE.Vector3(-2.85, -0.02 + Math.tan(incidence) * 0.92, -0.08);
  const reflectedEnd = new THREE.Vector3(-2.85, -0.02 - Math.tan(incidence) * 0.92, -0.08);
  root.add(tube([incidentStart, hit], 0.022, 0xfde047, 0.95));
  root.add(tube([hit, reflectedEnd], 0.022, 0x22d3ee, 0.95));
  const photon = sphere(0.075, 0xfacc15);
  photon.userData.role = "path";
  photon.userData.path = [incidentStart, hit, reflectedEnd];
  root.add(photon);

  root.add(line([new THREE.Vector3(-1.3, hit.y, -0.08), new THREE.Vector3(1.3, hit.y, -0.08)], 0x94a3b8, 0.72));
  root.add(tube([new THREE.Vector3(-distance, -0.96, -0.54), new THREE.Vector3(0, -0.96, -0.54)], 0.01, 0xf43f5e, 0.8));
  root.add(tube([new THREE.Vector3(0, -0.96, -0.54), new THREE.Vector3(distance, -0.96, -0.54)], 0.01, 0x34d399, 0.8));
  const arcLeft = angleArc3D(hit, 0.34, Math.PI - incidence, Math.PI, 0xfacc15);
  const arcRight = angleArc3D(hit, 0.43, Math.PI, Math.PI + incidence, 0x22d3ee);
  root.add(arcLeft, arcRight);

  root.add(label("mirror plane", new THREE.Vector3(-0.42, 1.42, 0.36), 0x93c5fd));
  root.add(label("object", object.position.clone().add(new THREE.Vector3(-0.38, 0.78, 0)), 0xf43f5e));
  root.add(label("virtual image", image.position.clone().add(new THREE.Vector3(-0.48, 0.78, 0)), 0x34d399));
  root.add(label("incident ray", new THREE.Vector3(-2.45, 1.0, 0.05), 0xfde047));
  root.add(label("reflected ray", new THREE.Vector3(-2.7, -0.98, 0.05), 0x22d3ee));
  root.add(label("normal", new THREE.Vector3(0.95, 0.22, 0.08), 0x94a3b8));
  root.add(label("equal distance", new THREE.Vector3(-0.58, -1.22, -0.48), 0xe2e8f0));
  root.add(label("ideal plane mirror", new THREE.Vector3(1.42, 1.28, 0.2), 0xfacc15));
}

function buildGlassSlab3D(root: THREE.Group, incidenceInput: number, indexInput: number, thicknessInput: number) {
  addPlatform(root);
  const incidence = THREE.MathUtils.degToRad(clamp(incidenceInput || 45, 5, 76));
  const refractiveIndex = clamp(indexInput || 1.5, 1.01, 2.4);
  const refraction = Math.asin(clamp(Math.sin(incidence) / refractiveIndex, -1, 1));
  const thickness = clamp((thicknessInput || 4) / 8, 0.48, 1.15);
  const lateralShift = thickness * Math.sin(incidence - refraction) / Math.max(0.18, Math.cos(refraction));
  const slab = box(thickness, 2.25, 1.45, 0x67e8f9, 0.24);
  slab.position.set(0, -0.05, 0);
  root.add(slab);
  root.add(label("glass slab", new THREE.Vector3(-0.55, 1.48, 0.35), 0x67e8f9));

  const x1 = -thickness / 2;
  const x2 = thickness / 2;
  const p1 = new THREE.Vector3(x1, 0.46, 0);
  const p2 = new THREE.Vector3(x2, 0.46 - Math.tan(refraction) * thickness, 0);
  const start = new THREE.Vector3(-3.0, p1.y + Math.tan(incidence) * (p1.x + 3.0), 0);
  const end = new THREE.Vector3(3.05, p2.y - Math.tan(incidence) * (3.05 - p2.x), 0);
  const unshiftedEnd = new THREE.Vector3(3.05, start.y - Math.tan(incidence) * 6.05, -0.12);

  root.add(tube([start, p1], 0.024, 0xfde047, 0.95));
  root.add(tube([p1, p2], 0.026, 0x22d3ee, 0.92));
  root.add(tube([p2, end], 0.024, 0xfde047, 0.95));
  root.add(line([start.clone().setZ(-0.12), unshiftedEnd], 0xf43f5e, 0.55));
  const photon = sphere(0.075, 0xfacc15);
  photon.userData.role = "path";
  photon.userData.path = [start, p1, p2, end];
  root.add(photon);

  [x1, x2].forEach((x, index) => {
    root.add(line([new THREE.Vector3(x, -1.14, 0.04), new THREE.Vector3(x, 1.22, 0.04)], 0x94a3b8, 0.7));
    root.add(label(index === 0 ? "normal 1" : "normal 2", new THREE.Vector3(x - 0.42, -1.34, 0.08), 0x94a3b8));
  });
  root.add(tube([new THREE.Vector3(2.18, end.y, 0.1), new THREE.Vector3(2.18, unshiftedEnd.y, 0.1)], 0.012, 0xf43f5e, 0.86));
  addMarker(root, p1, 0xfacc15);
  addMarker(root, p2, 0x22d3ee);
  root.add(label("incident ray", new THREE.Vector3(-2.55, 1.26, 0.12), 0xfde047));
  root.add(label("refracted ray", new THREE.Vector3(-0.55, 0.38, 0.16), 0x22d3ee));
  root.add(label("parallel emergent ray", new THREE.Vector3(1.2, -0.92, 0.12), 0xfde047));
  root.add(label(`n ${refractiveIndex.toFixed(2)}`, new THREE.Vector3(-0.22, -1.28, 0.28), 0x67e8f9));
  root.add(label(`thickness ${thickness.toFixed(2)}`, new THREE.Vector3(0.72, 1.32, 0.2), 0xe2e8f0));
  root.add(label(`lateral shift ${Math.abs(lateralShift).toFixed(2)}`, new THREE.Vector3(2.0, 0.82, 0.18), 0xf43f5e));
  root.add(label("plane parallel slab", new THREE.Vector3(-2.72, -1.15, 0.22), 0xfacc15));
  root.add(label("no absorption/scattering", new THREE.Vector3(1.45, 1.38, 0.22), 0xfacc15));
}

function buildShadowEclipse3D(root: THREE.Group, sourceSizeInput: number, distanceInput: number, modeInput: number) {
  addPlatform(root);
  const sourceRadius = clamp((sourceSizeInput || 8) / 18, 0.36, 0.82);
  const gap = clamp((distanceInput || 45) / 30, 1.15, 2.3);
  const mode = Math.abs(Math.round(modeInput || 0)) % 3;
  const source = sphere(sourceRadius, 0xfacc15, 0.95);
  source.position.set(-2.75, 0.1, 0);
  source.userData.role = "pulse";
  source.userData.power = 1.2;
  root.add(source);

  const occluderColor = mode === 2 ? 0x38bdf8 : 0x94a3b8;
  const screenColor = mode === 1 ? 0x38bdf8 : mode === 2 ? 0x94a3b8 : 0xe2e8f0;
  const occluder = sphere(mode === 2 ? 0.42 : 0.34, occluderColor, 0.96);
  occluder.position.set(-0.55, 0.02, 0);
  root.add(occluder);
  const receiver = sphere(mode === 0 ? 0.5 : 0.38, screenColor, 0.7);
  receiver.scale.set(mode === 0 ? 0.18 : 1, 1, 1);
  receiver.position.set(gap, 0, 0);
  root.add(receiver);

  const penumbra = new THREE.Mesh(new THREE.ConeGeometry(1.15, gap + 1.0, 48, 1, true), material(0xfacc15, 0.13));
  penumbra.rotation.z = -Math.PI / 2;
  penumbra.position.set((gap - 0.55) / 2, 0, 0);
  root.add(penumbra);
  const umbra = new THREE.Mesh(new THREE.ConeGeometry(0.46, gap + 0.45, 48, 1, true), material(0x020617, 0.44));
  umbra.rotation.z = -Math.PI / 2;
  umbra.position.set((gap - 0.35) / 2, 0, 0);
  root.add(umbra);

  [-0.4, 0.4].forEach((z) => {
    root.add(line([new THREE.Vector3(-2.75, sourceRadius, z), new THREE.Vector3(gap, 0.72, z * 0.35)], 0xfde047, 0.42));
    root.add(line([new THREE.Vector3(-2.75, -sourceRadius, z), new THREE.Vector3(gap, -0.72, z * 0.35)], 0xfde047, 0.42));
    root.add(line([new THREE.Vector3(-0.55, 0.34, z * 0.2), new THREE.Vector3(gap, 0.22, z * 0.2)], 0x64748b, 0.74));
    root.add(line([new THREE.Vector3(-0.55, -0.34, z * 0.2), new THREE.Vector3(gap, -0.22, z * 0.2)], 0x64748b, 0.74));
  });
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(gap + 0.55, 0.006, 8, 120), material(0x334155, 0.58));
  orbit.rotation.x = Math.PI / 2;
  orbit.position.set(-0.45, -0.02, 0);
  root.add(orbit);

  const modeLabel = mode === 1 ? "solar eclipse geometry" : mode === 2 ? "lunar eclipse geometry" : "simple shadow geometry";
  root.add(label("Sun/source", new THREE.Vector3(-3.25, 1.26, 0), 0xfacc15));
  root.add(label(mode === 2 ? "Earth occluder" : "occluder", new THREE.Vector3(-1.18, 1.12, 0), occluderColor));
  root.add(label(mode === 1 ? "Earth screen" : mode === 2 ? "Moon screen" : "screen", new THREE.Vector3(gap - 0.48, 1.12, 0), screenColor));
  root.add(label("umbra", new THREE.Vector3(0.45, -0.52, 0.12), 0xe2e8f0));
  root.add(label("penumbra", new THREE.Vector3(0.5, 0.88, 0.15), 0xfacc15));
  root.add(label(modeLabel, new THREE.Vector3(-2.55, -1.16, 0.2), 0x67e8f9));
  root.add(label("not to scale", new THREE.Vector3(1.55, -1.16, 0.2), 0xfacc15));
}

function buildMultipleReflection3D(root: THREE.Group, angleInput: number, imageInput: number, _unused = 0) {
  addPlatform(root);
  const angle = clamp(angleInput || 60, 20, 120);
  const half = THREE.MathUtils.degToRad(angle / 2);
  const imageCountRaw = 360 / angle;
  const exact = Math.abs(imageCountRaw - Math.round(imageCountRaw)) < 0.02;
  const imageCount = exact ? Math.max(0, Math.round(imageCountRaw) - 1) : Math.floor(imageCountRaw);
  const panelLength = 2.7;
  [-1, 1].forEach((side) => {
    const mirror = box(0.06, 1.45, panelLength, 0x93c5fd, 0.34);
    mirror.position.set(Math.cos(half) * 0.78, -0.12, side * Math.sin(half) * 0.78);
    mirror.rotation.y = side * half;
    root.add(mirror);
  });

  const object = sphere(0.18, 0xf43f5e, 0.95);
  object.position.set(0.55, -0.55, 0);
  root.add(object);
  root.add(label("object", new THREE.Vector3(0.18, 0.2, 0), 0xf43f5e));
  const visibleImages = Math.min(imageCount, 10);
  for (let index = 0; index < visibleImages; index += 1) {
    const theta = -half + ((index + 1) / (visibleImages + 1)) * half * 2;
    const radius = 0.95 + index * 0.18;
    const ghost = sphere(0.13, 0x34d399, 0.22 + (index % 3) * 0.1);
    ghost.position.set(Math.cos(theta) * radius, -0.52, Math.sin(theta) * radius);
    root.add(ghost);
  }

  const rayPath = [
    new THREE.Vector3(0.55, -0.28, 0),
    new THREE.Vector3(1.35, -0.16, Math.sin(half) * 1.0),
    new THREE.Vector3(1.86, -0.16, -Math.sin(half) * 1.1),
    new THREE.Vector3(2.32, -0.16, Math.sin(half) * 0.75),
  ];
  root.add(tube(rayPath, 0.018, 0xfde047, 0.92));
  const photon = sphere(0.06, 0xfacc15);
  photon.userData.role = "path";
  photon.userData.path = rayPath;
  root.add(photon);
  root.add(angleArcHorizontal(0.72, -half, half, 0xfacc15));

  const previewBase = box(1.25, 0.08, 1.25, 0x0f172a, 0.72);
  previewBase.position.set(-2.15, -0.78, 0);
  root.add(previewBase);
  for (let index = 0; index < 12; index += 1) {
    const theta = (index / 12) * Math.PI * 2;
    const shard = box(0.08, 0.04, 0.34, [0x22d3ee, 0xf43f5e, 0xfacc15, 0x34d399][index % 4], 0.76);
    shard.position.set(-2.15 + Math.cos(theta) * 0.38, -0.68, Math.sin(theta) * 0.38);
    shard.rotation.y = theta;
    root.add(shard);
  }
  root.add(label(`mirror angle ${angle.toFixed(0)} deg`, new THREE.Vector3(0.58, 0.62, 0.58), 0xfacc15));
  root.add(label(`image count ${imageCount}`, new THREE.Vector3(1.65, 1.12, 0), 0x34d399));
  root.add(label(exact ? "n = 360/theta - 1" : "floor rule condition", new THREE.Vector3(-0.52, -1.22, 0.2), 0xe2e8f0));
  root.add(label("ideal mirrors", new THREE.Vector3(-2.78, 0.62, 0.2), 0x93c5fd));
  root.add(label("kaleidoscope preview", new THREE.Vector3(-2.92, -1.18, 0.18), 0x67e8f9));
  root.add(label(`input cue ${imageInput.toFixed(1)}`, new THREE.Vector3(1.45, -1.16, 0.18), 0x94a3b8));
}

function buildOpticalInstrument3D(root: THREE.Group, objectiveFInput: number, eyepieceFInput: number, modeInput: number) {
  addPlatform(root);
  const mode = modeInput < 0.5 ? "telescope" : "microscope";
  const objectiveF = clamp(objectiveFInput || 40, 5, 120);
  const eyepieceF = clamp(eyepieceFInput || 10, 2, 60);
  const magnification = mode === "telescope" ? objectiveF / Math.max(1, eyepieceF) : (objectiveF * 25) / Math.max(1, eyepieceF * 10);
  const tubeBody = cylinder(0.42, 0.42, 4.7, 0x334155, 0.26);
  tubeBody.rotation.z = Math.PI / 2;
  tubeBody.position.set(0.28, -0.16, 0);
  root.add(tubeBody);
  const objectiveX = -1.75;
  const eyepieceX = 2.05;
  const objective = sphere(0.52, 0x67e8f9, 0.34);
  objective.scale.set(0.24, 1.55, 1.15);
  objective.position.set(objectiveX, -0.16, 0);
  root.add(objective);
  const eyepiece = sphere(0.42, 0xa78bfa, 0.34);
  eyepiece.scale.set(0.22, 1.18, 0.92);
  eyepiece.position.set(eyepieceX, -0.16, 0);
  root.add(eyepiece);

  const objectX = mode === "microscope" ? -2.95 : -3.25;
  if (mode === "microscope") {
    addArrow(root, new THREE.Vector3(objectX, -0.8, 0), new THREE.Vector3(objectX, 0.22, 0), 0xf43f5e);
    root.add(label("near object", new THREE.Vector3(objectX - 0.38, 0.58, 0), 0xf43f5e));
  } else {
    [-0.35, 0, 0.35].forEach((y) => {
      root.add(line([new THREE.Vector3(-3.35, y, 0), new THREE.Vector3(objectiveX, y * 0.5 - 0.12, 0)], 0xfde047, 0.7));
    });
    root.add(label("distant parallel rays", new THREE.Vector3(-3.2, 0.92, 0), 0xfde047));
  }

  const intermediateX = mode === "microscope" ? 0.75 : 0.35;
  const finalX = 3.05;
  const rayStarts = mode === "microscope"
    ? [new THREE.Vector3(objectX, 0.22, -0.16), new THREE.Vector3(objectX, 0.22, 0.16)]
    : [new THREE.Vector3(-3.35, 0.35, -0.14), new THREE.Vector3(-3.35, -0.35, 0.14)];
  rayStarts.forEach((start, index) => {
    const objPoint = mode === "microscope" ? start : new THREE.Vector3(objectiveX, index === 0 ? 0.05 : -0.05, start.z);
    root.add(tube([
      start,
      objPoint,
      new THREE.Vector3(intermediateX, index === 0 ? -0.46 : 0.46, start.z * -0.6),
      new THREE.Vector3(eyepieceX, index === 0 ? -0.22 : 0.22, start.z * -0.3),
      new THREE.Vector3(finalX, index === 0 ? -0.64 : 0.64, start.z),
    ], 0.016, index === 0 ? 0xfde047 : 0x22d3ee, 0.9));
  });

  const intermediate = box(0.04, 0.78, 0.22, 0x34d399, 0.74);
  intermediate.position.set(intermediateX, -0.16, 0);
  root.add(intermediate);
  const focalMarks = [
    { x: objectiveX - objectiveF / 60, color: 0x67e8f9, text: "Fo" },
    { x: objectiveX + objectiveF / 60, color: 0x67e8f9, text: "Fo" },
    { x: eyepieceX - eyepieceF / 35, color: 0xa78bfa, text: "Fe" },
    { x: eyepieceX + eyepieceF / 35, color: 0xa78bfa, text: "Fe" },
  ];
  focalMarks.forEach((mark) => {
    addMarker(root, new THREE.Vector3(clamp(mark.x, -3.1, 3.1), -0.84, 0), mark.color);
    root.add(label(mark.text, new THREE.Vector3(clamp(mark.x, -3.1, 3.1) - 0.2, -0.48, 0.12), mark.color));
  });
  root.add(label("objective", new THREE.Vector3(objectiveX - 0.48, 1.22, 0), 0x67e8f9));
  root.add(label("eyepiece", new THREE.Vector3(eyepieceX - 0.42, 1.12, 0), 0xa78bfa));
  root.add(label("intermediate image", new THREE.Vector3(intermediateX - 0.55, 0.62, 0), 0x34d399));
  root.add(label("final virtual image direction", new THREE.Vector3(1.62, -1.18, 0.2), 0xfde047));
  root.add(label(`${mode} M ${magnification.toFixed(1)}x`, new THREE.Vector3(-2.92, -1.18, 0.2), 0xfacc15));
  root.add(label("thin lens/paraxial rays", new THREE.Vector3(-0.82, 1.42, 0.2), 0xe2e8f0));
}

function angleArc3D(center: THREE.Vector3, radius: number, start: number, end: number, color: number) {
  return line(Array.from({ length: 28 }, (_, index) => {
    const u = index / 27;
    const theta = start + (end - start) * u;
    return new THREE.Vector3(center.x + Math.cos(theta) * radius, center.y + Math.sin(theta) * radius, center.z + 0.04);
  }), color, 0.86);
}

function angleArcHorizontal(radius: number, start: number, end: number, color: number) {
  return line(Array.from({ length: 36 }, (_, index) => {
    const u = index / 35;
    const theta = start + (end - start) * u;
    return new THREE.Vector3(Math.cos(theta) * radius, -0.98, Math.sin(theta) * radius);
  }), color, 0.88);
}

function buildWaveLab3D(root: THREE.Group, frequencyInput: number, amplitudeInput: number, mediumInput: number) {
  addPlatform(root);
  const frequency = clamp(frequencyInput || 2, 0.5, 12);
  const amplitude = clamp((amplitudeInput || 1) / 3, 0.18, 0.9);
  const wavelength = clamp(5.2 / frequency, 0.65, 2.6);
  const points = Array.from({ length: 96 }, (_, index) => {
    const x = -3.25 + (index / 95) * 6.5;
    const phase = (x / wavelength) * Math.PI * 2;
    return new THREE.Vector3(x, -0.35 + Math.sin(phase) * amplitude, 0);
  });
  root.add(tube(points, 0.035, 0x22d3ee, 0.95));
  points.filter((_, index) => index % 8 === 0).forEach((point, index) => {
    const bead = sphere(0.08, index % 2 ? 0xfacc15 : 0x67e8f9, 0.88);
    bead.position.copy(point);
    bead.userData.role = "particle";
    bead.userData.seed = index * 0.6;
    bead.userData.speed = clamp(frequency / 2, 0.4, 3);
    root.add(bead);
  });
  root.add(line([new THREE.Vector3(-3.25, -0.35, -0.18), new THREE.Vector3(3.25, -0.35, -0.18)], 0x64748b, 0.72));
  root.add(tube([new THREE.Vector3(-2.7, -0.35, 0.22), new THREE.Vector3(-2.7, -0.35 + amplitude, 0.22)], 0.014, 0xf43f5e, 0.9));
  root.add(tube([new THREE.Vector3(-1.15, -1.02, 0.15), new THREE.Vector3(-1.15 + wavelength, -1.02, 0.15)], 0.014, 0x34d399, 0.9));
  addArrow(root, new THREE.Vector3(2.0, 0.88, 0), new THREE.Vector3(3.0, 0.88, 0), 0xfacc15);
  const tracer = sphere(0.08, 0xfacc15);
  tracer.userData.role = "path";
  tracer.userData.path = points;
  root.add(tracer);
  root.add(label("amplitude", new THREE.Vector3(-3.05, 0.55, 0.2), 0xf43f5e));
  root.add(label("wavelength", new THREE.Vector3(-1.1, -1.24, 0.22), 0x34d399));
  root.add(label(`f ${frequency.toFixed(1)} Hz`, new THREE.Vector3(0.92, 1.2, 0.15), 0x67e8f9));
  root.add(label(`v=f lambda ${(frequency * wavelength).toFixed(1)}`, new THREE.Vector3(1.75, -1.22, 0.2), 0xfacc15));
  root.add(label("medium particles oscillate locally", new THREE.Vector3(-2.88, 1.2, 0.15), 0xe2e8f0));
  root.add(label(mediumInput > 0 ? "uniform medium" : "linear wave model", new THREE.Vector3(-0.62, -1.48, 0.2), 0x94a3b8));
}

function buildChladni3D(root: THREE.Group, modeInput: number, frequencyInput: number, _unused = 0) {
  addPlatform(root);
  const mode = Math.max(1, Math.round(clamp(modeInput || frequencyInput || 3, 1, 7)));
  const plate = box(3.2, 0.08, 3.2, 0x1e293b, 0.94);
  plate.position.set(0, -0.45, 0);
  plate.userData.role = "pulse";
  plate.userData.power = 0.45;
  root.add(plate);
  for (let index = 1; index <= mode; index += 1) {
    const x = -1.6 + (index * 3.2) / (mode + 1);
    root.add(tube([new THREE.Vector3(x, -0.34, -1.48), new THREE.Vector3(x, -0.34, 1.48)], 0.012, 0x22d3ee, 0.8));
  }
  for (let index = 1; index <= Math.max(1, Math.floor(mode / 2)); index += 1) {
    const z = -1.6 + (index * 3.2) / (Math.floor(mode / 2) + 1);
    root.add(tube([new THREE.Vector3(-1.48, -0.33, z), new THREE.Vector3(1.48, -0.33, z)], 0.012, 0x67e8f9, 0.8));
  }
  for (let index = 0; index < 95; index += 1) {
    const band = index % 4;
    const spread = (((index * 17) % 100) / 100 - 0.5) * 0.16;
    const along = -1.38 + (((index * 29) % 276) / 100);
    const grain = sphere(index % 6 === 0 ? 0.035 : 0.024, 0xfacc15, 0.92);
    if (band < 2) {
      const x = -1.6 + ((band + 1) * 3.2) / (mode + 2) + spread;
      grain.position.set(x, -0.26, along);
    } else {
      const z = -0.8 + (band - 2) * 1.15 + spread;
      grain.position.set(along, -0.26, z);
    }
    root.add(grain);
  }
  root.add(label(`mode ${mode}`, new THREE.Vector3(-1.58, 1.1, 0), 0x67e8f9));
  root.add(label("node lines", new THREE.Vector3(-0.55, 0.86, 1.55), 0x22d3ee));
  root.add(label("sand accumulation", new THREE.Vector3(0.8, 0.92, -1.4), 0xfacc15));
  root.add(label("antinode regions vibrate", new THREE.Vector3(-2.8, -1.18, 0.2), 0xf43f5e));
  root.add(label("illustrative nodal pattern", new THREE.Vector3(0.8, -1.18, 0.2), 0xe2e8f0));
}

function buildEcho3D(root: THREE.Group, timeInput: number, speedInput: number, distanceInput: number) {
  addPlatform(root);
  const echoTime = clamp(timeInput || 2, 0.25, 8);
  const speed = clamp(speedInput || 343, 250, 420);
  const distance = speed * echoTime / 2;
  const source = sphere(0.22, 0xfacc15, 0.95);
  source.position.set(-2.75, -0.38, 0);
  source.userData.role = "pulse";
  root.add(source);
  const wall = box(0.16, 2.2, 2.5, 0x64748b, 0.82);
  wall.position.set(2.55, -0.14, 0);
  root.add(wall);
  const outgoing = [new THREE.Vector3(-2.55, -0.25, -0.1), new THREE.Vector3(-0.3, 0.25, 0), new THREE.Vector3(2.45, -0.25, 0.1)];
  const returning = [new THREE.Vector3(2.45, -0.52, -0.15), new THREE.Vector3(-0.2, -0.88, 0), new THREE.Vector3(-2.55, -0.52, 0.15)];
  root.add(tube(outgoing, 0.026, 0x22d3ee, 0.92));
  root.add(tube(returning, 0.026, 0xfacc15, 0.92));
  for (let index = 0; index < 5; index += 1) {
    const wave = ring(0.28 + index * 0.23, 0x22d3ee);
    wave.position.set(-2.55 + index * 0.88, -0.25, 0);
    wave.rotation.y = Math.PI / 2;
    wave.userData.role = "wave";
    wave.userData.speed = 0.4 + index * 0.1;
    wave.userData.phase = index * 0.2;
    root.add(wave);
  }
  const pulse = sphere(0.07, 0x67e8f9);
  pulse.userData.role = "path";
  pulse.userData.path = [...outgoing, ...returning.slice(1)];
  root.add(pulse);
  root.add(label("outgoing pulse", new THREE.Vector3(-1.8, 0.88, 0), 0x22d3ee));
  root.add(label("reflected pulse", new THREE.Vector3(-1.55, -1.22, 0.2), 0xfacc15));
  root.add(label("reflecting wall", new THREE.Vector3(1.7, 1.18, 0), 0xe2e8f0));
  root.add(label(`echo time ${echoTime.toFixed(2)} s`, new THREE.Vector3(-2.95, 1.28, 0), 0x67e8f9));
  root.add(label(`distance ${(distanceInput || distance).toFixed(0)} m = v t / 2`, new THREE.Vector3(0.2, -1.28, 0.2), 0x34d399));
  root.add(label("round-trip echo distance", new THREE.Vector3(0.72, 1.28, 0), 0xfacc15));
}

function buildSoundPitch3D(root: THREE.Group, frequencyInput: number, amplitudeInput: number, distanceInput: number) {
  addPlatform(root);
  const frequency = clamp(frequencyInput || 440, 80, 1200);
  const amplitude = clamp(amplitudeInput || 1, 0.2, 10);
  const wavelength = clamp(343 / frequency, 0.22, 3.2);
  const forkA = cylinder(0.045, 0.045, 1.35, 0x67e8f9, 0.92);
  forkA.position.set(-2.45, 0.12, -0.18);
  forkA.userData.role = "pulse";
  forkA.userData.power = clamp(amplitude / 5, 0.2, 1.6);
  const forkB = forkA.clone();
  forkB.position.z = 0.18;
  root.add(forkA, forkB);
  const handle = cylinder(0.06, 0.06, 1.0, 0x94a3b8, 0.9);
  handle.position.set(-2.45, -0.82, 0);
  root.add(handle);
  for (let index = 0; index < 7; index += 1) {
    const ringWave = ring(0.35 + index * clamp(wavelength, 0.24, 0.68), 0x22d3ee);
    ringWave.position.set(-2.05 + index * 0.25, -0.32, 0);
    ringWave.rotation.y = Math.PI / 2;
    ringWave.scale.y = clamp(amplitude / 2.5, 0.45, 1.8);
    ringWave.userData.role = "wave";
    ringWave.userData.speed = clamp(frequency / 440, 0.35, 2.7);
    ringWave.userData.phase = index * 0.18;
    root.add(ringWave);
  }
  const waveform = sineWave(2.8, 1.5, clamp(amplitude / 18, 0.04, 0.25), 0xfacc15);
  waveform.position.set(1.2, -0.3, 0);
  root.add(waveform);
  root.add(label(`pitch = frequency ${frequency.toFixed(0)} Hz`, new THREE.Vector3(-2.95, 1.3, 0), 0x67e8f9));
  root.add(label(`loudness cue = amplitude ${amplitude.toFixed(1)}`, new THREE.Vector3(-0.7, 1.05, 0), 0xfacc15));
  root.add(label(`wavelength ${wavelength.toFixed(2)} m`, new THREE.Vector3(1.1, -1.24, 0.2), 0x34d399));
  root.add(label("simplified hearing model", new THREE.Vector3(-2.6, -1.22, 0.2), 0xe2e8f0));
  root.add(label(`distance ${distanceInput.toFixed(1)}`, new THREE.Vector3(1.6, 1.2, 0.2), 0x94a3b8));
}

function buildSpringShm3D(root: THREE.Group, springInput: number, massInput: number, amplitudeInput: number) {
  addPlatform(root);
  const k = clamp(springInput || 20, 1, 100);
  const massValue = clamp(massInput || 1, 0.1, 10);
  const amplitude = clamp((amplitudeInput || 1) / 3, 0.32, 1.25);
  const omega = Math.sqrt(k / massValue);
  const wall = box(0.18, 1.35, 1.0, 0x64748b, 0.92);
  wall.position.set(-2.8, -0.35, 0);
  root.add(wall);
  const spring = helix(2.4, 0.18, 14, 0x67e8f9);
  spring.position.set(-1.45, -0.34, 0);
  spring.scale.x = 1 + amplitude * 0.12;
  spring.userData.role = "wave-shift";
  spring.userData.speed = clamp(omega / 5, 0.25, 2.6);
  root.add(spring);
  const mass = box(0.62, 0.58, 0.58, 0xfacc15, 0.94);
  mass.position.set(1.0 + amplitude * 0.42, -0.34, 0);
  mass.userData.role = "cart";
  root.add(mass);
  addMarker(root, new THREE.Vector3(0.85, -0.98, 0), 0x34d399);
  root.add(tube([new THREE.Vector3(0.85 - amplitude, -1.08, 0.2), new THREE.Vector3(0.85 + amplitude, -1.08, 0.2)], 0.014, 0xf43f5e, 0.9));
  addArrow(root, new THREE.Vector3(1.75, -0.28, 0.35), new THREE.Vector3(0.95, -0.28, 0.35), 0xf43f5e);
  addArrow(root, new THREE.Vector3(0.6, 0.2, 0.35), new THREE.Vector3(1.25, 0.2, 0.35), 0x22d3ee);
  const keBar = box(0.18, 0.78, 0.14, 0x22d3ee, 0.8);
  keBar.position.set(2.42, -0.72, -0.5);
  const peBar = box(0.18, 1.08, 0.14, 0xfacc15, 0.8);
  peBar.position.set(2.72, -0.57, -0.5);
  root.add(keBar, peBar);
  root.add(label("equilibrium", new THREE.Vector3(0.35, -1.42, 0.2), 0x34d399));
  root.add(label("amplitude endpoints", new THREE.Vector3(-0.42, 1.12, 0), 0xf43f5e));
  root.add(label("restoring force F=-kx", new THREE.Vector3(0.82, 0.78, 0.25), 0xf43f5e));
  root.add(label("velocity", new THREE.Vector3(0.35, 0.48, 0.25), 0x22d3ee));
  root.add(label(`omega ${omega.toFixed(2)} rad/s`, new THREE.Vector3(-2.72, 1.18, 0), 0x67e8f9));
  root.add(label("ideal spring / no damping", new THREE.Vector3(1.55, -1.26, 0.25), 0xe2e8f0));
}

function buildSpectrum3D(root: THREE.Group, frequencyInput: number, _unused: number, markerInput: number) {
  addPlatform(root);
  const bands = [
    ["radio", 0x38bdf8],
    ["microwave", 0x22d3ee],
    ["infrared", 0xfb923c],
    ["visible", 0x34d399],
    ["ultraviolet", 0xa78bfa],
    ["X-ray", 0xe2e8f0],
    ["gamma", 0xf43f5e],
  ] as const;
  bands.forEach(([name, color], index) => {
    const width = 0.82;
    const block = box(width, 0.52 + index * 0.05, 0.12, color, 0.72);
    block.position.set(-3 + index, -0.45, 0);
    root.add(block);
    root.add(label(name, new THREE.Vector3(-3.35 + index, 0.35 + index * 0.04, 0.12), color));
    const sample = sineWave(0.68, -0.05, clamp(0.16 - index * 0.015, 0.04, 0.16), color);
    sample.position.set(-3 + index, -0.15, 0.35);
    sample.scale.x = clamp(1.6 - index * 0.16, 0.45, 1.6);
    root.add(sample);
  });
  const markerIndex = clamp((Math.log10(Math.max(0.001, frequencyInput || markerInput || 1)) + 3) / 6 * 6, 0, 6);
  addArrow(root, new THREE.Vector3(-3 + markerIndex, 1.3, 0), new THREE.Vector3(-3 + markerIndex, 0.78, 0), 0xfacc15);
  root.add(tube([new THREE.Vector3(-3.28, -1.12, 0), new THREE.Vector3(3.28, -1.12, 0)], 0.015, 0x94a3b8, 0.8));
  addArrow(root, new THREE.Vector3(-2.65, -1.36, 0), new THREE.Vector3(2.85, -1.36, 0), 0x67e8f9);
  addArrow(root, new THREE.Vector3(2.85, -1.55, 0), new THREE.Vector3(-2.65, -1.55, 0), 0xfacc15);
  root.add(label("frequency increases", new THREE.Vector3(0.75, -1.28, 0.2), 0x67e8f9));
  root.add(label("wavelength decreases", new THREE.Vector3(-1.28, -1.58, 0.2), 0xfacc15));
  root.add(label("visible band", new THREE.Vector3(-0.38, 1.22, 0), 0x34d399));
  root.add(label("c = f lambda", new THREE.Vector3(1.55, 1.22, 0), 0xe2e8f0));
  root.add(label("qualitative boundaries / not to scale", new THREE.Vector3(-2.85, 1.22, 0), 0x94a3b8));
}

function buildPolarization3D(root: THREE.Group, intensityInput: number, angleInput: number, scaleInput: number) {
  addPlatform(root);
  const theta = THREE.MathUtils.degToRad(clamp(angleInput || 0, 0, 180));
  const i0 = clamp(intensityInput || 100, 0, 100);
  const transmitted = i0 * Math.cos(theta) ** 2 * clamp(scaleInput || 1, 0.1, 1.5);
  root.add(tube([new THREE.Vector3(-3.15, -0.05, 0), new THREE.Vector3(-1.4, -0.05, 0)], 0.025, 0xfde047, 0.92));
  const polarizer = box(0.08, 1.65, 1.35, 0x67e8f9, 0.24);
  polarizer.position.set(-1.18, -0.05, 0);
  root.add(polarizer);
  const analyzer = box(0.08, 1.65, 1.35, 0xa78bfa, 0.24);
  analyzer.position.set(0.85, -0.05, 0);
  analyzer.rotation.x = theta;
  root.add(analyzer);
  root.add(tube([new THREE.Vector3(-1.12, -0.72, 0), new THREE.Vector3(-1.12, 0.72, 0)], 0.012, 0x67e8f9, 0.9));
  root.add(tube([new THREE.Vector3(0.88, -0.72 * Math.cos(theta), -0.72 * Math.sin(theta)), new THREE.Vector3(0.88, 0.72 * Math.cos(theta), 0.72 * Math.sin(theta))], 0.012, 0xa78bfa, 0.9));
  for (let index = 0; index < 6; index += 1) {
    const field = sineWave(0.7, 0.78 - index * 0.08, 0.12, index < 3 ? 0xfde047 : 0x34d399);
    field.position.set(-2.65 + index * 0.72, -0.72, 0.28);
    field.rotation.z = index < 3 ? 0 : theta;
    field.scale.y = index < 3 ? 1 : clamp(transmitted / 100, 0.12, 1.2);
    root.add(field);
  }
  const meter = box(0.42, clamp(transmitted / 70, 0.08, 1.25), 0.18, 0x34d399, 0.86);
  meter.position.set(2.55, -1.08 + meter.geometry.parameters.height / 2, 0);
  root.add(meter);
  root.add(angleArc3D(new THREE.Vector3(0.1, -0.05, 0.28), 0.45, 0, theta, 0xfacc15));
  root.add(label("polarizer", new THREE.Vector3(-1.72, 1.2, 0), 0x67e8f9));
  root.add(label("analyzer", new THREE.Vector3(0.45, 1.2, 0), 0xa78bfa));
  root.add(label("transmission axis", new THREE.Vector3(-0.95, -1.22, 0.2), 0xe2e8f0));
  root.add(label(`theta ${THREE.MathUtils.radToDeg(theta).toFixed(0)} deg`, new THREE.Vector3(0.1, 0.58, 0.45), 0xfacc15));
  root.add(label(`I = I0 cos^2 theta = ${transmitted.toFixed(1)}`, new THREE.Vector3(1.25, -1.22, 0.25), 0x34d399));
  root.add(label("ideal polarizers / Malus law", new THREE.Vector3(-2.85, -1.22, 0.25), 0x94a3b8));
}

function buildInterference(root: THREE.Group, frequency: number, amplitude: number, _unused = 0) {
  [-0.7, 0.7].forEach((x) => {
    const source = sphere(0.13, 0x22d3ee);
    source.position.set(-1.8, x, 0);
    source.userData.role = "pulse";
    root.add(source);
    for (let index = 0; index < 5; index += 1) {
      const wave = ring(0.35 + index * 0.36, 0x22d3ee);
      wave.position.set(-1.8, x, 0);
      wave.userData.role = "wave";
      wave.userData.phase = index * 0.4;
      wave.userData.speed = clamp(frequency / 300, 0.3, 3);
      root.add(wave);
    }
  });
  for (let index = 0; index < 9; index += 1) {
    const fringe = box(0.08, 0.16 + Math.abs(Math.sin(index)) * clamp(amplitude, 0.2, 1.8), 1.25, index % 2 ? 0x334155 : 0xfacc15, index % 2 ? 0.35 : 0.78);
    fringe.position.set(2.45, -1.4 + index * 0.35, 0);
    root.add(fringe);
  }
}

function buildMeasurement3D(root: THREE.Group, readingInput: number, leastCountInput: number, trueValueInput: number) {
  addPlatform(root);
  const reading = clamp(readingInput || 5.26, 0, 10);
  const leastCount = clamp(leastCountInput || 0.01, 0.001, 0.5);
  const trueValue = clamp(trueValueInput || reading * 0.98, 0, 10);
  const error = Math.abs(reading - trueValue);
  const ruler = box(4.8, 0.08, 0.48, 0x94a3b8, 0.72);
  ruler.position.set(0, -0.8, 0);
  root.add(ruler);
  for (let index = 0; index <= 10; index += 1) {
    const tick = box(0.02, index % 5 === 0 ? 0.32 : 0.18, 0.05, 0xe2e8f0, 0.88);
    tick.position.set(-2.4 + index * 0.48, -0.64, 0.28);
    root.add(tick);
  }
  const objectLength = clamp(reading / 10 * 4.3, 0.5, 4.3);
  const object = box(objectLength, 0.28, 0.36, 0x67e8f9, 0.82);
  object.position.set(-2.15 + objectLength / 2, -0.48, -0.05);
  root.add(object);
  const pointerX = -2.4 + (reading / 10) * 4.8;
  addArrow(root, new THREE.Vector3(pointerX, 0.4, 0.2), new THREE.Vector3(pointerX, -0.42, 0.2), 0xfacc15);
  [-2, -1, 0, 1, 2].forEach((offset, index) => {
    const markerX = pointerX + offset * leastCount * 12;
    addMarker(root, new THREE.Vector3(markerX, -0.34, 0.58), index === 2 ? 0xfacc15 : 0x22d3ee);
  });
  const trueX = -2.4 + (trueValue / 10) * 4.8;
  root.add(tube([new THREE.Vector3(trueX, -1.08, 0.5), new THREE.Vector3(pointerX, -1.08, 0.5)], 0.012, 0xf43f5e, 0.9));
  root.add(label(`reading ${reading.toFixed(3)}`, new THREE.Vector3(pointerX - 0.5, 0.72, 0.25), 0xfacc15));
  root.add(label(`least count ${leastCount.toFixed(3)}`, new THREE.Vector3(-2.75, 0.95, 0), 0x67e8f9));
  root.add(label(`error ${error.toFixed(3)}`, new THREE.Vector3(0.55, -1.28, 0.45), 0xf43f5e));
  root.add(label("mean marker / repeated readings", new THREE.Vector3(-1.25, 1.25, 0.15), 0x22d3ee));
  root.add(label("illustrative measurement model", new THREE.Vector3(1.25, 1.25, 0.15), 0xe2e8f0));
  root.add(label("zero error ignored", new THREE.Vector3(1.7, -1.28, 0.25), 0x94a3b8));
}

function buildNuclearDecay3D(root: THREE.Group, initialInput: number, halfLifeInput: number, timeInput: number) {
  addPlatform(root);
  const initial = clamp(initialInput || 120, 40, 180);
  const halfLife = clamp(halfLifeInput || 5, 0.5, 20);
  const elapsed = clamp(timeInput || 5, 0, 60);
  const remainingFraction = clamp(0.5 ** (elapsed / halfLife), 0.02, 1);
  const count = 64;
  for (let index = 0; index < count; index += 1) {
    const alive = index / count < remainingFraction;
    const nucleus = sphere(0.07, alive ? 0x22d3ee : 0xf43f5e, alive ? 0.9 : 0.58);
    nucleus.position.set(-1.55 + (index % 8) * 0.42, -0.68 + Math.floor(index / 8) * 0.22, -0.82 + (index % 4) * 0.28);
    if (!alive && index % 5 === 0) nucleus.userData.role = "pulse";
    root.add(nucleus);
  }
  const curve = Array.from({ length: 50 }, (_, index) => {
    const u = index / 49;
    return new THREE.Vector3(0.65 + u * 2.2, -0.92 + 1.25 * 0.5 ** (u * 4), 0.4);
  });
  root.add(tube(curve, 0.012, 0xfacc15, 0.92));
  const ringTimer = ring(0.74, 0xfacc15);
  ringTimer.position.set(-2.1, 0.6, 0);
  ringTimer.userData.role = "field";
  ringTimer.userData.power = 0.8;
  root.add(ringTimer);
  root.add(label(`remaining ${Math.round(initial * remainingFraction)}`, new THREE.Vector3(-2.85, 1.32, 0), 0x22d3ee));
  root.add(label(`decayed ${Math.round(initial * (1 - remainingFraction))}`, new THREE.Vector3(-0.9, 1.32, 0), 0xf43f5e));
  root.add(label(`T1/2 ${halfLife.toFixed(1)}`, new THREE.Vector3(-2.55, -1.24, 0.25), 0xfacc15));
  root.add(label("random decay model", new THREE.Vector3(0.75, 1.32, 0), 0xe2e8f0));
  root.add(label("statistical, not individual prediction", new THREE.Vector3(0.7, -1.24, 0.25), 0x94a3b8));
}

function buildDiode3D(root: THREE.Group, voltageInput: number, thresholdInput: number, _mode: number) {
  addPlatform(root);
  const voltage = clamp(voltageInput || 0.7, -5, 5);
  const threshold = clamp(thresholdInput || 0.7, 0.2, 1.2);
  const conducts = voltage > threshold;
  const pSide = box(1.25, 1.2, 1.2, 0xf472b6, 0.55);
  pSide.position.set(-0.85, -0.2, 0);
  const nSide = box(1.25, 1.2, 1.2, 0x38bdf8, 0.55);
  nSide.position.set(0.85, -0.2, 0);
  const depletion = box(0.32, 1.28, 1.28, 0xfacc15, conducts ? 0.24 : 0.62);
  depletion.position.set(0, -0.2, 0);
  root.add(pSide, nSide, depletion);
  for (let index = 0; index < 18; index += 1) {
    const carrier = sphere(0.045, index % 2 ? 0x22d3ee : 0xfacc15, 0.86);
    carrier.position.set(-1.35 + (index % 9) * 0.34, -0.62 + Math.floor(index / 9) * 0.62, ((index * 17) % 80) / 100 - 0.4);
    if (conducts) {
      carrier.userData.role = "path";
      carrier.userData.path = [carrier.position.clone(), carrier.position.clone().add(new THREE.Vector3(2.4, 0, 0))];
      carrier.userData.offset = index / 18;
    }
    root.add(carrier);
  }
  addArrow(root, new THREE.Vector3(-2.3, 0.95, 0), new THREE.Vector3(2.3, 0.95, 0), conducts ? 0x34d399 : 0x64748b);
  const wavePanel = box(1.55, 0.7, 0.08, 0x0f172a, 0.72);
  wavePanel.position.set(2.35, -0.58, 0.72);
  root.add(wavePanel);
  root.add(sineWave(1.25, 0.38, conducts ? 0.12 : 0.04, conducts ? 0x34d399 : 0x64748b));
  root.add(label("P-side", new THREE.Vector3(-1.55, 0.85, 0), 0xf472b6));
  root.add(label("N-side", new THREE.Vector3(0.55, 0.85, 0), 0x38bdf8));
  root.add(label("depletion region", new THREE.Vector3(-0.72, -1.22, 0.2), 0xfacc15));
  root.add(label(conducts ? "forward bias current" : "reverse/blocking bias", new THREE.Vector3(0.78, 1.32, 0), conducts ? 0x34d399 : 0xf43f5e));
  root.add(label("simplified PN junction", new THREE.Vector3(0.92, -1.22, 0.2), 0xe2e8f0));
}

function buildEnergySources3D(root: THREE.Group, selectedInput: number, outputInput: number, emissionInput: number) {
  addPlatform(root);
  const selected = Math.abs(Math.round(selectedInput || 0)) % 5;
  const sources = [
    { name: "solar", color: 0xfacc15, output: 0.65, emissions: 0.1 },
    { name: "wind", color: 0x67e8f9, output: 0.58, emissions: 0.08 },
    { name: "hydro", color: 0x38bdf8, output: 0.8, emissions: 0.12 },
    { name: "fossil", color: 0xf97316, output: 0.95, emissions: 0.88 },
    { name: "nuclear", color: 0xa78bfa, output: 0.98, emissions: 0.18 },
  ];
  sources.forEach((source, index) => {
    const x = -2.6 + index * 1.3;
    const base = box(0.82, 0.08, 0.82, selected === index ? 0xfacc15 : 0x334155, selected === index ? 0.82 : 0.55);
    base.position.set(x, -0.95, 0);
    root.add(base);
    const icon = index === 1 ? cylinder(0.05, 0.05, 0.8, source.color, 0.9) : index === 0 ? box(0.65, 0.08, 0.42, source.color, 0.86) : index === 2 ? box(0.72, 0.38, 0.24, source.color, 0.7) : cylinder(0.25, 0.33, 0.55, source.color, 0.72);
    icon.position.set(x, -0.55, 0);
    if (index === 1) icon.rotation.z = Math.PI / 2;
    root.add(icon);
    const output = box(0.16, clamp(source.output + outputInput / 200, 0.18, 1.25), 0.16, 0x34d399, 0.86);
    output.position.set(x - 0.25, -0.95 + output.geometry.parameters.height / 2, 0.48);
    const emissions = box(0.16, clamp(source.emissions + emissionInput / 200, 0.08, 1.25), 0.16, 0xf43f5e, 0.72);
    emissions.position.set(x + 0.25, -0.95 + emissions.geometry.parameters.height / 2, 0.48);
    root.add(output, emissions);
    root.add(label(source.name, new THREE.Vector3(x - 0.45, 0.28, 0), source.color));
  });
  root.add(label("output bars", new THREE.Vector3(-2.95, 1.2, 0), 0x34d399));
  root.add(label("emissions/limits", new THREE.Vector3(-0.85, 1.2, 0), 0xf43f5e));
  root.add(label("illustrative comparison data", new THREE.Vector3(1.1, 1.2, 0), 0xe2e8f0));
}

function buildQuantumOperators3D(root: THREE.Group, stateInput: number, operatorInput: number, measurementInput: number) {
  addPlatform(root);
  const stateAngle = THREE.MathUtils.degToRad(clamp(stateInput || 45, 0, 100) * 1.4 + 15);
  const operatorAngle = THREE.MathUtils.degToRad(clamp(operatorInput || 50, 0, 100) * 1.2 + 10);
  const sphereFrame = sphere(1.05, 0x67e8f9, 0.08);
  sphereFrame.position.set(-1.2, -0.1, 0);
  root.add(sphereFrame);
  addArrow(root, new THREE.Vector3(-1.2, -0.1, 0), new THREE.Vector3(-1.2 + Math.cos(stateAngle), -0.1 + Math.sin(stateAngle), 0.25), 0x22d3ee);
  addArrow(root, new THREE.Vector3(-1.2, -0.1, 0), new THREE.Vector3(-1.2 + Math.cos(operatorAngle) * 1.1, -0.1 + Math.sin(operatorAngle) * 1.1, -0.1), 0xfacc15);
  const projection = Math.cos(stateAngle - operatorAngle) ** 2;
  const pBar = box(0.22, clamp(projection, 0.08, 1.1), 0.18, 0x34d399, 0.86);
  pBar.position.set(1.55, -0.95 + pBar.geometry.parameters.height / 2, 0);
  const qBar = box(0.22, clamp(1 - projection, 0.08, 1.1), 0.18, 0xa78bfa, 0.86);
  qBar.position.set(1.95, -0.95 + qBar.geometry.parameters.height / 2, 0);
  root.add(pBar, qBar);
  const matrix = box(1.0, 0.9, 0.08, 0x0f172a, 0.72);
  matrix.position.set(1.75, 0.55, 0);
  root.add(matrix);
  root.add(label("state vector |psi>", new THREE.Vector3(-2.75, 1.22, 0), 0x22d3ee));
  root.add(label("operator A", new THREE.Vector3(-1.0, 1.22, 0), 0xfacc15));
  root.add(label(`eigenvalue cue ${measurementInput.toFixed(1)}`, new THREE.Vector3(0.8, 1.22, 0), 0xe2e8f0));
  root.add(label(`expectation ${(projection * 100).toFixed(0)}%`, new THREE.Vector3(1.1, -1.22, 0.2), 0x34d399));
  root.add(label("qualitative quantum visualization", new THREE.Vector3(-2.8, -1.22, 0.2), 0x94a3b8));
}

function buildComputationalWorkflow3D(root: THREE.Group, stepInput: number, iterationInput: number, errorInput: number) {
  addPlatform(root);
  const iterations = Math.round(clamp(iterationInput || 12, 3, 40));
  const error = clamp(errorInput || Math.exp(-iterations / 8) * clamp(stepInput || 0.1, 0.01, 1), 0.001, 1);
  const names = ["problem", "mesh", "solver", "converge", "result"];
  names.forEach((name, index) => {
    const node = box(0.75, 0.42, 0.55, index < 2 ? 0x22d3ee : index < 4 ? 0xfacc15 : 0x34d399, 0.72);
    node.position.set(-2.6 + index * 1.3, -0.42, 0);
    root.add(node);
    if (index < names.length - 1) addArrow(root, new THREE.Vector3(-2.18 + index * 1.3, -0.42, 0), new THREE.Vector3(-1.72 + index * 1.3, -0.42, 0), 0x94a3b8);
    root.add(label(name, new THREE.Vector3(-2.95 + index * 1.3, 0.08, 0.1), 0xe2e8f0));
  });
  for (let index = 0; index < 6; index += 1) {
    root.add(line([new THREE.Vector3(-2.2 + index * 0.16, -0.92, -0.55), new THREE.Vector3(-2.2 + index * 0.16, -0.92, 0.55)], 0x334155, 0.72));
    root.add(line([new THREE.Vector3(-2.25, -0.92, -0.5 + index * 0.2), new THREE.Vector3(-1.35, -0.92, -0.5 + index * 0.2)], 0x334155, 0.72));
  }
  const curve = Array.from({ length: 45 }, (_, index) => new THREE.Vector3(0.25 + index * 0.055, -1.02 + 0.9 * Math.exp(-index / 10), 0.55));
  root.add(tube(curve, 0.012, 0x34d399, 0.92));
  root.add(label(`iterations ${iterations}`, new THREE.Vector3(-0.25, 1.15, 0), 0xfacc15));
  root.add(label(`error ${error.toFixed(4)}`, new THREE.Vector3(1.1, 1.15, 0), 0x34d399));
  root.add(label("discretization mesh", new THREE.Vector3(-2.78, -1.22, 0.25), 0x67e8f9));
  root.add(label("numerical method demonstration", new THREE.Vector3(0.55, -1.22, 0.25), 0xe2e8f0));
}

function buildPhotoelectric(root: THREE.Group, photonEnergy: number, workFunction: number, _unused = 0) {
  const plate = box(0.45, 1.7, 1.2, 0x64748b);
  plate.position.x = -0.65;
  root.add(plate);
  for (let index = 0; index < 5; index += 1) {
    const photon = sphere(0.07, 0xfacc15);
    photon.userData.role = "photon";
    photon.userData.offset = index / 5;
    root.add(photon);
  }
  if (photonEnergy > workFunction) {
    for (let index = 0; index < 4; index += 1) {
      const electron = sphere(0.06, 0x22d3ee);
      electron.userData.role = "electron";
      electron.userData.offset = index / 4;
      root.add(electron);
    }
  }
}

function buildBohr(root: THREE.Group, n1: number, n2: number, _unused = 0) {
  const initial = clamp(Math.round(n1), 1, 5);
  const final = clamp(Math.round(n2), 1, 5);
  const nucleus = sphere(0.2, 0xf43f5e);
  nucleus.userData.role = "pulse";
  root.add(nucleus);
  [1, 2, 3, 4, 5].forEach((level) => {
    const shell = ring(0.42 + level * 0.28, level === final ? 0x22d3ee : level === initial ? 0xfacc15 : 0x475569);
    shell.userData.role = level === final ? "field" : "";
    shell.userData.power = 1.4;
    shell.userData.phase = level * 0.2;
    root.add(shell);
  });
  const electron = sphere(0.08, 0x22d3ee);
  electron.userData.role = "orbit";
  electron.userData.radius = 0.42 + initial * 0.28;
  electron.userData.finalRadius = 0.42 + final * 0.28;
  electron.userData.speed = 1.7 + final * 0.18;
  root.add(electron);
  const transition = tube([
    new THREE.Vector3(0.42 + initial * 0.28, -0.72, 0),
    new THREE.Vector3(0.2, 0.6, 0.3),
    new THREE.Vector3(0.42 + final * 0.28, -0.72, 0),
  ], 0.012, final < initial ? 0xfacc15 : 0x38bdf8, 0.8);
  transition.userData.role = "field";
  transition.userData.power = 1.2;
  root.add(transition);
  const photonColor = final < initial ? 0xfacc15 : 0x38bdf8;
  const photon = tube([new THREE.Vector3(-2.65, 1.35, 0), new THREE.Vector3(-1.55, 1.05, 0.15), new THREE.Vector3(-0.65, 1.22, -0.1)], 0.018, photonColor, 0.95);
  photon.userData.role = "wave-shift";
  photon.userData.speed = 0.9;
  root.add(photon);
  for (let index = 1; index <= 5; index += 1) {
    const height = 1.35 / (index * index);
    const bar = box(0.55, 0.035, 0.035, index === final ? 0x22d3ee : index === initial ? 0xfacc15 : 0x64748b, 0.85);
    bar.position.set(2.05, -0.95 + height * 1.9, 0);
    root.add(bar);
    root.add(label(`n=${index}`, new THREE.Vector3(2.45, -0.95 + height * 1.9, 0), index === final ? 0x22d3ee : 0x94a3b8));
  }
  root.add(label(final < initial ? "emission" : final > initial ? "absorption" : "no jump", new THREE.Vector3(-2.52, 1.72, 0), photonColor));
  root.add(label("fixed shells", new THREE.Vector3(-0.6, 1.65, 0), 0x22d3ee));
  root.add(label("energy ladder", new THREE.Vector3(1.82, 1.45, 0), 0xfacc15));
}

function buildCoupledOscillator(root: THREE.Group, angle1: number, angle2: number, coupling: number) {
  const theta1 = THREE.MathUtils.degToRad(clamp(angle1, 5, 92));
  const theta2 = THREE.MathUtils.degToRad(clamp(angle2 + coupling * 38, 5, 112));
  const couplingStrength = clamp(coupling, 0, 1);
  const l1 = 1.28;
  const l2 = 1.08;
  const pivot = new THREE.Vector3(-1.5, 1.18, 0);
  const joint = new THREE.Vector3(pivot.x + Math.sin(theta1) * l1, pivot.y - Math.cos(theta1) * l1, 0);
  const bob = new THREE.Vector3(joint.x + Math.sin(theta2) * l2, joint.y - Math.cos(theta2) * l2, 0.18);

  const support = box(2.45, 0.08, 0.1, 0x64748b, 0.9);
  support.position.set(pivot.x, pivot.y + 0.12, 0);
  root.add(support);
  const stand = box(0.1, 2.45, 0.1, 0x475569, 0.86);
  stand.position.set(pivot.x - 1.15, -0.05, 0);
  root.add(stand);

  const arm1 = cylinderBetween(pivot, joint, 0.035, 0x67e8f9);
  arm1.userData.role = "coupled-arm";
  arm1.userData.pivot = pivot;
  arm1.userData.length = l1;
  arm1.userData.phase = 0;
  arm1.userData.color = 0x67e8f9;
  root.add(arm1);
  const arm2 = cylinderBetween(joint, bob, 0.03, 0xfacc15);
  arm2.userData.role = "coupled-arm";
  arm2.userData.parentArm = arm1;
  arm2.userData.length = l2;
  arm2.userData.phase = 1.7;
  arm2.userData.color = 0xfacc15;
  root.add(arm2);

  const jointBall = sphere(0.16, 0x22d3ee);
  jointBall.position.copy(joint);
  jointBall.userData.role = "coupled-joint";
  jointBall.userData.pivot = pivot;
  jointBall.userData.length = l1;
  root.add(jointBall);
  const bobBall = sphere(0.2, 0xf43f5e);
  bobBall.position.copy(bob);
  bobBall.userData.role = "coupled-bob";
  bobBall.userData.pivot = pivot;
  bobBall.userData.length1 = l1;
  bobBall.userData.length2 = l2;
  root.add(bobBall);

  const pathPoints = Array.from({ length: 160 }, (_, index) => {
    const t = index / 16;
    const spread = 0.7 + couplingStrength * 1.65 + Math.max(0, angle1 + angle2 - 90) * 0.018;
    return new THREE.Vector3(
      1.45 + Math.sin(t * 1.61 + Math.sin(t * 0.37) * 1.8) * spread,
      -0.15 + Math.cos(t * 1.27 + Math.sin(t * 0.51)) * spread * 0.48,
      -0.25 + Math.sin(t * 0.83) * 0.72
    );
  });
  const trail = tube(pathPoints, 0.012, 0xf43f5e, 0.74);
  trail.userData.role = "field";
  trail.userData.phase = 0.4;
  trail.userData.power = 0.55 + couplingStrength;
  root.add(trail);
  const regularLoop = tube(Array.from({ length: 96 }, (_, index) => {
    const t = (index / 95) * Math.PI * 2;
    return new THREE.Vector3(1.45 + Math.cos(t) * 0.72, -0.15 + Math.sin(t) * 0.38, -0.95);
  }), 0.01, 0x22d3ee, 0.55);
  root.add(regularLoop);
  const tracer = sphere(0.075, 0xfacc15, 0.92);
  tracer.userData.role = "path";
  tracer.userData.path = pathPoints;
  root.add(tracer);

  const phasePlate = box(2.9, 0.035, 1.7, 0x0f172a, 0.46);
  phasePlate.position.set(1.45, -1.02, -0.34);
  root.add(phasePlate);
  root.add(line([new THREE.Vector3(0, -1, -0.34), new THREE.Vector3(2.9, -1, -0.34)], 0x475569, 0.85));
  root.add(line([new THREE.Vector3(1.45, -1.85, -0.34), new THREE.Vector3(1.45, -0.2, -0.34)], 0x475569, 0.85));
  root.add(label("double pendulum", new THREE.Vector3(-2.65, 1.55, 0), 0x67e8f9));
  root.add(label("phase trail", new THREE.Vector3(1.95, 1.2, -0.2), 0xf43f5e));
  root.add(label(couplingStrength > 0.58 ? "sensitive divergence" : "regular beating", new THREE.Vector3(0.55, -1.75, -0.3), couplingStrength > 0.58 ? 0xf43f5e : 0x22d3ee));

  const energyA = box(0.18, clamp(0.35 + angle1 / 80, 0.35, 1.35), 0.18, 0x22d3ee, 0.82);
  energyA.position.set(-3.25, -0.65 + energyA.scale.y * 0.08, 0.2);
  root.add(energyA);
  const energyB = box(0.18, clamp(0.35 + angle2 / 80, 0.35, 1.35), 0.18, 0xf43f5e, 0.82);
  energyB.position.set(-2.95, -0.65 + energyB.scale.y * 0.08, 0.2);
  root.add(energyB);
  root.add(label("energy swap", new THREE.Vector3(-3.55, 0.45, 0.2), 0xfacc15));
}

function buildLogic(root: THREE.Group, inputA: number, inputB: number, gateIndex: number) {
  const gate = box(1.1, 0.9, 0.5, 0x22d3ee, 0.28);
  root.add(gate);
  const active = inputA >= 0.5 && (inputB >= 0.5 || gateIndex > 0);
  [-0.45, 0.45].forEach((y, index) => {
    root.add(line([new THREE.Vector3(-2.8, y, 0), new THREE.Vector3(-0.6, y, 0)], index === 0 ? (inputA >= 0.5 ? 0x34d399 : 0x475569) : (inputB >= 0.5 ? 0x34d399 : 0x475569)));
  });
  root.add(line([new THREE.Vector3(0.6, 0, 0), new THREE.Vector3(2.5, 0, 0)], active ? 0x34d399 : 0x475569));
  const led = sphere(0.24, active ? 0x34d399 : 0x475569);
  led.position.x = 2.75;
  led.userData.role = "bulb";
  led.userData.power = active ? 1.8 : 0.1;
  root.add(led);
}

function updateObjects(root: THREE.Group, t: number, values: [number, number, number]) {
  root.traverse((object) => {
    if (object.userData.role === "path") {
      const path = object.userData.path as THREE.Vector3[];
      const offset = typeof object.userData.offset === "number" ? object.userData.offset : 0;
      object.position.copy(samplePath(path, (offset + t * 0.22) % 1));
    }
    if (object.userData.role === "cart") object.position.x = -0.8 + Math.sin(t * 1.6) * 0.12;
    if (object.userData.role === "force-balance") object.position.x = Math.sin(t * 1.45) * 0.11 * object.userData.power * object.userData.direction;
    if (object.userData.role === "wheel") object.rotation.x = t * 5;
    if (object.userData.role === "slide") {
      const phase = (Math.sin(t * object.userData.speed) + 1) / 2;
      object.position.x = -1.45 + phase * 2.4;
      object.position.y = 0.55 - phase * 0.95;
    }
    if (object.userData.role === "incline-block") {
      const start = object.userData.slideStart as number;
      const end = object.userData.slideEnd as number;
      const rampCenter = object.userData.rampCenter as THREE.Vector3;
      const tangent = object.userData.tangent as THREE.Vector3;
      const normal = object.userData.normal as THREE.Vector3;
      const clearance = object.userData.clearance as number;
      const speed = object.userData.speed as number;
      const moving = Boolean(object.userData.moving);
      const cycle = moving ? (t * speed) % 1 : 0.12 + Math.sin(t * 1.4) * 0.015;
      const progress = moving ? cycle * cycle : cycle;
      const alongRamp = start + (end - start) * progress;
      object.position.copy(pointOnIncline(rampCenter, tangent, normal, alongRamp, clearance));
    }
    if (object.userData.role === "pendulum") {
      const damping = 1 - object.userData.damping;
      object.rotation.z = Math.sin(t * 1.8) * 0.55 * damping;
      object.rotation.y = Math.sin(t * 0.9) * 0.14;
    }
    if (object.userData.role === "coupled-joint") {
      const [angle1, angle2, coupling] = values;
      const amp1 = THREE.MathUtils.degToRad(clamp(angle1, 5, 92));
      const chaos = clamp(coupling, 0, 1);
      const theta = Math.sin(t * (1.05 + chaos * 0.55)) * amp1 + Math.sin(t * 2.1) * chaos * 0.22;
      const pivot = object.userData.pivot as THREE.Vector3;
      const length = object.userData.length as number;
      object.position.set(pivot.x + Math.sin(theta) * length, pivot.y - Math.cos(theta) * length, Math.sin(t * 0.7) * 0.12);
    }
    if (object.userData.role === "coupled-bob") {
      const [angle1, angle2, coupling] = values;
      const chaos = clamp(coupling, 0, 1);
      const amp1 = THREE.MathUtils.degToRad(clamp(angle1, 5, 92));
      const amp2 = THREE.MathUtils.degToRad(clamp(angle2, 5, 112));
      const theta1 = Math.sin(t * (1.05 + chaos * 0.55)) * amp1 + Math.sin(t * 2.1) * chaos * 0.22;
      const theta2 = Math.sin(t * (1.75 + chaos * 0.9) + Math.sin(t * 0.41) * chaos * 2.1) * amp2;
      const pivot = object.userData.pivot as THREE.Vector3;
      const l1 = object.userData.length1 as number;
      const l2 = object.userData.length2 as number;
      const joint = new THREE.Vector3(pivot.x + Math.sin(theta1) * l1, pivot.y - Math.cos(theta1) * l1, Math.sin(t * 0.7) * 0.12);
      object.position.set(joint.x + Math.sin(theta2) * l2, joint.y - Math.cos(theta2) * l2, joint.z + Math.cos(t * 0.63) * 0.24);
    }
    if (object.userData.role === "orbit") {
      const baseRadius = object.userData.radius;
      const finalRadius = object.userData.finalRadius ?? baseRadius;
      const jump = object.userData.finalRadius ? (Math.sin(t * 1.1) + 1) / 2 : 0;
      const radius = baseRadius + (finalRadius - baseRadius) * jump;
      const phase = t * object.userData.speed;
      object.position.set(Math.cos(phase) * radius, -0.55 + Math.sin(phase * 0.5) * 0.14, Math.sin(phase) * radius);
    }
    if (object.userData.role === "float") object.position.y += Math.sin(t * 2.1) * 0.003;
    if (object.userData.role === "water") object.scale.y = 1 + Math.sin(t * 1.6) * 0.025;
    if (object.userData.role === "particle") {
      const seed = object.userData.seed;
      const speed = object.userData.speed;
      object.position.x += Math.sin(t * speed + seed) * 0.006;
      object.position.y += Math.cos(t * speed * 1.2 + seed) * 0.006;
      object.position.z += Math.sin(t * speed * 0.8 + seed * 2) * 0.006;
    }
    if (object.userData.role === "charge") object.position.copy(samplePath(object.userData.path, (object.userData.offset + t * 0.08 * object.userData.speed) % 1));
    if (object.userData.role === "bulb") {
      const mesh = object as THREE.Mesh;
      mesh.scale.setScalar(1 + Math.sin(t * 3) * 0.05);
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = object.userData.power;
    }
    if (object.userData.role === "field") object.scale.setScalar(1 + Math.sin(t * 2.5 + object.userData.phase) * 0.08 * object.userData.power);
    if (object.userData.role === "magnet") object.position.x = -1.8 + ((Math.sin(t * 1.5) + 1) / 2) * 3.6;
    if (object.userData.role === "needle") object.rotation.z = Math.sin(t * 2.1) * object.userData.power;
    if (object.userData.role === "spin") object.rotation.y = t * object.userData.speed;
    if (object.userData.role === "wave-shift") object.position.x = Math.sin(t * object.userData.speed) * 0.12;
    if (object.userData.role === "wave") object.scale.setScalar(0.82 + ((t * object.userData.speed + object.userData.phase) % 1) * 0.45);
    if (object.userData.role === "pulse") object.scale.setScalar(1 + Math.sin(t * 4) * 0.12);
    if (object.userData.role === "scan-ring") {
      object.rotation.z = t * object.userData.speed;
      object.scale.setScalar(0.92 + Math.sin(t * 1.25) * 0.06);
    }
    if (object.userData.role === "halo-ring") {
      object.rotation.z = -t * object.userData.speed;
      object.scale.setScalar(1 + Math.sin(t * 0.8) * 0.035);
    }
    if (object.userData.role === "ambient-spark") {
      const seed = object.userData.seed;
      object.position.y += Math.sin(t * object.userData.speed + seed) * 0.004;
      object.position.x += Math.cos(t * object.userData.speed * 0.7 + seed) * 0.003;
      const mesh = object as THREE.Mesh;
      mesh.scale.setScalar(0.8 + Math.sin(t * 2.2 + seed) * 0.22);
    }
    if (object.userData.role === "beacon") {
      const mesh = object as THREE.Mesh;
      mesh.scale.setScalar(1 + Math.sin(t * 3.4) * 0.25 * object.userData.power);
    }
    if (object.userData.role === "photon") object.position.set(-3 + ((object.userData.offset + t * 0.45) % 1) * 2.15, 0.62 - object.userData.offset * 0.32, 0);
    if (object.userData.role === "electron") object.position.set(-0.35 + ((object.userData.offset + t * 0.32) % 1) * 2.65, -0.6 + object.userData.offset * 0.38, 0.25);
  });
  root.position.y = Math.sin(t * 0.7) * 0.035;
  const hasInclineBlock = root.userData.hasInclineBlock === true;
  if (!hasInclineBlock && values[2] > 50) root.rotation.z = Math.sin(t * 0.2) * 0.02;
}

function addPlatform(root: THREE.Group) {
  const platform = box(4.7, 0.12, 1.45, 0x334155);
  platform.position.y = -1.08;
  root.add(platform);
}

function addArrow(root: THREE.Group, from: THREE.Vector3, to: THREE.Vector3, color: number) {
  root.add(cylinderBetween(from, to, 0.035, color));
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.32, 18), material(color));
  cone.position.copy(to);
  cone.quaternion.copy(directionQuaternion(from, to));
  root.add(cone);
}

function addMarker(root: THREE.Group, position: THREE.Vector3, color: number) {
  const marker = sphere(0.1, color, 0.9);
  marker.position.copy(position);
  marker.userData.role = "pulse";
  root.add(marker);
  const halo = ring(0.22, color);
  halo.position.copy(position);
  halo.rotation.x = Math.PI / 2;
  halo.userData.role = "field";
  halo.userData.power = 1.2;
  root.add(halo);
}

function pointOnIncline(center: THREE.Vector3, tangent: THREE.Vector3, normal: THREE.Vector3, alongRamp: number, normalOffset: number) {
  return center.clone().addScaledVector(tangent, alongRamp).addScaledVector(normal, normalOffset);
}

function box(width: number, height: number, depth: number, color: number, opacity = 1) {
  return new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material(color, opacity));
}

function sphere(radius: number, color: number, opacity = 1) {
  return new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 18), material(color, opacity));
}

function cylinder(radiusTop: number, radiusBottom: number, height: number, color: number, opacity = 1) {
  return new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 28), material(color, opacity));
}

function material(color: number, opacity = 1) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: opacity < 1 ? 0.08 : 0.025,
    metalness: 0.18,
    roughness: 0.38,
    opacity,
    transparent: opacity < 1,
  });
}

function line(points: THREE.Vector3[], color: number, opacity = 0.92) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const materialLine = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  return new THREE.Line(geometry, materialLine);
}

function tube(points: THREE.Vector3[], radius: number, color: number, opacity = 1) {
  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, Math.max(12, points.length * 2), radius, 10, false);
  return new THREE.Mesh(geometry, material(color, opacity));
}

function ring(radius: number, color: number) {
  const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2);
  const points = curve.getPoints(96).map((point) => new THREE.Vector3(point.x, point.y - 0.72, point.y === point.y ? 0 : 0));
  return line(points, color);
}

function roundedFluxLoop(width: number, height: number, color: number) {
  const points = Array.from({ length: 96 }, (_, index) => {
    const angle = (index / 95) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(angle) * width, Math.sin(angle) * height - 0.05, Math.sin(angle * 2) * 0.08);
  });
  return tube(points, 0.01, color, 0.32);
}

function label(text: string, position: THREE.Vector3, color = 0x67e8f9) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 144;
  const context = canvas.getContext("2d");
  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(15, 23, 42, 0.94)";
    roundRect(context, 10, 24, 620, 88, 16);
    context.fill();
    context.strokeStyle = "rgba(203, 213, 225, 0.62)";
    context.lineWidth = 2;
    context.stroke();
    context.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
    roundRect(context, 28, 42, 10, 52, 5);
    context.fill();
    context.fillStyle = "#f8fafc";
    context.font = "800 30px Inter, Arial, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, 330, 68, 540);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false }));
  sprite.position.copy(position);
  sprite.scale.set(1.55, 0.35, 1);
  return sprite;
}

function roundRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function helix(length: number, radius: number, turns: number, color: number) {
  const points = Array.from({ length: turns * 32 }, (_, index) => {
    const u = index / (turns * 32 - 1);
    const angle = u * turns * Math.PI * 2;
    return new THREE.Vector3(-length + u * length * 2, Math.cos(angle) * radius, Math.sin(angle) * radius);
  });
  return line(points, color);
}

function sineWave(width: number, y: number, amp: number, color: number) {
  return line(Array.from({ length: 80 }, (_, index) => {
    const u = index / 79;
    return new THREE.Vector3(-width / 2 + width * u, -1.25 + y + Math.sin(u * Math.PI * 4) * amp, -1.3);
  }), color);
}

function rectanglePath(width: number, height: number) {
  return [
    new THREE.Vector3(-width / 2, -height / 2, 0),
    new THREE.Vector3(width / 2, -height / 2, 0),
    new THREE.Vector3(width / 2, height / 2, 0),
    new THREE.Vector3(-width / 2, height / 2, 0),
    new THREE.Vector3(-width / 2, -height / 2, 0),
  ];
}

function cylinderBetween(from: THREE.Vector3, to: THREE.Vector3, radius: number, color: number) {
  const length = from.distanceTo(to);
  const mesh = cylinder(radius, radius, length, color);
  mesh.position.copy(from).add(to).multiplyScalar(0.5);
  mesh.quaternion.copy(directionQuaternion(from, to));
  return mesh;
}

function directionQuaternion(from: THREE.Vector3, to: THREE.Vector3) {
  const direction = new THREE.Vector3().subVectors(to, from).normalize();
  return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
}

function samplePath(path: THREE.Vector3[], progress: number) {
  const scaled = progress * (path.length - 1);
  const index = Math.floor(scaled);
  const next = Math.min(index + 1, path.length - 1);
  return new THREE.Vector3().lerpVectors(path[index], path[next], scaled - index);
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}
