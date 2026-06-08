import type { GraphTraceConfig, ObservationRow, PhysicsObjectInstance } from "../types";

const DB_NAME = "physicslab-offline";
const DB_VERSION = 1;
const EXPERIMENTS_STORE = "experiments";
const XAPI_STORE = "xapi-queue";

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
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      _db = null;
      reject(req.error);
    };
  });
  return _db;
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
