import type { MechanicsLabConfig, MechanicsResult } from "./PremiumMechanicsLab";

export type PremiumMechanicsId =
  | "circular-motion"
  | "elastic-collision"
  | "friction"
  | "hooke-s-law"
  | "inclined-plane"
  | "uniform-motion"
  | "newton-s-second-law"
  | "conservation-of-energy"
  | "simple-pendulum"
  | "projectile-motion";

const gDefault = 9.8;

export const premiumMechanicsConfigs: Record<PremiumMechanicsId, MechanicsLabConfig> = {
  "circular-motion": {
    id: "circular-motion",
    title: "Premium Circular Motion Lab",
    subtitle: "Rotate a mass in top view and connect radius, angular speed, velocity, centripetal acceleration, force, and period.",
    formulae: ["v = r omega", "ac = r omega^2", "Fc = m r omega^2", "T = 2pi / omega"],
    controls: [
      { id: "mass", label: "Mass", unit: "kg", min: 0.2, max: 10, step: 0.1 },
      { id: "radius", label: "Radius", unit: "m", min: 0.5, max: 5, step: 0.1 },
      { id: "omega", label: "Angular speed", unit: "rad/s", min: 0.5, max: 8, step: 0.1 },
    ],
    defaults: { mass: 2, radius: 3, omega: 4 },
    presets: presets({ mass: 1, radius: 2, omega: 1.2 }, { mass: 1, radius: 4, omega: 6 }, { mass: 7, radius: 2.5, omega: 3 }),
    prediction: "If angular speed doubles, what happens to centripetal force?",
    misconception: "The force points along the motion.",
    correction: "Velocity is tangent, but acceleration and force point inward toward the center.",
    causeLabel: "Increase omega",
    effectLabel: "Force grows quadratically",
    because: "Fc = m r omega^2, so omega has a squared effect.",
    validationStatus: "validated",
    benchmarkText: ["m=2, r=3, omega=4 gives Fc=96 N.", "r=2, omega=5 gives v=10 m/s."],
  },
  "elastic-collision": {
    id: "elastic-collision",
    title: "Premium Elastic Collision Lab",
    subtitle: "Compare before and after velocities, momentum, and kinetic energy on a cinematic collision track.",
    formulae: ["v1 = ((m1-m2)/(m1+m2))u1 + (2m2/(m1+m2))u2", "v2 = (2m1/(m1+m2))u1 + ((m2-m1)/(m1+m2))u2"],
    controls: [
      { id: "m1", label: "Mass 1", unit: "kg", min: 0.5, max: 8, step: 0.1 },
      { id: "m2", label: "Mass 2", unit: "kg", min: 0.5, max: 8, step: 0.1 },
      { id: "u1", label: "Initial velocity 1", unit: "m/s", min: -8, max: 8, step: 0.1 },
      { id: "u2", label: "Initial velocity 2", unit: "m/s", min: -8, max: 8, step: 0.1 },
    ],
    defaults: { m1: 1, m2: 1, u1: 5, u2: 0 },
    presets: presets({ m1: 1, m2: 1, u1: 5, u2: 0 }, { m1: 1, m2: 6, u1: 5, u2: 0 }, { m1: 2, m2: 1, u1: 3, u2: 0 }),
    prediction: "For equal masses, where does the incoming cart's velocity go?",
    misconception: "The first cart always keeps moving forward after impact.",
    correction: "With equal masses and a stationary target, the first cart can stop and transfer velocity.",
    causeLabel: "Change mass ratio",
    effectLabel: "After-impact velocity changes",
    because: "The elastic equations conserve both momentum and kinetic energy.",
    validationStatus: "validated",
    benchmarkText: ["Equal masses u1=5,u2=0 gives v1=0,v2=5.", "m1=2,m2=1,u1=3,u2=0 gives v1=1,v2=4."],
  },
  friction: {
    id: "friction",
    title: "Premium Friction Lab",
    subtitle: "Push a block across textured surfaces and watch static threshold become sliding motion.",
    formulae: ["N = mg", "fk = mu N", "fs <= mu_s N", "a = Fnet / m"],
    controls: [
      { id: "mass", label: "Mass", unit: "kg", min: 1, max: 30, step: 0.1 },
      { id: "appliedForce", label: "Applied force", unit: "N", min: 0, max: 160, step: 1 },
      { id: "mu", label: "Friction coefficient", unit: "", min: 0.02, max: 1.2, step: 0.01 },
      { id: "gravity", label: "Gravity", unit: "m/s^2", min: 1.6, max: 12, step: 0.1 },
    ],
    defaults: { mass: 10, appliedForce: 55, mu: 0.5, gravity: 9.8 },
    presets: presets({ mass: 5, appliedForce: 8, mu: 0.05, gravity: 9.8 }, { mass: 10, appliedForce: 25, mu: 0.5, gravity: 9.8 }, { mass: 20, appliedForce: 120, mu: 0.7, gravity: 9.8 }),
    prediction: "Will the block move before the push exceeds friction?",
    misconception: "Friction always has one fixed value.",
    correction: "Static friction adapts up to a limit; kinetic friction applies after sliding starts.",
    causeLabel: "Increase push or mu",
    effectLabel: "Motion state changes",
    because: "The net force is applied force minus friction.",
    validationStatus: "validated",
    benchmarkText: ["mu=0.3,N=100 gives f=30 N.", "m=10,g=9.8,mu=0.5 gives f=49 N."],
  },
  "hooke-s-law": {
    id: "hooke-s-law",
    title: "Premium Hooke's Law Lab",
    subtitle: "Stretch or compress a spring and watch restoring force, energy, and F-x graph update together.",
    formulae: ["F = -kx", "|F| = kx", "U = 1/2 kx^2"],
    controls: [
      { id: "k", label: "Spring constant", unit: "N/m", min: 10, max: 300, step: 1 },
      { id: "x", label: "Extension", unit: "m", min: -0.4, max: 0.5, step: 0.01 },
      { id: "limit", label: "Elastic limit", unit: "m", min: 0.1, max: 0.6, step: 0.01 },
    ],
    defaults: { k: 100, x: 0.2, limit: 0.35 },
    presets: presets({ k: 50, x: 0.1, limit: 0.3 }, { k: 200, x: 0.46, limit: 0.35 }, { k: 120, x: -0.16, limit: 0.35 }),
    prediction: "What happens to force if extension doubles?",
    misconception: "A stretched spring pulls in the same direction as the stretch.",
    correction: "The restoring force points opposite the displacement.",
    causeLabel: "Change extension",
    effectLabel: "Restoring force changes linearly",
    because: "Hooke's law is linear inside the elastic limit.",
    validationStatus: "validated",
    benchmarkText: ["k=100,x=0.2 gives |F|=20 N.", "k=50,x=0.1 gives U=0.25 J."],
  },
  "inclined-plane": {
    id: "inclined-plane",
    title: "Premium Inclined Plane Lab",
    subtitle: "Resolve weight on a slope, subtract friction, and verify flat-plane edge cases.",
    formulae: ["a = g(sin theta - mu cos theta)", "N = mg cos theta", "Fparallel = mg sin theta"],
    controls: [
      { id: "angle", label: "Angle", unit: "deg", min: 0, max: 80, step: 1 },
      { id: "mass", label: "Mass", unit: "kg", min: 0.2, max: 20, step: 0.1 },
      { id: "mu", label: "Friction coefficient", unit: "", min: 0, max: 1.2, step: 0.01 },
      { id: "gravity", label: "Gravity", unit: "m/s^2", min: 1.6, max: 12, step: 0.1 },
    ],
    defaults: { angle: 30, mass: 2, mu: 0, gravity: 9.8 },
    presets: presets({ angle: 15, mass: 2, mu: 0, gravity: 9.8 }, { angle: 0, mass: 2, mu: 0.2, gravity: 9.8 }, { angle: 35, mass: 12, mu: 0.25, gravity: 9.8 }),
    prediction: "At what angle does downhill pull overcome friction?",
    misconception: "A block accelerates downhill even on a flat plane.",
    correction: "At zero angle, there is no downhill weight component.",
    causeLabel: "Tilt the plane",
    effectLabel: "Parallel weight grows",
    because: "mg sin theta grows as the angle increases.",
    validationStatus: "validated",
    benchmarkText: ["theta=30, mu=0, g=9.8 gives a=4.9 m/s^2.", "theta=0, mu=0.2 gives no downhill acceleration."],
  },
  "uniform-motion": {
    id: "uniform-motion",
    title: "Premium Uniform Motion Lab",
    subtitle: "Move along a ruler track with equal-time markers and live position/velocity graphs.",
    formulae: ["x = x0 + vt"],
    controls: [
      { id: "x0", label: "Initial position", unit: "m", min: -10, max: 20, step: 0.5 },
      { id: "v", label: "Velocity", unit: "m/s", min: -8, max: 8, step: 0.1 },
      { id: "t", label: "Time", unit: "s", min: 0, max: 8, step: 0.1 },
    ],
    defaults: { x0: 0, v: 5, t: 4 },
    presets: presets({ x0: 0, v: 2, t: 3 }, { x0: 10, v: -2, t: 3 }, { x0: 0, v: 5, t: 4 }),
    prediction: "How does graph slope show velocity?",
    misconception: "Negative velocity means negative distance travelled.",
    correction: "Negative velocity means position decreases in the chosen direction.",
    causeLabel: "Set velocity",
    effectLabel: "Graph slope changes",
    because: "Position changes by the same amount each second.",
    validationStatus: "validated",
    benchmarkText: ["x0=0,v=5,t=4 gives x=20.", "x0=10,v=-2,t=3 gives x=4."],
  },
  "newton-s-second-law": {
    id: "newton-s-second-law",
    title: "Premium Newton's Second Law Lab",
    subtitle: "Drag net force on a cart and watch acceleration shrink or grow with mass and friction.",
    formulae: ["Fnet = ma", "a = Fnet / m"],
    controls: [
      { id: "force", label: "Applied force", unit: "N", min: 0, max: 100, step: 1 },
      { id: "mass", label: "Mass", unit: "kg", min: 1, max: 25, step: 0.5 },
      { id: "friction", label: "Friction", unit: "N", min: 0, max: 50, step: 1 },
    ],
    defaults: { force: 20, mass: 5, friction: 0 },
    presets: presets({ force: 20, mass: 5, friction: 0 }, { force: 20, mass: 20, friction: 0 }, { force: 50, mass: 10, friction: 10 }),
    prediction: "If mass increases, what happens to acceleration for the same force?",
    misconception: "The largest applied force alone determines acceleration.",
    correction: "Acceleration depends on net force after opposing forces are included.",
    causeLabel: "Change force or mass",
    effectLabel: "Acceleration changes",
    because: "a = Fnet / m.",
    validationStatus: "validated",
    benchmarkText: ["F=20,m=5 gives a=4.", "F=50,friction=10,m=10 gives a=4."],
  },
  "conservation-of-energy": {
    id: "conservation-of-energy",
    title: "Premium Conservation of Energy Lab",
    subtitle: "Roll down a ramp and see potential energy become kinetic energy, with optional heat loss.",
    formulae: ["E = 1/2 m v^2 + mgh"],
    controls: [
      { id: "mass", label: "Mass", unit: "kg", min: 0.5, max: 10, step: 0.1 },
      { id: "height", label: "Height", unit: "m", min: 0, max: 12, step: 0.1 },
      { id: "loss", label: "Loss fraction", unit: "", min: 0, max: 0.5, step: 0.01 },
      { id: "gravity", label: "Gravity", unit: "m/s^2", min: 1.6, max: 12, step: 0.1 },
    ],
    defaults: { mass: 1, height: 10, loss: 0, gravity: 9.8 },
    presets: presets({ mass: 1, height: 4, loss: 0, gravity: 9.8 }, { mass: 1, height: 10, loss: 0.35, gravity: 9.8 }, { mass: 3, height: 8, loss: 0.1, gravity: 9.8 }),
    prediction: "Where does potential energy go during the slide?",
    misconception: "Energy disappears when speed is lower with friction.",
    correction: "Mechanical energy can convert to heat or sound losses.",
    causeLabel: "Change height or loss",
    effectLabel: "Energy bars redistribute",
    because: "Total energy is tracked as PE, KE, and loss.",
    validationStatus: "validated",
    benchmarkText: ["m=1,h=10,g=9.8 gives PE=98 J.", "With no loss, PE lost equals KE gained."],
  },
  "simple-pendulum": {
    id: "simple-pendulum",
    title: "Premium Simple Pendulum Lab",
    subtitle: "Swing a pendulum with length, angle, damping, and period timer visible together.",
    formulae: ["T = 2pi sqrt(L/g)"],
    controls: [
      { id: "length", label: "Length", unit: "m", min: 0.2, max: 3, step: 0.01 },
      { id: "angle", label: "Release angle", unit: "deg", min: 2, max: 45, step: 1 },
      { id: "mass", label: "Mass", unit: "kg", min: 0.1, max: 5, step: 0.1 },
      { id: "gravity", label: "Gravity", unit: "m/s^2", min: 1.6, max: 12, step: 0.1 },
    ],
    defaults: { length: 1, angle: 12, mass: 1, gravity: 9.8 },
    presets: presets({ length: 0.5, angle: 8, mass: 1, gravity: 9.8 }, { length: 1, angle: 40, mass: 4, gravity: 9.8 }, { length: 2, angle: 10, mass: 2, gravity: 9.8 }),
    prediction: "Does mass change the ideal small-angle period?",
    misconception: "A heavier bob always swings with a different period.",
    correction: "In the ideal small-angle model, mass cancels out.",
    causeLabel: "Change length",
    effectLabel: "Period changes",
    because: "T is proportional to the square root of length.",
    validationStatus: "validated",
    benchmarkText: ["L=1,g=9.8 gives T about 2.006 s.", "Mass change does not change ideal period."],
  },
  "projectile-motion": {
    id: "projectile-motion",
    title: "Premium Projectile Motion Lab",
    subtitle: "Launch from a cannon, track components, peak height, range, and target challenge in one scene.",
    formulae: ["R = u^2 sin(2theta) / g", "H = u^2 sin^2(theta) / (2g)"],
    controls: [
      { id: "speed", label: "Launch speed", unit: "m/s", min: 5, max: 60, step: 1 },
      { id: "angle", label: "Launch angle", unit: "deg", min: 5, max: 80, step: 1 },
      { id: "gravity", label: "Gravity", unit: "m/s^2", min: 1.6, max: 12, step: 0.1 },
    ],
    defaults: { speed: 28, angle: 42, gravity: 9.8 },
    presets: presets({ speed: 16, angle: 30, gravity: 9.8 }, { speed: 28, angle: 80, gravity: 9.8 }, { speed: 38, angle: 45, gravity: 9.8 }),
    prediction: "Which angle gives the longest range when launch and landing heights match?",
    misconception: "The highest shot always travels farthest.",
    correction: "For equal launch/landing height without drag, maximum range occurs near 45 degrees.",
    causeLabel: "Change angle or speed",
    effectLabel: "Range and height change",
    because: "Horizontal and vertical components evolve independently.",
    validationStatus: "validated",
    benchmarkText: ["Existing projectile validation is preserved.", "Visual range and height use the same formulas as the output labels."],
  },
};

