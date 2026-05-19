import { ExperimentDefinition, FormulaDefinition } from "../types";
import { createObject } from "./objectRegistry";

export const projectileDefaults = {
  speed: 28,
  angle: 42,
  gravity: 9.81,
  mass: 1,
  airResistance: false,
};

const formulaByTitle: Record<string, FormulaDefinition[]> = {
  "Uniform Motion": [{ id: "uniform-motion-formula", name: "Uniform motion", expression: "x = x_0 + vt", variables: [{ symbol: "x", name: "Position", unit: "m" }, { symbol: "v", name: "Velocity", unit: "m/s" }, { symbol: "t", name: "Time", unit: "s" }] }],
  "Newton's Second Law": [{ id: "newton-2-formula", name: "Newton's second law", expression: "F = ma", variables: [{ symbol: "F", name: "Force", unit: "N" }, { symbol: "m", name: "Mass", unit: "kg" }, { symbol: "a", name: "Acceleration", unit: "m/s^2" }] }],
  Friction: [{ id: "friction-formula", name: "Kinetic friction", expression: "f = \\mu N", variables: [{ symbol: "mu", name: "Coefficient of friction", unit: "" }, { symbol: "N", name: "Normal force", unit: "N" }] }],
  "Inclined Plane": [{ id: "incline-formula", name: "Incline acceleration", expression: "a = g(\\sin\\theta - \\mu\\cos\\theta)", variables: [{ symbol: "theta", name: "Incline angle", unit: "degree" }, { symbol: "mu", name: "Friction coefficient", unit: "" }] }],
  "Elastic Collision": [{ id: "collision-formula", name: "Momentum conservation", expression: "m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2", variables: [{ symbol: "m", name: "Mass", unit: "kg" }, { symbol: "u", name: "Initial velocity", unit: "m/s" }, { symbol: "v", name: "Final velocity", unit: "m/s" }] }],
  "Conservation of Energy": [{ id: "energy-formula", name: "Mechanical energy", expression: "E = \\frac{1}{2}mv^2 + mgh", variables: [{ symbol: "E", name: "Energy", unit: "J" }, { symbol: "h", name: "Height", unit: "m" }] }],
  "Hooke's Law": [{ id: "hooke-formula", name: "Hooke's law", expression: "F = -kx", variables: [{ symbol: "k", name: "Spring constant", unit: "N/m" }, { symbol: "x", name: "Extension", unit: "m" }] }],
  "Simple Pendulum": [{ id: "pendulum-formula", name: "Small-angle period", expression: "T = 2\\pi\\sqrt{\\frac{L}{g}}", variables: [{ symbol: "T", name: "Period", unit: "s" }, { symbol: "L", name: "Length", unit: "m" }] }],
  "Circular Motion": [{ id: "circular-formula", name: "Centripetal force", expression: "F_c = mr\\omega^2", variables: [{ symbol: "r", name: "Radius", unit: "m" }, { symbol: "omega", name: "Angular speed", unit: "rad/s" }] }],
};

export const experiments: ExperimentDefinition[] = [
  {
    id: "projectile-motion",
    title: "Projectile Motion",
    category: "Mechanics",
    difficulty: "Beginner",
    classLevel: "Class 11 / Intro Engineering",
    aim: "Study how initial speed, launch angle, gravity, and mass affect projectile range and height.",
    theory: "Projectile motion separates into constant horizontal velocity and uniformly accelerated vertical motion.",
    apparatus: ["Launcher", "Ball", "Grid", "Stopwatch", "Graph plotter"],
    formulae: [
      {
        id: "range",
        name: "Range",
        expression: "R = \\frac{u^2\\sin(2\\theta)}{g}",
        variables: [
          { symbol: "u", name: "Initial speed", unit: "m/s" },
          { symbol: "theta", name: "Launch angle", unit: "degree" },
          { symbol: "g", name: "Acceleration due to gravity", unit: "m/s^2" },
        ],
      },
      {
        id: "height",
        name: "Maximum height",
        expression: "H = \\frac{u^2\\sin^2(\\theta)}{2g}",
        variables: [
          { symbol: "H", name: "Maximum height", unit: "m" },
          { symbol: "g", name: "Acceleration due to gravity", unit: "m/s^2" },
        ],
      },
    ],
    procedure: [
      "Set the launch speed and angle.",
      "Run the simulation and observe the parabolic trajectory.",
      "Record range, maximum height, and time of flight.",
      "Compare measured values with the displayed formula results.",
    ],
    simulationSetup: {
      gravity: 9.81,
      objects: [createObject("ball", 90, 430), createObject("floor", 460, 560)],
    },
    observationColumns: ["Trial", "Speed", "Angle", "Range", "Maximum height", "Time of flight"],
    expectedResult: "For ideal projectile motion, range is maximum near 45 degrees when launch and landing heights match.",
    vivaQuestions: [
      { prompt: "Why does mass not affect ideal projectile range?", answer: "Gravity gives all masses the same acceleration when air resistance is ignored." },
      { prompt: "What launch angle gives maximum range on level ground?", answer: "45 degrees." },
    ],
    commonMistakes: ["Mixing degrees and radians", "Forgetting that vertical acceleration is downward", "Comparing air-resistance and ideal values directly"],
  },
  ...[
    "Uniform Motion",
    "Newton's Second Law",
    "Friction",
    "Inclined Plane",
    "Elastic Collision",
    "Conservation of Energy",
    "Hooke's Law",
    "Simple Pendulum",
    "Circular Motion",
  ].map((title, index) => ({
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, ""),
    title,
    category: "Mechanics",
    difficulty: index < 3 ? "Beginner" : "Intermediate",
    classLevel: "High school / undergraduate foundation",
    aim: `Explore ${title.toLowerCase()} with editable variables and live measurements.`,
    theory: "This starter experiment uses the common lab workspace, object properties, vectors, graphs, and observation table.",
    apparatus: ["Physics canvas", "Graph plotter", "Data logger", "Measurement probe"],
    formulae: formulaByTitle[title] ?? [],
    procedure: ["Load the setup.", "Adjust variables in the properties panel.", "Run the simulation.", "Record graph and observation values."],
    simulationSetup: { gravity: 9.81, objects: [createObject("ball", 180, 180), createObject("floor", 460, 560)] },
    observationColumns: ["Trial", "Variable", "Measured value", "Expected value", "Error %"],
    expectedResult: "Measured behavior should follow the standard SI-unit physics model for the chosen topic.",
    vivaQuestions: [{ prompt: `Name one key variable in ${title}.`, answer: "Answers depend on the selected setup and changed controls." }],
    commonMistakes: ["Using inconsistent units", "Running too large a time step", "Ignoring friction or restitution settings"],
  })) as ExperimentDefinition[],
];
