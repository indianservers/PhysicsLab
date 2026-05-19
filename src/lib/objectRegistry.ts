import { PhysicsObjectDefinition, PhysicsObjectInstance, PhysicsObjectKind, PropertyDefinition } from "../types";

const sharedRigidProperties = [
  { key: "mass", label: "Mass", unit: "kg", type: "number" as const, min: 0.01, step: 0.1 },
  { key: "x", label: "Position X", unit: "m", type: "number" as const, step: 0.1 },
  { key: "y", label: "Position Y", unit: "m", type: "number" as const, step: 0.1 },
  { key: "vx", label: "Velocity X", unit: "m/s", type: "number" as const, step: 0.1 },
  { key: "vy", label: "Velocity Y", unit: "m/s", type: "number" as const, step: 0.1 },
  { key: "friction", label: "Friction", type: "number" as const, min: 0, max: 1, step: 0.01 },
  { key: "restitution", label: "Restitution", type: "number" as const, min: 0, max: 1, step: 0.01 },
  { key: "airDrag", label: "Air drag", type: "number" as const, min: 0, max: 2, step: 0.01 },
  { key: "torque", label: "Torque", unit: "N m", type: "number" as const, step: 0.1 },
  { key: "locked", label: "Lock", type: "boolean" as const },
];

export const objectRegistry: PhysicsObjectDefinition[] = [
  {
    id: "ball",
    name: "Ball",
    category: "Mechanics",
    icon: "BALL",
    defaultProperties: { radius: 24, mass: 1, friction: 0.02, restitution: 0.82, color: "#38bdf8" },
    editableProperties: [{ key: "radius", label: "Radius", unit: "cm", type: "number", min: 8, step: 1 }, ...sharedRigidProperties],
    renderType: "canvas",
    simulationType: "rigid-body",
  },
  {
    id: "block",
    name: "Block",
    category: "Mechanics",
    icon: "BOX",
    defaultProperties: { width: 58, height: 42, mass: 2, friction: 0.18, restitution: 0.25, color: "#34d399" },
    editableProperties: [
      { key: "width", label: "Width", unit: "cm", type: "number", min: 10, step: 1 },
      { key: "height", label: "Height", unit: "cm", type: "number", min: 10, step: 1 },
      ...sharedRigidProperties,
    ],
    renderType: "canvas",
    simulationType: "rigid-body",
  },
  {
    id: "floor",
    name: "Floor",
    category: "Boundaries",
    icon: "FLR",
    defaultProperties: { width: 760, height: 28, mass: 0, friction: 0.35, restitution: 0.35, isStatic: true, color: "#64748b" },
    editableProperties: [
      { key: "width", label: "Width", unit: "cm", type: "number", min: 50, step: 10 },
      { key: "friction", label: "Friction", type: "number", min: 0, max: 1, step: 0.01 },
      { key: "restitution", label: "Restitution", type: "number", min: 0, max: 1, step: 0.01 },
    ],
    renderType: "canvas",
    simulationType: "rigid-body",
  },
  {
    id: "wall",
    name: "Wall",
    category: "Boundaries",
    icon: "WAL",
    defaultProperties: { width: 26, height: 420, mass: 0, friction: 0.3, restitution: 0.35, isStatic: true, color: "#94a3b8" },
    editableProperties: [
      { key: "height", label: "Height", unit: "cm", type: "number", min: 60, step: 10 },
      { key: "friction", label: "Friction", type: "number", min: 0, max: 1, step: 0.01 },
    ],
    renderType: "canvas",
    simulationType: "rigid-body",
  },
  {
    id: "ramp",
    name: "Ramp",
    category: "Mechanics",
    icon: "RMP",
    defaultProperties: { width: 220, height: 32, angle: -0.42, mass: 0, friction: 0.22, restitution: 0.28, isStatic: true, color: "#fbbf24" },
    editableProperties: [
      { key: "angle", label: "Angle", unit: "rad", type: "number", min: -1.2, max: 1.2, step: 0.01 },
      { key: "friction", label: "Friction", type: "number", min: 0, max: 1, step: 0.01 },
    ],
    renderType: "canvas",
    simulationType: "rigid-body",
  },
  {
    id: "spring",
    name: "Spring",
    category: "Constraints",
    icon: "SPR",
    defaultProperties: { width: 130, height: 22, mass: 0.2, springConstant: 24, friction: 0.04, restitution: 0.2, color: "#a78bfa" },
    editableProperties: [
      { key: "springConstant", label: "Spring Constant", unit: "N/m", type: "number", min: 0, step: 1 },
      { key: "damping", label: "Damping", type: "number", min: 0, max: 1, step: 0.01 },
      ...sharedRigidProperties,
    ],
    renderType: "canvas",
    simulationType: "rigid-body",
  },
  {
    id: "pendulum",
    name: "Pendulum",
    category: "Oscillations",
    icon: "PEN",
    defaultProperties: { radius: 18, mass: 1, length: 160, pivotX: 420, pivotY: 90, friction: 0.01, restitution: 0.2, color: "#fb923c" },
    editableProperties: [
      { key: "length", label: "Length", unit: "cm", type: "number", min: 40, step: 5 },
      { key: "damping", label: "Damping", type: "number", min: 0, max: 1, step: 0.01 },
      ...sharedRigidProperties,
    ],
    renderType: "canvas",
    simulationType: "rigid-body",
  },
  ...makePlaceholderObjects(),
];

