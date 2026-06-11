import { create } from "zustand";
import { AccessibilitySettings, GraphPoint, GraphTraceConfig, GraphVariable, ObservationRow, PhysicsObjectInstance, PhysicsObjectKind, ProjectFile, UnitSystem, ViewportState } from "../types";
import { createObject } from "../lib/objectRegistry";
import { projectileDefaults } from "../lib/experiments";
import { getMeasurementAdapter, isGraphableVariable } from "../engine/measurementAdapters";

interface ProjectileControls {
  speed: number;
  angle: number;
  gravity: number;
  mass: number;
  airResistance: boolean;
}

interface LabState {
  objects: PhysicsObjectInstance[];
  undoStack: PhysicsObjectInstance[][];
  redoStack: PhysicsObjectInstance[][];
  selectedId?: string;
  running: boolean;
  gravity: number;
  timeScale: number;
  airResistance: boolean;
  airDensity: number;
  showGrid: boolean;
  showVectors: boolean;
  showTrails: boolean;
  theme: "dark" | "light";
  graphData: GraphPoint[];
  graphPaused: boolean;
  graphSplit: boolean;
  graphTraces: GraphTraceConfig[];
  cursorIndex: number;
  observationRows: ObservationRow[];
  unitSystem: UnitSystem;
  significantFigures: number;
  accessibility: AccessibilitySettings;
  simulationTime: number;
  stepSignal: number;
  engineWarnings: string[];
  viewport: ViewportState;
  selectedTool: "select" | "wire";
  projectile: ProjectileControls;
  addObject: (kind: PhysicsObjectKind, x?: number, y?: number, patch?: Partial<PhysicsObjectInstance>) => void;
  selectObject: (id?: string) => void;
  updateObject: (id: string, patch: Partial<PhysicsObjectInstance>) => void;
  removeSelected: () => void;
  duplicateSelected: () => void;
  undo: () => void;
  redo: () => void;
  setObjects: (objects: PhysicsObjectInstance[]) => void;
  setRunning: (running: boolean) => void;
  toggleRunning: () => void;
  resetSandbox: () => void;
  resetGraph: () => void;
  pushGraphPoint: (point: GraphPoint) => void;
  setGraphPaused: (graphPaused: boolean) => void;
  setGraphSplit: (graphSplit: boolean) => void;
  setGraphTrace: (id: string, patch: Partial<GraphTraceConfig>) => void;
  addGraphTrace: (xKey: GraphVariable, yKey: GraphVariable) => void;
  setCursorIndex: (cursorIndex: number) => void;
  addObservationRow: () => void;
  updateObservationRow: (id: string, patch: Partial<ObservationRow>) => void;
  removeObservationRow: (id: string) => void;
  setUnitSystem: (unitSystem: UnitSystem) => void;
  setSignificantFigures: (significantFigures: number) => void;
  setAccessibility: (patch: Partial<AccessibilitySettings>) => void;
  setSimulationTime: (time: number) => void;
  setGravity: (gravity: number) => void;
  setTimeScale: (timeScale: number) => void;
  setAirResistance: (airResistance: boolean) => void;
  stepSimulation: () => void;
  setEngineWarnings: (engineWarnings: string[]) => void;
  setViewport: (viewport: Partial<ViewportState>) => void;
  resetViewport: () => void;
  setSelectedTool: (selectedTool: "select" | "wire") => void;
  setTheme: (theme: "dark" | "light") => void;
  toggleGrid: () => void;
  toggleVectors: () => void;
  toggleTrails: () => void;
  updateProjectile: (patch: Partial<ProjectileControls>) => void;
  loadProject: (project: ProjectFile) => void;
  toProject: (name?: string, mode?: "guided" | "sandbox") => ProjectFile;
}

const initialObjects = () => [
  createObject("floor", 460, 560),
  createObject("wall", 34, 350),
  createObject("ball", 190, 140),
  createObject("block", 320, 120),
  createObject("ramp", 570, 430),
];

