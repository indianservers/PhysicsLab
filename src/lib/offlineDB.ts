import type { GraphTraceConfig, ObservationRow, PhysicsObjectInstance } from "../types";

const DB_NAME = "physicslab-offline";
const DB_VERSION = 2;
const EXPERIMENTS_STORE = "experiments";
const XAPI_STORE = "xapi-queue";
const ARTIFACT_STORES = ["reports", "graph-exports", "teacher-packs", "validation-metadata", "student-progress"] as const;

export type LocalArtifactStore = typeof ARTIFACT_STORES[number];

export interface ExperimentSnapshot {
  key: string;
  savedAt: string;
  objects: PhysicsObjectInstance[];
  settings: {
    gravity: number;
    timeScale: number;
    airResistance: boolean;
    showGrid: boolean;
    showVectors: boolean;
  };
  observationRows: ObservationRow[];
  graphTraces: GraphTraceConfig[];
}

export interface LocalArtifact<T = unknown> {
  id: string;
  type: LocalArtifactStore;
  title: string;
  createdAt: string;
  updatedAt: string;
  payload: T;
}

let _db: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (_db) return _db;
  _db = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(EXPERIMENTS_STORE))
        db.createObjectStore(EXPERIMENTS_STORE, { keyPath: "key" });
      if (!db.objectStoreNames.contains(XAPI_STORE))
        db.createObjectStore(XAPI_STORE, { keyPath: "id", autoIncrement: true });
      for (const store of ARTIFACT_STORES) {
        if (!db.objectStoreNames.contains(store))
          db.createObjectStore(store, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      _db = null;
      reject(req.error);
    };
  });
  return _db;
}

function txStore(db: IDBDatabase, storeName: string, mode: IDBTransactionMode) {
  return db.transaction(storeName, mode).objectStore(storeName);
}

export async function saveExperimentState(snapshot: ExperimentSnapshot): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(EXPERIMENTS_STORE, "readwrite");
    tx.objectStore(EXPERIMENTS_STORE).put(snapshot);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadExperimentState(key: string): Promise<ExperimentSnapshot | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(EXPERIMENTS_STORE, "readonly");
    const req = tx.objectStore(EXPERIMENTS_STORE).get(key);
    req.onsuccess = () => resolve((req.result as ExperimentSnapshot | undefined) ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteExperimentState(key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(EXPERIMENTS_STORE, "readwrite");
    tx.objectStore(EXPERIMENTS_STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function listExperimentStates(): Promise<ExperimentSnapshot[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(EXPERIMENTS_STORE, "readonly");
    const req = tx.objectStore(EXPERIMENTS_STORE).getAll();
    req.onsuccess = () => resolve((req.result as ExperimentSnapshot[]).sort((a, b) => b.savedAt.localeCompare(a.savedAt)));
    req.onerror = () => reject(req.error);
  });
}

export async function importExperimentStates(snapshots: ExperimentSnapshot[]): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(EXPERIMENTS_STORE, "readwrite");
    const store = tx.objectStore(EXPERIMENTS_STORE);
    let count = 0;
    for (const snapshot of snapshots) {
      if (!snapshot.key || !snapshot.savedAt || !Array.isArray(snapshot.objects)) continue;
      store.put(snapshot);
      count++;
    }
    tx.oncomplete = () => resolve(count);
    tx.onerror = () => reject(tx.error);
  });
}

export async function saveLocalArtifact<T>(storeName: LocalArtifactStore, artifact: Omit<LocalArtifact<T>, "type" | "createdAt" | "updatedAt"> & Partial<Pick<LocalArtifact<T>, "createdAt" | "updatedAt">>): Promise<LocalArtifact<T>> {
  const db = await openDB();
  const now = new Date().toISOString();
  const full: LocalArtifact<T> = {
    ...artifact,
    type: storeName,
    createdAt: artifact.createdAt ?? now,
    updatedAt: now,
  };
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).put(full);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  return full;
}

export async function listLocalArtifacts(storeName: LocalArtifactStore): Promise<LocalArtifact[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = txStore(db, storeName, "readonly").getAll();
    req.onsuccess = () => resolve((req.result as LocalArtifact[]).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
    req.onerror = () => reject(req.error);
  });
}

export async function importLocalArtifacts(storeName: LocalArtifactStore, artifacts: LocalArtifact[]): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    let count = 0;
    for (const artifact of artifacts) {
      if (!artifact.id || !artifact.title) continue;
      store.put({ ...artifact, type: storeName });
      count++;
    }
    tx.oncomplete = () => resolve(count);
    tx.onerror = () => reject(tx.error);
  });
}

export async function queueXAPIStatement(statement: Record<string, unknown>): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(XAPI_STORE, "readwrite");
    tx.objectStore(XAPI_STORE).add({ statement, queuedAt: new Date().toISOString() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function flushXAPIQueue(endpoint: string, auth: string | null): Promise<number> {
  const db = await openDB();
  const records: Array<{ id: number; statement: Record<string, unknown> }> = await new Promise(
    (resolve, reject) => {
      const tx = db.transaction(XAPI_STORE, "readonly");
      const req = tx.objectStore(XAPI_STORE).getAll();
      req.onsuccess = () =>
        resolve(req.result as Array<{ id: number; statement: Record<string, unknown> }>);
      req.onerror = () => reject(req.error);
    },
  );
  let flushed = 0;
  for (const record of records) {
    try {
      await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Experience-API-Version": "1.0.3",
          ...(auth ? { Authorization: `Basic ${auth}` } : {}),
        },
        body: JSON.stringify(record.statement),
      });
      await new Promise<void>((res, rej) => {
        const tx = db.transaction(XAPI_STORE, "readwrite");
        tx.objectStore(XAPI_STORE).delete(record.id);
        tx.oncomplete = () => res();
        tx.onerror = () => rej(tx.error);
      });
      flushed++;
    } catch {
      break;
    }
  }
  return flushed;
}
