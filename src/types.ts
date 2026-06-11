export type PhysicsObjectKind =
  | "ball"
  | "block"
  | "floor"
  | "wall"
  | "ramp"
  | "spring"
  | "pendulum"
  | "rope"
  | "pulley"
  | "cart"
  | "wheel"
  | "disc"
  | "rod"
  | "force-arrow"
  | "velocity-arrow"
  | "acceleration-arrow"
  | "stopwatch"
  | "ruler"
  | "protractor"
  | "graph-plotter"
  | "motion-sensor"
  | "force-sensor"
  | "light-ray"
  | "plane-mirror"
  | "convex-lens"
  | "concave-mirror"
  | "prism"
  | "wave-source"
  | "wave-barrier"
  | "fluid-region"
  | "chladni-plate"
  | "charge"
  | "electric-field-region"
  | "bar-magnet"
  | "thermometer"
  | "gas-container"
  | "battery"
  | "resistor"
  | "bulb"
  | "switch"
  | "ammeter"
  | "voltmeter"
  | "wire"
  | "double-pendulum";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface PropertyDefinition {
  key: string;
  label: string;
  unit?: string;
  type: "number" | "text" | "boolean" | "select";
  min?: number;
  max?: number;
  step?: number;
}

export interface PhysicsObjectDefinition {
  id: PhysicsObjectKind;
  name: string;
  category: string;
  icon: string;
  defaultProperties: Record<string, number | string | boolean>;
  editableProperties: PropertyDefinition[];
  renderType: "canvas" | "svg" | "webgl";
  simulationType:
    | "rigid-body"
    | "field"
    | "wave"
    | "optics"
    | "thermal"
    | "fluid"
    | "modern"
    | "circuit"
    | "numerical";
}

export type TerminalKind = "pos" | "neg";

export interface PhysicsObjectInstance {
  id: string;
  kind: PhysicsObjectKind;
  name: string;
  x: number;
  y: number;
  angle: number;
  width?: number;
  height?: number;
  radius?: number;
  mass: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  friction: number;
  restitution: number;
  isStatic: boolean;
  locked?: boolean;
  color?: string;
  charge?: number;
  temperature?: number;
  density?: number;
  material?: string;
  springConstant?: number;
  damping?: number;
  airDrag?: number;
  motorSpeed?: number;
  motorTorque?: number;
  torque?: number;
  length?: number;
  pivotX?: number;
  pivotY?: number;
  focalLength?: number;
  refractiveIndex?: number;
  reflectivity?: number;
  wavelength?: number;
  intensity?: number;
  viscosity?: number;
  frequency?: number;
  amplitude?: number;
  phase?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  gapPositions?: number[];
  gapWidth?: number;
  length1?: number;
  length2?: number;
  mass1?: number;
  mass2?: number;
  angle1?: number;
  angle2?: number;
  omega1?: number;
  omega2?: number;
  emf?: number;
  internalResistance?: number;
  resistance?: number;
  brightness?: number;
  closed?: boolean;
  current?: number;
  voltage?: number;
  voltageDiff?: number;
  connectedTo?: [string, string];
  fromId?: string;
  fromTerminal?: TerminalKind;
  toId?: string;
  toTerminal?: TerminalKind;
  trail: { x: number; y: number; t: number }[];
}

export interface ViewportState {
  offsetX: number;
  offsetY: number;
  zoom: number;
}

export interface SimulationSettings {
  gravity: number;
  timeScale: number;
  airResistance: boolean;
  airDensity: number;
}

export interface EngineSnapshot {
  objects: PhysicsObjectInstance[];
  graphPoint?: GraphPoint;
  simulationTime: number;
  warnings: string[];
}

export interface FormulaDefinition {
  id: string;
  name: string;
  expression: string;
  variables: {
    symbol: string;
    name: string;
    unit: string;
  }[];
}

export interface Question {
  prompt: string;
  answer: string;
  options?: string[];
}

export interface SimulationSetup {
  gravity: number;
  objects: PhysicsObjectInstance[];
}

export interface ExperimentDefinition {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  classLevel: string;
  curriculumTags?: {
    classes: number[];
    unitIds: string[];
    topicIds: string[];
    domains: string[];
  };
  aim: string;
  theory: string;
  apparatus: string[];
  formulae: FormulaDefinition[];
  procedure: string[];
  simulationSetup: SimulationSetup;
  observationColumns: string[];
  expectedResult: string;
  vivaQuestions: Question[];
  commonMistakes: string[];
  assumptions?: string[];
  limitations?: string[];
  validRanges?: string[];
  failureConditions?: string[];
  modelClass?: SimulationModelClass;
  trustLevel?: number;
  confidenceReason?: string;
}

export type SimulationModelClass =
  | "Concept"
  | "Calculator"
  | "Visualization"
  | "Dynamic Simulation"
  | "Validated Simulation"
  | "Research Prototype";

export type GraphSourceType =
  | "Validated Simulation"
  | "Formula Calculation"
  | "Educational Approximation"
  | "Visual Metaphor";

export interface GraphPoint {
  t: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  speed?: number;
  acceleration?: number;
  force?: number;
  momentum?: number;
  kineticEnergy?: number;
  potentialEnergy?: number;
  totalEnergy?: number;
  pressure?: number;
  volume?: number;
  temperature?: number;
  voltage?: number;
  current?: number;
  intensity?: number;
  angle?: number;
  wavelength?: number;
  frequency?: number;
}

export type GraphVariable = keyof GraphPoint;

export interface GraphTraceConfig {
  id: string;
  xKey: GraphVariable;
  yKey: GraphVariable;
  label: string;
  color: string;
  enabled: boolean;
  errorPercent?: number;
  sourceType?: GraphSourceType;
  scientificConfidence?: number;
  assumptions?: string[];
}

export interface ObservationRow {
  id: string;
  label: string;
  measured: number;
  expected: number;
  unit: string;
  note: string;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeUi: boolean;
  colorBlindSafe: boolean;
  reducedMotion: boolean;
}

export type UnitSystem = "SI" | "CGS";

export interface ProjectFile {
  version: "1.0.0";
  name: string;
  mode: "guided" | "sandbox";
  topic: string;
  objects: PhysicsObjectInstance[];
  fields: unknown[];
  instruments: unknown[];
  graphs: GraphPoint[];
  experimentData: GraphPoint[];
  simulationSettings: {
    gravity: number;
    airResistance: boolean;
    timeScale: number;
  };
  createdAt: string;
  updatedAt: string;
}