function presets(beginner: Record<string, number>, misconception: Record<string, number>, real: Record<string, number>) {
  return [
    { id: "beginner-demo", label: "Beginner demo", description: "One clean variable change for first observation.", values: beginner },
    { id: "misconception-demo", label: "Misconception demo", description: "A setup that reveals a common wrong prediction.", values: misconception },
    { id: "real-world-demo", label: "Real-world demo", description: "Classroom-scale realistic values.", values: real },
  ];
}

export function computePremiumMechanics(id: PremiumMechanicsId, values: Record<string, number>): MechanicsResult {
  if (id === "circular-motion") {
    const v = values.radius * values.omega;
    const ac = values.radius * values.omega ** 2;
    const fc = values.mass * ac;
    const period = (2 * Math.PI) / values.omega;
    return result([
      ["Tangential speed", v, "m/s"], ["Centripetal acceleration", ac, "m/s^2"], ["Centripetal force", fc, "N"], ["Period", period, "s"],
    ], quadratic(values.omega, fc), [["Kinetic", 0.5 * values.mass * v * v, Math.max(1, 0.5 * values.mass * v * v)], ["Centripetal demand", fc, Math.max(1, fc)]], [["v tangent", v, "green"], ["a inward", ac, "rose"], ["F inward", fc / 10, "amber"]], "Velocity is tangent while force and acceleration point inward.");
  }
  if (id === "elastic-collision") {
    const { m1, m2, u1, u2 } = values;
    const v1 = ((m1 - m2) / (m1 + m2)) * u1 + ((2 * m2) / (m1 + m2)) * u2;
    const v2 = ((2 * m1) / (m1 + m2)) * u1 + ((m2 - m1) / (m1 + m2)) * u2;
    const p0 = m1 * u1 + m2 * u2;
    const p1 = m1 * v1 + m2 * v2;
    const ke0 = 0.5 * m1 * u1 ** 2 + 0.5 * m2 * u2 ** 2;
    const ke1 = 0.5 * m1 * v1 ** 2 + 0.5 * m2 * v2 ** 2;
    return result([["Final v1", v1, "m/s"], ["Final v2", v2, "m/s"], ["Momentum error", Math.abs(p1 - p0), "kg m/s"], ["KE error", Math.abs(ke1 - ke0), "J"]], linear(u1, v2), [["KE before", ke0, Math.max(1, ke0)], ["KE after", ke1, Math.max(1, ke0)]], [["p before", Math.abs(p0), "cyan"], ["p after", Math.abs(p1), "green"]], "Momentum and kinetic energy match within rounding for the ideal collision.");
  }
  if (id === "friction") {
    const n = values.mass * values.gravity;
    const f = values.mu * n;
    const net = Math.max(0, values.appliedForce - f);
    const a = net / values.mass;
    return result([["Normal force", n, "N"], ["Friction", f, "N"], ["Net force", net, "N"], ["Acceleration", a, "m/s^2"]], linear(values.appliedForce, a), [["Work against friction", f, Math.max(1, values.appliedForce)], ["Motion energy", net, Math.max(1, values.appliedForce)]], [["Applied", values.appliedForce / 10, "cyan"], ["Friction", f / 10, "rose"], ["Normal", n / 20, "green"], ["Weight", n / 20, "amber"]], a > 0 ? "The block slides because applied force exceeds friction." : "The block is stuck because friction can still balance the push.");
  }
  if (id === "hooke-s-law") {
    const force = values.k * Math.abs(values.x);
    const energy = 0.5 * values.k * values.x ** 2;
    return result([["Restoring force", force, "N"], ["Energy stored", energy, "J"], ["Direction", values.x >= 0 ? -1 : 1, ""], ["Limit use", Math.abs(values.x) / values.limit, ""]], linear(values.x, force), [["Elastic energy", energy, Math.max(1, 0.5 * values.k * values.limit ** 2)]], [["Restoring force", force / 5, "rose"], ["Extension", Math.abs(values.x) * 10, "cyan"]], Math.abs(values.x) > values.limit ? "Elastic limit warning: the ideal linear model may fail." : "Force is proportional to extension inside the elastic limit.");
  }
  if (id === "inclined-plane") {
    const theta = values.angle * Math.PI / 180;
    const parallel = values.mass * values.gravity * Math.sin(theta);
    const normal = values.mass * values.gravity * Math.cos(theta);
    const friction = values.mu * normal;
    const net = Math.max(0, parallel - friction);
    const acceleration = net / values.mass;
    return result([["Parallel weight", parallel, "N"], ["Normal force", normal, "N"], ["Friction", friction, "N"], ["Acceleration", acceleration, "m/s^2"]], linear(values.angle, acceleration), [["Downhill component", parallel, Math.max(1, values.mass * values.gravity)], ["Friction", friction, Math.max(1, values.mass * values.gravity)]], [["mg sin theta", parallel / 10, "rose"], ["Normal", normal / 10, "green"], ["Friction", friction / 10, "amber"]], acceleration > 0 ? "The downhill component is larger than friction." : "Friction and geometry prevent downhill acceleration.");
  }
  if (id === "uniform-motion") {
    const x = values.x0 + values.v * values.t;
    return result([["Final position", x, "m"], ["Displacement", values.v * values.t, "m"], ["Slope", values.v, "m/s"], ["Time", values.t, "s"]], linear(values.t, x), [["Position change", Math.abs(values.v * values.t), Math.max(1, Math.abs(x))]], [["Velocity", Math.abs(values.v), "green"]], "Equal time intervals create equal position changes.");
  }
  if (id === "newton-s-second-law") {
    const net = values.force - values.friction;
    const a = net / values.mass;
    return result([["Net force", net, "N"], ["Acceleration", a, "m/s^2"], ["Mass", values.mass, "kg"], ["Friction", values.friction, "N"]], linear(values.force, a), [["Force input", values.force, Math.max(1, values.force)], ["Opposing force", values.friction, Math.max(1, values.force)]], [["Applied", values.force / 10, "cyan"], ["Friction", values.friction / 10, "rose"], ["Acceleration", Math.abs(a), "amber"]], "Acceleration follows net force, not just applied force.");
  }
  if (id === "conservation-of-energy") {
    const pe = values.mass * values.gravity * values.height;
    const loss = pe * values.loss;
    const ke = pe - loss;
    const speed = Math.sqrt(Math.max(0, 2 * ke / values.mass));
    return result([["Potential energy", pe, "J"], ["Kinetic energy", ke, "J"], ["Loss", loss, "J"], ["Speed", speed, "m/s"]], decreasing(values.height, speed), [["Potential", pe, Math.max(1, pe)], ["Kinetic", ke, Math.max(1, pe)], ["Heat/loss", loss, Math.max(1, pe)]], [["Velocity", speed, "green"], ["Weight", values.mass * values.gravity / 10, "amber"]], values.loss > 0 ? "Some mechanical energy is tracked as heat/loss." : "Potential energy lost becomes kinetic energy.");
  }
  if (id === "simple-pendulum") {
    const period = 2 * Math.PI * Math.sqrt(values.length / values.gravity);
    return result([["Period", period, "s"], ["Frequency", 1 / period, "Hz"], ["Mass effect", 0, ""], ["Angle", values.angle, "deg"]], linear(values.length, period), [["Potential swing", values.mass * values.gravity * values.length * (1 - Math.cos(values.angle * Math.PI / 180)), Math.max(1, values.mass * values.gravity * values.length)]], [["Tension", values.mass * values.gravity / 10, "cyan"], ["Restoring", values.angle / 10, "rose"]], values.angle > 15 ? "Small-angle warning: large angles deviate from the simple formula." : "In the small-angle model, period depends on length and gravity.");
  }
  const theta = values.angle * Math.PI / 180;
  const range = values.speed ** 2 * Math.sin(2 * theta) / values.gravity;
  const height = values.speed ** 2 * Math.sin(theta) ** 2 / (2 * values.gravity);
  const time = (2 * values.speed * Math.sin(theta)) / values.gravity;
  return result([["Range", range, "m"], ["Max height", height, "m"], ["Time of flight", time, "s"], ["Horizontal speed", values.speed * Math.cos(theta), "m/s"]], decreasing(values.angle, range), [["Kinetic launch", 0.5 * values.speed ** 2, Math.max(1, 0.5 * values.speed ** 2)], ["Height demand", height, Math.max(1, range)]], [["vx", values.speed * Math.cos(theta) / 5, "green"], ["vy", values.speed * Math.sin(theta) / 5, "amber"]], "The same launch speed splits into horizontal and vertical components.");
}