export const useLabStore = create<LabState>((set, get) => ({
  objects: initialObjects(),
  undoStack: [],
  redoStack: [],
  running: false,
  gravity: 9.81,
  timeScale: 1,
  airResistance: false,
  airDensity: 1,
  showGrid: true,
  showVectors: true,
  showTrails: true,
  theme: "light",
  graphData: [],
  graphPaused: false,
  graphSplit: false,
  graphTraces: [
    withTraceTrust({ id: "x-time", xKey: "t", yKey: "x", label: "x vs t", color: "#22d3ee", enabled: true, errorPercent: 0 }),
    withTraceTrust({ id: "y-time", xKey: "t", yKey: "y", label: "y vs t", color: "#34d399", enabled: true, errorPercent: 0 }),
    withTraceTrust({ id: "speed-time", xKey: "t", yKey: "speed", label: "speed vs t", color: "#fb923c", enabled: true, errorPercent: 0 }),
    withTraceTrust({ id: "energy-time", xKey: "t", yKey: "totalEnergy", label: "totalEnergy vs t", color: "#facc15", enabled: false, errorPercent: 1 }),
  ],
  cursorIndex: 0,
  observationRows: [],
  unitSystem: "SI",
  significantFigures: 4,
  accessibility: { highContrast: false, largeUi: false, colorBlindSafe: false, reducedMotion: false },
  simulationTime: 0,
  stepSignal: 0,
  engineWarnings: [],
  viewport: { offsetX: 0, offsetY: 0, zoom: 1 },
  selectedTool: "select",
  projectile: projectileDefaults,
  addObject: (kind, x = 280, y = 120, patch = {}) =>
    set((state) => {
      const object = { ...createObject(kind, x, y), ...patch };
      return { undoStack: [...state.undoStack.slice(-19), state.objects], redoStack: [], objects: [...state.objects, object], selectedId: object.id };
    }),
  selectObject: (id) => set({ selectedId: id }),
  updateObject: (id, patch) =>
    set((state) => ({
      undoStack: [...state.undoStack.slice(-19), state.objects],
      redoStack: [],
      objects: state.objects.map((object) => (object.id === id ? { ...object, ...patch } : object)),
    })),
  removeSelected: () =>
    set((state) => ({
      undoStack: [...state.undoStack.slice(-19), state.objects],
      redoStack: [],
      objects: state.objects.filter((object) => object.id !== state.selectedId),
      selectedId: undefined,
    })),
  duplicateSelected: () =>
    set((state) => {
      const selected = state.objects.find((object) => object.id === state.selectedId);
      if (!selected) return state;
      const copy = {
        ...selected,
        id: crypto.randomUUID(),
        name: `${selected.name} copy`,
        x: selected.x + 32,
        y: selected.y + 32,
        trail: [],
      };
      return { undoStack: [...state.undoStack.slice(-19), state.objects], redoStack: [], objects: [...state.objects, copy], selectedId: copy.id };
    }),
  undo: () => set((state) => {
    const previous = state.undoStack[state.undoStack.length - 1];
    if (!previous) return state;
    return { objects: previous, undoStack: state.undoStack.slice(0, -1), redoStack: [...state.redoStack, state.objects], selectedId: undefined };
  }),
  redo: () => set((state) => {
    const next = state.redoStack[state.redoStack.length - 1];
    if (!next) return state;
    return { objects: next, redoStack: state.redoStack.slice(0, -1), undoStack: [...state.undoStack, state.objects], selectedId: undefined };
  }),
  setObjects: (objects) => set((state) => ({ undoStack: [...state.undoStack.slice(-19), state.objects], redoStack: [], objects })),
  setRunning: (running) => set({ running }),
  toggleRunning: () => set((state) => ({ running: !state.running })),
  resetSandbox: () => set({ objects: initialObjects(), graphData: [], observationRows: [], simulationTime: 0, running: false, selectedId: undefined, engineWarnings: [], viewport: { offsetX: 0, offsetY: 0, zoom: 1 } }),
  resetGraph: () => set({ graphData: [], observationRows: [], simulationTime: 0 }),
  pushGraphPoint: (point) =>
    set((state) => state.graphPaused ? state : ({
      graphData: [...state.graphData.slice(-399), point],
      simulationTime: point.t,
    })),
  setGraphPaused: (graphPaused) => set({ graphPaused }),
  setGraphSplit: (graphSplit) => set({ graphSplit }),
  setGraphTrace: (id, patch) => set((state) => ({ graphTraces: state.graphTraces.map((trace) => trace.id === id ? { ...trace, ...patch } : trace) })),
  addGraphTrace: (xKey, yKey) => set((state) => {
    if (!isGraphableVariable(xKey) || !isGraphableVariable(yKey)) {
      console.warn(`[graphs] Cannot add trace ${String(yKey)} vs ${String(xKey)} because one variable has no measurement adapter.`);
      return state;
    }
    return { graphTraces: [...state.graphTraces, withTraceTrust({ id: crypto.randomUUID(), xKey, yKey, label: `${String(yKey)} vs ${String(xKey)}`, color: "#22d3ee", enabled: true, errorPercent: 0 })] };
  }),
  setCursorIndex: (cursorIndex) => set({ cursorIndex }),
  addObservationRow: () => set((state) => ({ observationRows: [...state.observationRows, { id: crypto.randomUUID(), label: `Trial ${state.observationRows.length + 1}`, measured: 0, expected: 0, unit: "m", note: "" }] })),
  updateObservationRow: (id, patch) => set((state) => ({ observationRows: state.observationRows.map((row) => row.id === id ? { ...row, ...patch } : row) })),
  removeObservationRow: (id) => set((state) => ({ observationRows: state.observationRows.filter((row) => row.id !== id) })),
  setUnitSystem: (unitSystem) => set({ unitSystem }),
  setSignificantFigures: (significantFigures) => set({ significantFigures: Math.max(2, Math.min(8, significantFigures)) }),
  setAccessibility: (patch) => set((state) => ({ accessibility: { ...state.accessibility, ...patch } })),
  setSimulationTime: (simulationTime) => set({ simulationTime }),
  setGravity: (gravity) => set({ gravity }),
  setTimeScale: (timeScale) => set({ timeScale }),
  setAirResistance: (airResistance) => set({ airResistance }),
  stepSimulation: () => set((state) => ({ stepSignal: state.stepSignal + 1, running: false })),
  setEngineWarnings: (engineWarnings) => set({ engineWarnings }),
  setViewport: (viewport) =>
    set((state) => ({
      viewport: {
        offsetX: viewport.offsetX ?? state.viewport.offsetX,
        offsetY: viewport.offsetY ?? state.viewport.offsetY,
        zoom: Math.max(0.25, Math.min(3, viewport.zoom ?? state.viewport.zoom)),
      },
    })),
  resetViewport: () => set({ viewport: { offsetX: 0, offsetY: 0, zoom: 1 } }),
  setSelectedTool: (selectedTool) => set({ selectedTool }),
  setTheme: (theme) => set({ theme }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleVectors: () => set((state) => ({ showVectors: !state.showVectors })),
  toggleTrails: () => set((state) => ({ showTrails: !state.showTrails })),
  updateProjectile: (patch) => set((state) => ({ projectile: { ...state.projectile, ...patch } })),
  loadProject: (project) =>
    set({
      objects: project.objects,
      graphData: project.graphs,
      gravity: project.simulationSettings.gravity,
      timeScale: project.simulationSettings.timeScale,
      airResistance: project.simulationSettings.airResistance,
      running: false,
      selectedId: undefined,
    }),
  toProject: (name = "PhysicsLab Project", mode = "sandbox") => {
    const state = get();
    const now = new Date().toISOString();
    return {
      version: "1.0.0",
      name,
      mode,
      topic: "mechanics",
      objects: state.objects,
      fields: [],
      instruments: [],
      graphs: state.graphData,
      experimentData: state.graphData,
      simulationSettings: {
        gravity: state.gravity,
        airResistance: state.airResistance,
        timeScale: state.timeScale,
      },
      createdAt: now,
      updatedAt: now,
    };
  },
}));

function withTraceTrust(trace: GraphTraceConfig): GraphTraceConfig {
  const yAdapter = getMeasurementAdapter(trace.yKey);
  return {
    ...trace,
    sourceType: yAdapter?.sourceModel,
    scientificConfidence: yAdapter?.confidence,
    assumptions: yAdapter?.assumptions,
  };
}