function makePlaceholderObjects(): PhysicsObjectDefinition[] {
  const entries: Array<{
    id: PhysicsObjectKind;
    name: string;
    category: string;
    icon: string;
    simulationType: PhysicsObjectDefinition["simulationType"];
    defaults?: Record<string, number | string | boolean>;
    editable?: PropertyDefinition[];
  }> = [
    { id: "rope", name: "Rope", category: "Constraints", icon: "ROP", simulationType: "rigid-body", defaults: { width: 150, height: 8, mass: 0.2, color: "#cbd5e1" } },
    { id: "pulley", name: "Pulley", category: "Simple Machines", icon: "PUL", simulationType: "rigid-body", defaults: { radius: 28, mass: 1, isStatic: true, motorSpeed: 0, color: "#94a3b8" }, editable: [{ key: "motorSpeed", label: "Motor speed", unit: "rad/s", type: "number", step: 0.1 }, ...sharedRigidProperties] },
    { id: "cart", name: "Cart", category: "Mechanics", icon: "CAR", simulationType: "rigid-body", defaults: { width: 76, height: 36, mass: 2, color: "#60a5fa" } },
    { id: "wheel", name: "Wheel", category: "Rotational", icon: "WHL", simulationType: "rigid-body", defaults: { radius: 30, mass: 1.5, restitution: 0.5, color: "#f97316" } },
    { id: "disc", name: "Disc", category: "Rotational", icon: "DSC", simulationType: "rigid-body", defaults: { radius: 32, mass: 2, color: "#facc15" } },
    { id: "rod", name: "Rod", category: "Rotational", icon: "ROD", simulationType: "rigid-body", defaults: { width: 140, height: 14, mass: 1, color: "#a3e635" } },
    { id: "force-arrow", name: "Force Arrow", category: "Vectors", icon: "FRC", simulationType: "field", defaults: { width: 90, height: 12, isStatic: true, color: "#f43f5e" } },
    { id: "velocity-arrow", name: "Velocity Arrow", category: "Vectors", icon: "VEL", simulationType: "field", defaults: { width: 90, height: 12, isStatic: true, color: "#38bdf8" } },
    { id: "acceleration-arrow", name: "Acceleration Arrow", category: "Vectors", icon: "ACC", simulationType: "field", defaults: { width: 90, height: 12, isStatic: true, color: "#fb923c" } },
    { id: "stopwatch", name: "Stopwatch", category: "Instruments", icon: "TIM", simulationType: "field", defaults: { width: 54, height: 54, isStatic: true, color: "#e2e8f0" } },
    { id: "ruler", name: "Ruler", category: "Instruments", icon: "RUL", simulationType: "field", defaults: { width: 180, height: 18, isStatic: true, color: "#fde68a" } },
    { id: "protractor", name: "Protractor", category: "Instruments", icon: "ANG", simulationType: "field", defaults: { width: 92, height: 46, isStatic: true, color: "#f9a8d4" } },
    { id: "graph-plotter", name: "Graph Plotter", category: "Instruments", icon: "GRF", simulationType: "field", defaults: { width: 68, height: 52, isStatic: true, color: "#22d3ee" } },
    { id: "motion-sensor", name: "Motion Sensor", category: "Instruments", icon: "MOT", simulationType: "field", defaults: { width: 62, height: 34, isStatic: true, color: "#818cf8" } },
    { id: "force-sensor", name: "Force Sensor", category: "Instruments", icon: "SEN", simulationType: "field", defaults: { width: 62, height: 34, isStatic: true, color: "#fb7185" } },
    { id: "light-ray", name: "Light Ray", category: "Optics", icon: "RAY", simulationType: "optics", defaults: { width: 160, height: 6, isStatic: true, color: "#fef08a" } },
    { id: "plane-mirror", name: "Plane Mirror", category: "Optics", icon: "MIR", simulationType: "optics", defaults: { width: 18, height: 150, isStatic: true, color: "#93c5fd" } },
    { id: "convex-lens", name: "Convex Lens", category: "Optics", icon: "LEN", simulationType: "optics", defaults: { width: 36, height: 150, isStatic: true, color: "#67e8f9" } },
    { id: "charge", name: "Charge", category: "Electricity", icon: "Q", simulationType: "field", defaults: { radius: 22, mass: 0.1, charge: 1, isStatic: true, color: "#22d3ee" } },
    { id: "electric-field-region", name: "Electric Field Region", category: "Electricity", icon: "E", simulationType: "field", defaults: { width: 180, height: 110, isStatic: true, color: "#06b6d4" } },
    { id: "bar-magnet", name: "Bar Magnet", category: "Magnetism", icon: "MAG", simulationType: "field", defaults: { width: 130, height: 34, isStatic: true, color: "#d946ef" } },
    { id: "thermometer", name: "Thermometer", category: "Thermal", icon: "TMP", simulationType: "thermal", defaults: { width: 26, height: 120, temperature: 298, isStatic: true, color: "#ef4444" } },
    { id: "gas-container", name: "Gas Container", category: "Thermodynamics", icon: "GAS", simulationType: "thermal", defaults: { width: 150, height: 110, pressure: 101325, temperature: 300, isStatic: true, color: "#f97316" } },
  ];

  return entries.map((entry) => ({
    id: entry.id,
    name: entry.name,
    category: entry.category,
    icon: entry.icon,
    defaultProperties: {
      width: 56,
      height: 36,
      mass: 1,
      friction: 0.08,
      restitution: 0.35,
      ...entry.defaults,
    },
    editableProperties: entry.editable ?? sharedRigidProperties,
    renderType: "canvas",
    simulationType: entry.simulationType,
  }));
}