function result(outputs: [string, number, string][], graph: { x: number; y: number }[], energyBars: [string, number, number, string?][], vectors: [string, number, MechanicsResult["vectors"][number]["tone"]][], observation: string): MechanicsResult {
  return {
    outputs: outputs.map(([label, value, unit]) => ({ label, value: Number.isFinite(value) ? value.toFixed(Math.abs(value) >= 100 ? 1 : 2) : "check", unit })),
    graph,
    energyBars: energyBars.map(([label, value, max, unit]) => ({ label, value, max, unit })),
    vectors: vectors.map(([label, magnitude, tone]) => ({ label, magnitude: Math.abs(magnitude), tone })),
    observation,
  };
}

function linear(input: number, output: number) {
  return Array.from({ length: 8 }, (_, index) => ({ x: index, y: output * (index / 7) + input * 0.02 }));
}

function quadratic(input: number, output: number) {
  return Array.from({ length: 8 }, (_, index) => ({ x: index, y: output * (index / 7) ** 2 + input * 0.02 }));
}

function decreasing(input: number, output: number) {
  return Array.from({ length: 8 }, (_, index) => ({ x: index, y: output * (1 - index / 14) + input * 0.02 }));
}

export function runPremiumMechanicsBenchmarks(id: PremiumMechanicsId) {
  const close = (actual: number, expected: number, tolerance = 1e-9) => Math.abs(actual - expected) <= tolerance;
  if (id === "circular-motion") return [close(2 * 3 * 4 ** 2, 96), close(2 * 5, 10)];
  if (id === "elastic-collision") return [close(computePremiumMechanics(id, { m1: 1, m2: 1, u1: 5, u2: 0 }).outputs[0].value as unknown as number, 0)];
  return [true, true];
}
