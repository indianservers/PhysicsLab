import { ExperimentDefinition } from "../types";
import { createObject } from "./objectRegistry";

export const projectileDefaults = {
  speed: 28,
  angle: 42,
  gravity: 9.81,
  mass: 1,
  airResistance: false,
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
        expression: "R = u^2 sin(2θ) / g",
        variables: [
          { symbol: "u", name: "Initial speed", unit: "m/s" },
          { symbol: "θ", name: "Launch angle", unit: "degree" },
          { symbol: "g", name: "Acceleration due to gravity", unit: "m/s²" },
        ],
      },
      {
        id: "height",
        name: "Maximum height",
        expression: "H = u^2 sin²(θ) / 2g",
        variables: [
          { symbol: "H", name: "Maximum height", unit: "m" },
          { symbol: "g", name: "Acceleration due to gravity", unit: "m/s²" },
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
    formulae: [],
    procedure: ["Load the setup.", "Adjust variables in the properties panel.", "Run the simulation.", "Record graph and observation values."],
    simulationSetup: { gravity: 9.81, objects: [createObject("ball", 180, 180), createObject("floor", 460, 560)] },
    observationColumns: ["Trial", "Variable", "Measured value", "Expected value", "Error %"],
    expectedResult: "Measured behavior should follow the standard SI-unit physics model for the chosen topic.",
    vivaQuestions: [{ prompt: `Name one key variable in ${title}.`, answer: "Answers depend on the selected setup and changed controls." }],
    commonMistakes: ["Using inconsistent units", "Running too large a time step", "Ignoring friction or restitution settings"],
  })) as ExperimentDefinition[],
];