export function createObject(kind: PhysicsObjectKind, x = 300, y = 160): PhysicsObjectInstance {
  const def = objectRegistry.find((item) => item.id === kind);
  if (!def) throw new Error(`Unknown physics object: ${kind}`);
  const defaults = def.defaultProperties;
  return {
    id: crypto.randomUUID(),
    kind,
    name: def.name,
    x,
    y,
    angle: Number(defaults.angle ?? 0),
    width: Number(defaults.width ?? 48),
    height: Number(defaults.height ?? 48),
    radius: Number(defaults.radius ?? 22),
    mass: Number(defaults.mass ?? 1),
    vx: 0,
    vy: 0,
    ax: 0,
    ay: 0,
    friction: Number(defaults.friction ?? 0.1),
    restitution: Number(defaults.restitution ?? 0.4),
    isStatic: Boolean(defaults.isStatic ?? false),
    locked: Boolean(defaults.locked ?? false),
    color: String(defaults.color ?? "#38bdf8"),
    charge: Number(defaults.charge ?? 0),
    temperature: Number(defaults.temperature ?? 293.15),
    density: Number(defaults.density ?? 1000),
    material: String(defaults.material ?? "default"),
    springConstant: Number(defaults.springConstant ?? 0),
    damping: Number(defaults.damping ?? 0.02),
    airDrag: Number(defaults.airDrag ?? 0.05),
    motorSpeed: Number(defaults.motorSpeed ?? 0),
    motorTorque: Number(defaults.motorTorque ?? 0),
    torque: Number(defaults.torque ?? 0),
    length: Number(defaults.length ?? 120),
    pivotX: Number(defaults.pivotX ?? x),
    pivotY: Number(defaults.pivotY ?? y - 120),
    trail: [],
  };
}
