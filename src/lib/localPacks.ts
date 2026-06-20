import { experiments } from "./experiments";
import { importLearningRecords, LearningRecord, listLearningRecords } from "./learning";
import { ExperimentSnapshot, importExperimentStates, importLocalArtifacts, listExperimentStates, listLocalArtifacts, LocalArtifact, LocalArtifactStore } from "./offlineDB";
import { importProjects, listProjects } from "./storage";
import { exportAssignments, importAssignments, listAssignments, TeacherAssignment } from "./teacher";
import { ProjectFile } from "../types";
import { createValidationSummary } from "./scientificSources";

export type PhysicsLabPackKind = "full-backup" | "class-pack" | "progress-pack";

export interface LocalStorageRecord {
  key: string;
  value: string;
  category: "preferences" | "quiz" | "achievements" | "xapi" | "misc";
  sensitive?: boolean;
}

export interface PhysicsLabPack {
  kind: PhysicsLabPackKind;
  version: "2.0.0";
  app: "PhysicsLab 100";
  browserOnly: true;
  exportedAt: string;
  notes: string[];
  payload: {
    projects?: ProjectFile[];
    assignments?: TeacherAssignment[];
    learningRecords?: LearningRecord[];
    experimentSnapshots?: ExperimentSnapshot[];
    localStorage?: LocalStorageRecord[];
    artifacts?: Partial<Record<LocalArtifactStore, LocalArtifact[]>>;
    validationMetadata?: {
      experimentCount: number;
      generatedFrom: "local experiment metadata";
      maturityCounts: Record<string, number>;
      evidenceCounts: Record<string, number>;
    };
  };
}

const LOCAL_STORAGE_EXPORT_KEYS = [
  "lang",
  "audio_enabled",
  "audio_volume",
  "physicslab-achievements-v1",
  "physicslab-xp-v1",
  "physicslab-visited-experiments-v1",
  "physicslab-visited-categories-v1",
  "physicslab-quiz-best-v1",
  "physicslab-quiz-weak-concepts-v1",
  "physicslab_auto_slowmo",
  "physicslab_formula_overlay",
  "physicslab_canvas_theme",
  "physicslab_onboarding_done",
  "xapi_endpoint",
  "xapi_actor_name",
  "xapi_actor_email",
] as const;

const ARTIFACT_STORES: LocalArtifactStore[] = ["reports", "graph-exports", "teacher-packs", "validation-metadata", "student-progress"];

export async function createFullBackupPack(): Promise<PhysicsLabPack> {
  const artifacts = await collectArtifacts();
  return {
    kind: "full-backup",
    version: "2.0.0",
    app: "PhysicsLab 100",
    browserOnly: true,
    exportedAt: new Date().toISOString(),
    notes: [
      "This pack is a browser-only backup. It contains local projects, assignments, progress records, preferences, and IndexedDB autosaves.",
      "No server account, cloud sync, or hidden upload is used.",
      "Basic-auth xAPI credentials are intentionally not exported.",
    ],
    payload: {
      projects: await listProjects(),
      assignments: listAssignments(),
      learningRecords: listLearningRecords(),
      experimentSnapshots: await listExperimentStates(),
      localStorage: exportLocalStorageRecords(),
      artifacts,
      validationMetadata: validationMetadata(),
    },
  };
}

export function createClassPack(): PhysicsLabPack {
  return {
    kind: "class-pack",
    version: "2.0.0",
    app: "PhysicsLab 100",
    browserOnly: true,
    exportedAt: new Date().toISOString(),
    notes: ["Portable teacher assignment pack. Students can import it in another browser without a server."],
    payload: {
      assignments: exportAssignments().assignments,
      validationMetadata: validationMetadata(),
    },
  };
}

export async function createProgressPack(): Promise<PhysicsLabPack> {
  const artifacts = await collectProgressArtifacts();
  return {
    kind: "progress-pack",
    version: "2.0.0",
    app: "PhysicsLab 100",
    browserOnly: true,
    exportedAt: new Date().toISOString(),
    notes: [
      "Portable student progress pack. It contains local guided-learning records, quiz portfolio data, notebooks, and generated reports.",
      "No server upload is used. Share this file when a teacher needs notebook evidence from another browser.",
    ],
    payload: {
      learningRecords: listLearningRecords(),
      localStorage: exportLocalStorageRecords().filter((record) => record.category === "quiz" || record.category === "achievements"),
      artifacts,
      validationMetadata: {
        ...validationMetadata(),
        generatedFrom: "local experiment metadata",
      },
    },
  };
}

export async function importPhysicsLabPack(input: unknown): Promise<Record<string, number>> {
  const pack = normalizePack(input);
  const result: Record<string, number> = {};
  if (pack.payload.projects?.length) result.projects = await importProjects(pack.payload.projects);
  if (pack.payload.assignments?.length) result.assignments = importAssignments({ assignments: pack.payload.assignments });
  if (pack.payload.learningRecords?.length) result.learningRecords = importLearningRecords(pack.payload.learningRecords);
  if (pack.payload.experimentSnapshots?.length) result.experimentSnapshots = await importExperimentStates(pack.payload.experimentSnapshots);
  if (pack.payload.localStorage?.length) result.localStorage = importLocalStorageRecords(pack.payload.localStorage);
  if (pack.payload.artifacts) {
    let artifactCount = 0;
    for (const store of ARTIFACT_STORES) {
      const artifacts = pack.payload.artifacts[store];
      if (artifacts?.length) artifactCount += await importLocalArtifacts(store, artifacts);
    }
    result.artifacts = artifactCount;
  }
  return result;
}

