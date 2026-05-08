import { create } from "zustand";
import { GraphPoint, PhysicsObjectInstance, PhysicsObjectKind, ProjectFile } from "../types";
import { createObject } from "../lib/objectRegistry";
import { projectileDefaults } from "../lib/experiments";

interface ProjectileControls {
  speed: number;
  angle: number;
  gravity: number;
  mass: number;
  airResistance: boolean;
}

interface LabState {
  objects: PhysicsObjectInstance[];
  selectedId?: string;
  running: boolean;
  gravity: number;
  timeScale: number;
  showGrid: boolean;
  showVectors: boolean;
  showTrails: boolean;
  theme: "dark" | "light";
  graphData: GraphPoint[];
  simulationTime: number;
  projectile: ProjectileControls;
  addObject: (kind: PhysicsObjectKind, x?: number, y?: number) => void;
  selectObject: (id?: string) => void;
  updateObject: (id: string, patch: Partial<PhysicsObjectInstance>) => void;
  removeSelected: () => void;
  duplicateSelected: () => void;
  setObjects: (objects: PhysicsObjectInstance[]) => void;
  setRunning: (running: boolean) => void;
  toggleRunning: () => void;
  resetSandbox: () => void;
  resetGraph: () => void;
  pushGraphPoint: (point: GraphPoint) => void;
  setSimulationTime: (time: number) => void;
  setGravity: (gravity: number) => void;
  setTimeScale: (timeScale: number) => void;
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
  running: false,
  gravity: 9.81,
  timeScale: 1,
  showGrid: true,
  showVectors: true,
  showTrails: true,
  theme: "dark",
  graphData: [],
  simulationTime: 0,
  projectile: projectileDefaults,
  addObject: (kind, x = 280, y = 120) =>
    set((state) => {
      const object = createObject(kind, x, y);
      return { objects: [...state.objects, object], selectedId: object.id };
    }),
  selectObject: (id) => set({ selectedId: id }),
  updateObject: (id, patch) =>
    set((state) => ({
      objects: state.objects.map((object) => (object.id === id ? { ...object, ...patch } : object)),
    })),
  removeSelected: () =>
    set((state) => ({
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
      return { objects: [...state.objects, copy], selectedId: copy.id };
    }),
  setObjects: (objects) => set({ objects }),
  setRunning: (running) => set({ running }),
  toggleRunning: () => set((state) => ({ running: !state.running })),
  resetSandbox: () => set({ objects: initialObjects(), graphData: [], simulationTime: 0, running: false, selectedId: undefined }),
  resetGraph: () => set({ graphData: [], simulationTime: 0 }),
  pushGraphPoint: (point) =>
    set((state) => ({
      graphData: [...state.graphData.slice(-399), point],
      simulationTime: point.t,
    })),
  setSimulationTime: (simulationTime) => set({ simulationTime }),
  setGravity: (gravity) => set({ gravity }),
  setTimeScale: (timeScale) => set({ timeScale }),
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
        airResistance: state.projectile.airResistance,
        timeScale: state.timeScale,
      },
      createdAt: now,
      updatedAt: now,
    };
  },
}));