export function downloadPack(pack: PhysicsLabPack) {
  const blob = new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileNameForPack(pack);
  link.click();
  URL.revokeObjectURL(url);
}

export function fileNameForPack(pack: Pick<PhysicsLabPack, "kind" | "exportedAt">) {
  const stamp = pack.exportedAt.slice(0, 10);
  if (pack.kind === "class-pack") return `physicslab-${stamp}.physicslab-class.json`;
  if (pack.kind === "progress-pack") return `physicslab-${stamp}.physicslab-progress.json`;
  return `physicslab-${stamp}.physicslab-pack.json`;
}

export function packSummary(pack: PhysicsLabPack) {
  const artifactCounts = Object.fromEntries(Object.entries(pack.payload.artifacts ?? {}).map(([store, items]) => [store, items?.length ?? 0]));
  return {
    projects: pack.payload.projects?.length ?? 0,
    assignments: pack.payload.assignments?.length ?? 0,
    learningRecords: pack.payload.learningRecords?.length ?? 0,
    experimentSnapshots: pack.payload.experimentSnapshots?.length ?? 0,
    localStorage: pack.payload.localStorage?.length ?? 0,
    artifacts: Object.values(pack.payload.artifacts ?? {}).reduce((sum, items) => sum + (items?.length ?? 0), 0),
    studentProgress: artifactCounts["student-progress"] ?? 0,
    reports: artifactCounts.reports ?? 0,
  };
}

async function collectArtifacts() {
  const entries = await Promise.all(ARTIFACT_STORES.map(async (store) => [store, await listLocalArtifacts(store)] as const));
  return Object.fromEntries(entries.filter(([, items]) => items.length > 0)) as PhysicsLabPack["payload"]["artifacts"];
}

async function collectProgressArtifacts() {
  const stores: LocalArtifactStore[] = ["student-progress", "reports", "graph-exports"];
  const entries = await Promise.all(stores.map(async (store) => [store, await listLocalArtifacts(store)] as const));
  return Object.fromEntries(entries.filter(([, items]) => items.length > 0)) as PhysicsLabPack["payload"]["artifacts"];
}

function normalizePack(input: unknown): PhysicsLabPack {
  const pack = input as Partial<PhysicsLabPack> & { assignments?: TeacherAssignment[]; records?: LearningRecord[] };
  if (pack.app === "PhysicsLab 100" && pack.version && pack.payload) return pack as PhysicsLabPack;
  if (Array.isArray(pack.assignments)) {
    return { kind: "class-pack", version: "2.0.0", app: "PhysicsLab 100", browserOnly: true, exportedAt: new Date().toISOString(), notes: ["Imported legacy assignment export."], payload: { assignments: pack.assignments } };
  }
  if (Array.isArray(pack.records)) {
    return { kind: "progress-pack", version: "2.0.0", app: "PhysicsLab 100", browserOnly: true, exportedAt: new Date().toISOString(), notes: ["Imported legacy learning export."], payload: { learningRecords: pack.records } };
  }
  throw new Error("This file is not a recognized PhysicsLab pack.");
}

function exportLocalStorageRecords(): LocalStorageRecord[] {
  return LOCAL_STORAGE_EXPORT_KEYS.flatMap((key) => {
    const value = localStorage.getItem(key);
    if (value === null) return [];
    return [{ key, value, category: categoryForKey(key), sensitive: key.startsWith("xapi_") }];
  });
}

function importLocalStorageRecords(records: LocalStorageRecord[]) {
  let count = 0;
  for (const record of records) {
    if (!record.key || typeof record.value !== "string") continue;
    if (record.key === "xapi_auth") continue;
    localStorage.setItem(record.key, record.value);
    count++;
  }
  return count;
}

function categoryForKey(key: string): LocalStorageRecord["category"] {
  if (key.includes("quiz")) return "quiz";
  if (key.includes("achievement") || key.includes("xp") || key.includes("visited")) return "achievements";
  if (key.startsWith("xapi_")) return "xapi";
  if (key === "lang" || key.includes("audio") || key.includes("canvas") || key.includes("slowmo") || key.includes("overlay") || key.includes("onboarding")) return "preferences";
  return "misc";
}

function validationMetadata(): NonNullable<PhysicsLabPack["payload"]["validationMetadata"]> {
  const summary = createValidationSummary();
  return {
    experimentCount: summary.experimentCount,
    generatedFrom: "local experiment metadata",
    maturityCounts: summary.maturityCounts,
    evidenceCounts: summary.evidenceCounts,
  };
}

function countBy(getKey: (experiment: typeof experiments[number]) => string) {
  return experiments.reduce<Record<string, number>>((acc, experiment) => {
    const key = getKey(experiment);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}
